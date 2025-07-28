import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Mouse, 
  Hand, 
  Square, 
  Type, 
  Image, 
  Layers,
  Play,
  Pause,
  Save,
  Folder,
  FolderOpen,
  Settings,
  ZoomIn,
  ZoomOut,
  Plus,
  Table,
  Rocket,
  Loader2
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { IconButton } from '../../styles/GlobalStyles';
import { UserMenu } from '../Auth/UserMenu';
import { ProjectsPanel } from '../ProjectsPanel/ProjectsPanel';

const ToolbarContainer = styled.div`
  height: ${props => props.theme.sizes.toolbarHeight};
  background-color: ${props => props.theme.colors.header};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.spacing.md};
  gap: ${props => props.theme.spacing.lg};
  z-index: ${props => props.theme.zIndexes.toolbar};
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const ToolbarButton = styled.button<{ variant?: 'primary' | 'secondary' | 'deploy' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.accent;
      case 'deploy': return '#28a745';
      default: return props.theme.colors.tertiary;
    }
  }};
  color: ${props => (props.variant === 'primary' || props.variant === 'deploy') ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return '#0080d4';
        case 'deploy': return '#218838';
        default: return props.theme.colors.hover;
      }
    }};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ModeToggle = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 4px;
  overflow: hidden;
`;

const ModeButton = styled.button<{ active: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.active ? props.theme.colors.accent : 'transparent'};
  color: ${props => props.theme.colors.text};
  border: none;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.hover};
  }
`;

const SpinningLoader = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export function Toolbar() {
  const { state, dispatch, getFileEditorMode, setFileEditorMode } = useApp();
  const [isProjectsPanelOpen, setIsProjectsPanelOpen] = useState(false);
  const [isQueueRunning, setIsQueueRunning] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const activeFile = state.openFiles.find(file => file.id === state.activeFileId);
  const fileEditorMode = state.activeFileId ? getFileEditorMode(state.activeFileId) : 'ui';
  
  const showModeToggle = activeFile && (activeFile.type === 'widget' || activeFile.type === 'component');
  const showImageControls = activeFile && activeFile.type === 'image';
  const showDatabaseControls = activeFile && activeFile.type === 'database';
  const showQueueControls = activeFile && activeFile.type === 'queue';
  const showJobControls = activeFile && activeFile.type === 'job';
  const showBlueprintControls = activeFile && (
    (activeFile.type === 'widget' || activeFile.type === 'component') && fileEditorMode === 'blueprint'
  );
  const showEndpointControls = activeFile && activeFile.type === 'endpoint';

  const toggleQueue = () => {
    setIsQueueRunning(!isQueueRunning);
  };

  const addJob = () => {
    window.dispatchEvent(new CustomEvent('queue-add-job'));
  };

  const addJobNode = (nodeType: string) => {
    window.dispatchEvent(new CustomEvent('job-add-node', { detail: { nodeType } }));
  };

  const addBlueprintNode = (nodeType: string) => {
    window.dispatchEvent(new CustomEvent('blueprint-add-node', { detail: { nodeType } }));
  };
  
  useEffect(() => {
    const handleSaveStart = () => {
      setIsSaving(true);
    };

    const handleSaveEnd = () => {
      if ((window as any).currentSaveTimeout) {
        clearTimeout((window as any).currentSaveTimeout);
        (window as any).currentSaveTimeout = null;
      }
      setIsSaving(false);
    };

    window.addEventListener('save-start', handleSaveStart);
    window.addEventListener('save-end', handleSaveEnd);

    return () => {
      window.removeEventListener('save-start', handleSaveStart);
      window.removeEventListener('save-end', handleSaveEnd);
    };
  }, []);

  const handleSave = () => {
    if (!activeFile) return;
    
    setIsSaving(true);
    
    const saveTimeout = setTimeout(() => {
      setIsSaving(false);
    }, 10000);
    
    (window as any).currentSaveTimeout = saveTimeout;
    
    switch (activeFile.type) {
      case 'widget':
      case 'component':
        if (fileEditorMode === 'blueprint') {
          window.dispatchEvent(new CustomEvent('blueprint-save'));
        } else {
          window.dispatchEvent(new CustomEvent('ui-save'));
        }
        break;

      case 'job':
        window.dispatchEvent(new CustomEvent('job-save'));
        break;

      case 'database':
        window.dispatchEvent(new CustomEvent('database-save'));
        break;

      case 'endpoint':
        window.dispatchEvent(new CustomEvent('endpoint-save'));
        break;

      case 'queue':
        window.dispatchEvent(new CustomEvent('queue-save'));
        break;

      default:
        clearTimeout(saveTimeout);
        setIsSaving(false);
    }
  };

  return (
    <ToolbarContainer>
      {showImageControls && (
        <ToolbarSection>
          <IconButton title="Zoom In">
            <ZoomIn size={16} />
          </IconButton>
          <IconButton title="Zoom Out">
            <ZoomOut size={16} />
          </IconButton>
        </ToolbarSection>
      )}

      {showDatabaseControls && (
        <ToolbarSection>
          <IconButton 
            title="Add Column"
            onClick={() => dispatch({ type: 'ADD_DATABASE_COLUMN' })}
          >
            <Plus size={16} />
          </IconButton>
          <IconButton 
            title="Add Row"
            onClick={() => dispatch({ type: 'ADD_DATABASE_ROW' })}
          >
            <Table size={16} />
          </IconButton>
        </ToolbarSection>
      )}

      {showQueueControls && (
        <ToolbarSection>
          <ToolbarButton onClick={addJob}>
            <Plus size={16} style={{ transform: 'translateY(0px)' }} />
            <span style={{ transform: 'translateY(0px)', display: 'inline-block' }}>Add Job</span>
          </ToolbarButton>
          <IconButton 
            onClick={toggleQueue}
            title={isQueueRunning ? 'Pause Queue' : 'Start Queue'}
          >
            {isQueueRunning ? <Pause size={16} /> : <Play size={16} />}
          </IconButton>
        </ToolbarSection>
      )}

      {showJobControls && (
        <ToolbarSection>
          <ToolbarButton onClick={() => addJobNode('email')}>
            <Plus size={16} style={{ transform: 'translateY(0px)' }} />
            <span style={{ transform: 'translateY(0px)', display: 'inline-block' }}>Add Node</span>
          </ToolbarButton>
        </ToolbarSection>
      )}

      {showEndpointControls && (
        <ToolbarSection>
          <ToolbarButton onClick={() => addBlueprintNode('endpoint')}>
            <Plus size={16} style={{ transform: 'translateY(0px)' }} />
            <span style={{ transform: 'translateY(0px)', display: 'inline-block' }}>Add Node</span>
          </ToolbarButton>
        </ToolbarSection>
      )}

      {showModeToggle && (
        <ToolbarSection>
          <ModeToggle>
            <ModeButton 
              active={fileEditorMode === 'ui'}
              onClick={() => state.activeFileId && setFileEditorMode(state.activeFileId, 'ui')}
            >
              UI Editor
            </ModeButton>
            <ModeButton 
              active={fileEditorMode === 'blueprint'}
              onClick={() => state.activeFileId && setFileEditorMode(state.activeFileId, 'blueprint')}
            >
              Blueprint
            </ModeButton>
          </ModeToggle>
        </ToolbarSection>
      )}

      {showBlueprintControls && (
        <ToolbarSection>
          <ToolbarButton onClick={() => addBlueprintNode('function')}>
            <Plus size={16} style={{ transform: 'translateY(0px)' }} />
            <span style={{ transform: 'translateY(0px)', display: 'inline-block' }}>Add Node</span>
          </ToolbarButton>
        </ToolbarSection>
      )}

      {showModeToggle && fileEditorMode === 'ui' && (
        <ToolbarSection>
          <IconButton title="Select Tool">
            <Mouse size={16} />
          </IconButton>
          <IconButton title="Pan Tool">
            <Hand size={16} />
          </IconButton>
          <div style={{ width: '16px' }} />
          <IconButton title="Add Button">
            <Square size={16} />
          </IconButton>
          <IconButton title="Add Text">
            <Type size={16} />
          </IconButton>
          <IconButton title="Add Image">
            <Image size={16} />
          </IconButton>
          <IconButton title="Add Container">
            <Layers size={16} />
          </IconButton>
        </ToolbarSection>
      )}

      <div style={{ marginLeft: 'auto' }} />

      <ToolbarSection>
        <ToolbarButton variant="primary">
          <Play size={14} style={{ transform: 'translateY(1px)' }} />
          <span style={{ transform: 'translateY(0px)', display: 'inline-block' }}>Preview</span>
        </ToolbarButton>
        <ToolbarButton 
          variant="deploy"
          style={{ marginLeft: '8px' }}
          onClick={() => {}}
        >
          <Rocket size={14} style={{ transform: 'translateY(1px)' }} />
          <span style={{ transform: 'translateY(0px)', display: 'inline-block' }}>Deploy</span>
        </ToolbarButton>
        <div style={{ width: '16px' }} />
        <IconButton 
          title="Projects"
          onClick={() => setIsProjectsPanelOpen(true)}
        >
          <FolderOpen size={16} />
        </IconButton>
        <IconButton 
          title={isSaving ? "Saving..." : "Save"}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <SpinningLoader size={16} /> : <Save size={16} />}
        </IconButton>
        <IconButton title="Settings">
          <Settings size={16} />
        </IconButton>
        <IconButton 
          title="Toggle Content Browser"
          onClick={() => dispatch({ type: 'TOGGLE_CONTENT_BROWSER' })}
        >
          <Folder size={16} />
        </IconButton>
        <div style={{ width: '16px' }} />
        <UserMenu />
      </ToolbarSection>
      
      <ProjectsPanel 
        isOpen={isProjectsPanelOpen}
        onClose={() => setIsProjectsPanelOpen(false)}
      />
    </ToolbarContainer>
  );
}