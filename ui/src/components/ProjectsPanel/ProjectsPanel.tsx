import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { X, Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { api } from '../../services/projectAPI';
import type { Project } from '../../index';

interface ProjectsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndexes.modal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Panel = styled.div`
  background-color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const PanelHeader = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;

  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    color: ${props => props.theme.colors.text};
  }
`;

const PanelContent = styled.div`
  padding: ${props => props.theme.spacing.md};
  max-height: 60vh;
  overflow-y: auto;
`;

const CreateProjectSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CreateProjectForm = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const ProjectInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 2px;
  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const CreateButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &:disabled {
    background-color: ${props => props.theme.colors.secondary};
    cursor: not-allowed;
  }
`;

const ProjectsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const ProjectItem = styled.div<{ isClickable?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 2px;
  background-color: ${props => props.theme.colors.secondary};
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};

  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
`;

const ProjectIcon = styled.div`
  color: ${props => props.theme.colors.accent};
  display: flex;
  align-items: center;
`;

const ProjectInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProjectName = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

const ProjectMeta = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProjectActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const ActionButton = styled.button<{ variant?: 'danger' }>`
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.variant === 'danger' ? props.theme.colors.error : props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;

  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    color: ${props => props.variant === 'danger' ? props.theme.colors.error : props.theme.colors.text};
  }
`;

const EditInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  border: 1px solid ${props => props.theme.colors.accent};
  border-radius: 2px;
  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  &:focus {
    outline: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`;

export function ProjectsPanel({ isOpen, onClose }: ProjectsPanelProps) {
  const { state, loadProject } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingProject && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await api.projects.getProjects();
      setProjects(projectsData);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const newProject = await api.projects.createProject({
      id: `project-${Date.now()}`,
      name: newProjectName.trim()
    });
    
    setProjects(prev => [...prev, newProject]);
    setNewProjectName('');
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    await api.projects.deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleStartEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditName(project.name);
  };

  const handleSaveEdit = async (projectId: string) => {
    if (!editName.trim()) return;

    const updatedProject = await api.projects.updateProject(projectId, editName.trim());
    setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
    setEditingProject(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, projectId: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(projectId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleProjectClick = async (project: Project) => {
    await loadProject(project.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <PanelOverlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <PanelHeader>
          <PanelTitle>Projects</PanelTitle>
          <CloseButton onClick={onClose}>
            <X size={16} />
          </CloseButton>
        </PanelHeader>
        
        <PanelContent>
          <CreateProjectSection>
            <CreateProjectForm>
              <ProjectInput
                type="text"
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              />
              <CreateButton
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                <Plus size={14} />
                Create Project
              </CreateButton>
            </CreateProjectForm>
          </CreateProjectSection>

          <ProjectsList>
            {loading ? (
              <EmptyState>Loading projects...</EmptyState>
            ) : projects.length === 0 ? (
              <EmptyState>No projects found. Create your first project above!</EmptyState>
            ) : (
              projects.map((project) => (
                <ProjectItem 
                  key={project.id}
                  isClickable={editingProject !== project.id}
                  onClick={editingProject !== project.id ? () => handleProjectClick(project) : undefined}
                >
                  <ProjectIcon>
                    <Folder size={16} />
                  </ProjectIcon>
                  
                  <ProjectInfo>
                    {editingProject === project.id ? (
                      <EditInput
                        ref={editInputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, project.id)}
                        onBlur={() => handleSaveEdit(project.id)}
                      />
                    ) : (
                      <>
                        <ProjectName>
                          {project.name}
                        </ProjectName>
                        <ProjectMeta>
                          ID: {project.id}
                          {project.id === state.project.id && ' (Current)'}
                        </ProjectMeta>
                      </>
                    )}
                  </ProjectInfo>

                  {editingProject !== project.id && (
                    <ProjectActions>
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(project);
                        }}
                        title="Rename project"
                      >
                        <Edit2 size={14} />
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </ActionButton>
                    </ProjectActions>
                  )}
                </ProjectItem>
              ))
            )}
          </ProjectsList>
        </PanelContent>
      </Panel>
    </PanelOverlay>
  );
}