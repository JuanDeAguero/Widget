import { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FileText, Image, Folder, Plus, Search, Layout, Database, Plug, ListTodo, Zap, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Panel, PanelHeader, PanelContent, IconButton } from '../../styles/GlobalStyles';
import { api } from '../../services/projectAPI';
import type { File as ProjectFile } from '../../types';

const ContentBrowserContainer = styled(Panel)`
  height: ${props => props.theme.sizes.contentBrowserHeight};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ContentHeader = styled(PanelHeader)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 2px;
  padding: ${props => props.theme.spacing.xs};
  max-width: 200px;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  flex: 1;
  margin-left: ${props => props.theme.spacing.xs};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs};
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &:active {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const ItemActions = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${ContentItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 20px;
  height: 20px;
  background-color: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &.delete:hover {
    background-color: #ff4444;
    color: white;
  }

  &.rename:hover {
    background-color: ${props => props.theme.colors.accent};
    color: white;
  }
`;

const ItemIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 4px;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ItemName = styled.div`
  font-size: 10px;
  text-align: center;
  color: ${props => props.theme.colors.text};
  word-break: break-word;
  line-height: 1.2;
  padding: 2px;
  min-height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 2px;
  box-sizing: border-box;
  margin: 0;
  position: relative;
`;

const UnsavedIndicator = styled.span`
  color: #ff4444;
  font-weight: bold;
  margin-left: 2px;
`;

const RenameInput = styled.input`
  font-size: 10px;
  text-align: center;
  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.accent};
  border-radius: 2px;
  padding: 2px;
  width: 100%;
  max-width: 70px;
  min-height: 14px;
  line-height: 1.2;
  box-sizing: border-box;
  margin: 0;
`;

const AddButtonContainer = styled.div`
  position: relative;
`;

const AddDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  z-index: 1000;
  margin-bottom: 2px;
`;

const AddDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const LoadingContentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 4px;
  position: relative;
`;

const LoadingItemIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.tertiary} 0%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.tertiary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 4px;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const LoadingItemName = styled.div`
  width: 60px;
  height: 14px;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.tertiary} 0%,
    ${props => props.theme.colors.hover} 50%,
    ${props => props.theme.colors.tertiary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 2px;
`;

interface ContentBrowserProps {
  isOpen: boolean;
}

export function ContentBrowser({ isOpen }: ContentBrowserProps) {
  const { state, dispatch, getBlueprintState } = useApp();
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.project && state.project.id && Array.isArray(state.project.files)) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
      setShowAddDropdown(false);
    }
  }, [state.project]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
    };

    if (showAddDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddDropdown]);

  const handleItemClick = (item: ProjectFile) => {
    const openFile = {
      id: item.id,
      name: item.name,
      type: item.type,
      path: item.path,
      isModified: false,
      content: item.content,
    };

    dispatch({ type: 'OPEN_FILE', payload: openFile });
  };

  const handleDeleteItem = async (e: React.MouseEvent, item: ProjectFile) => {
    e.stopPropagation();
    
    const projectId = state.project.id;
    
    await api.projects.deleteFile(projectId, item.id);
    dispatch({ type: 'DELETE_FILE', payload: item.id });
    
    dispatch({ type: 'CLOSE_FILE', payload: item.id });
  };

  const handleRenameItem = (e: React.MouseEvent, item: ProjectFile) => {
    e.stopPropagation();
    setEditingItem(item.id);
    setNewName(item.name);
  };

  const handleRenameSubmit = async (item: ProjectFile) => {
    if (newName.trim() && newName !== item.name) {
      const projectId = state.project.id;
      
      await api.projects.updateFile(projectId, item.id, { name: newName.trim() });
      dispatch({ type: 'RENAME_FILE', payload: { id: item.id, name: newName.trim() } });
    }
    setEditingItem(null);
    setNewName('');
  };

  const handleRenameCancel = () => {
    setEditingItem(null);
    setNewName('');
  };

  const isFileModified = (fileId: string) => {
    const openFile = state.openFiles.find(f => f.id === fileId);
    if (openFile) {
      return openFile.isModified;
    }
    
    const inMemoryState = getBlueprintState ? getBlueprintState(fileId) : null;
    const projectFile = state.project.files.find(f => f.id === fileId);
    
    if (inMemoryState && projectFile) {
      const savedContent = projectFile.content;
      const inMemoryNodes = inMemoryState.nodes;
      const inMemoryEdges = inMemoryState.edges;
      
      if (!savedContent && (inMemoryNodes.length > 0 || inMemoryEdges.length > 0)) {
        return true;
      }
      
      if (savedContent) {
        const savedNodes = savedContent.nodes || [];
        const savedEdges = savedContent.edges || [];
        
        const nodesChanged = JSON.stringify(savedNodes) !== JSON.stringify(inMemoryNodes);
        const edgesChanged = JSON.stringify(savedEdges) !== JSON.stringify(inMemoryEdges);
        
        if (nodesChanged || edgesChanged) {
          return true;
        }
      }
    }
    
    return false;
  };

  const handleAddAsset = async (assetType: string) => {
    const projectId = state.project.id;
    
    const typeMap: Record<string, string> = {
      'Widget': 'widget',
      'Table': 'database',
      'Endpoint': 'endpoint',
      'Queue': 'queue',
      'Job': 'job',
      'Blueprint': 'blueprint'
    };
    
    const actualType = typeMap[assetType] || assetType.toLowerCase();
    
    const newFile = {
      id: `${actualType}-${Date.now()}`,
      name: `New ${assetType}`,
      type: actualType as 'widget' | 'component' | 'image' | 'icon' | 'blueprint' | 'database' | 'endpoint' | 'queue' | 'job',
      path: `/files/${actualType}s/new-${actualType}`,
      project_id: projectId,
      content: actualType === 'blueprint' ? {
        nodes: [],
        edges: [],
        version: '1.0.0',
        createdAt: new Date().toISOString()
      } : null,
      thumbnail: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await api.projects.createFile(projectId, newFile);
    
    dispatch({ type: 'ADD_FILE', payload: newFile });
    
    setShowAddDropdown(false);
    
    const openFile = {
      id: newFile.id,
      name: newFile.name,
      type: newFile.type,
      path: newFile.path,
      isModified: false,
      content: newFile.content,
    };

    dispatch({ type: 'OPEN_FILE', payload: openFile });
  };

  if (!isOpen) return null;

  const renderLoadingSkeleton = () => {
    const delays = ['0s', '0.2s', '0.4s', '0.1s'];
    
    return Array.from({ length: 4 }, (_, index) => (
      <LoadingContentItem key={`loading-${index}`}>
        <LoadingItemIcon style={{ animationDelay: delays[index] }} />
        <LoadingItemName style={{ animationDelay: delays[index] }} />
      </LoadingContentItem>
    ));
  };

  const getIcon = (item: ProjectFile) => {
    switch (item.type) {
      case 'widget':
        return <Layout size={20} />;
      case 'component':
        return <FileText size={20} />;
      case 'image':
        return <Image size={20} />;
      case 'icon':
        return <Image size={20} />;
      case 'blueprint':
        return <FileText size={20} />;
      case 'database':
        return <Database size={20} />;
      case 'endpoint':
        return <Plug size={20} />;
      case 'queue':
        return <ListTodo size={20} />;
      case 'job':
        return <Zap size={20} />;
      default:
        return <Folder size={20} />;
    }
  };

  return (
    <ContentBrowserContainer>
      <ContentHeader>
        Content Browser
        <div style={{ width: '24px' }} />
        <SearchContainer>
          <Search size={14} color="#8d8d8d" />
          <SearchInput placeholder="Search assets..." />
        </SearchContainer>
        <AddButtonContainer ref={dropdownRef}>
          <IconButton 
            title="Add Asset"
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            disabled={isLoading}
          >
            <Plus size={14} />
          </IconButton>
          {showAddDropdown && !isLoading && (
            <AddDropdown>
              <AddDropdownItem onClick={() => handleAddAsset('Widget')}>
                <Layout size={16} />
                Widget
              </AddDropdownItem>
              <AddDropdownItem onClick={() => handleAddAsset('Blueprint')}>
                <FileText size={16} />
                Blueprint
              </AddDropdownItem>
              <AddDropdownItem onClick={() => handleAddAsset('Table')}>
                <Database size={16} />
                Table
              </AddDropdownItem>
              <AddDropdownItem onClick={() => handleAddAsset('Endpoint')}>
                <Plug size={16} />
                Endpoint
              </AddDropdownItem>
              <AddDropdownItem onClick={() => handleAddAsset('Queue')}>
                <ListTodo size={16} />
                Queue
              </AddDropdownItem>
              <AddDropdownItem onClick={() => handleAddAsset('Job')}>
                <Zap size={16} />
                Job
              </AddDropdownItem>
            </AddDropdown>
          )}
        </AddButtonContainer>
      </ContentHeader>

      <PanelContent>
        <ContentGrid>
          {isLoading ? (
            renderLoadingSkeleton()
          ) : (
            state.project.files
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => (
                <ContentItem key={item.id} onClick={() => handleItemClick(item)}>
                  <ItemActions>
                    <ActionButton 
                      className="rename"
                      onClick={(e) => handleRenameItem(e, item)}
                      title="Rename"
                    >
                      <Edit2 size={12} />
                    </ActionButton>
                    <ActionButton 
                      className="delete"
                      onClick={(e) => handleDeleteItem(e, item)}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </ActionButton>
                  </ItemActions>
                  <ItemIcon>
                    {getIcon(item)}
                  </ItemIcon>
                  {editingItem === item.id ? (
                    <RenameInput
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => handleRenameSubmit(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameSubmit(item);
                        } else if (e.key === 'Escape') {
                          handleRenameCancel();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <ItemName>
                      {item.name}
                      {isFileModified(item.id) && <UnsavedIndicator>*</UnsavedIndicator>}
                    </ItemName>
                  )}
                </ContentItem>
              ))
          )}
        </ContentGrid>
      </PanelContent>
    </ContentBrowserContainer>
  );
}