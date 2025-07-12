import styled from 'styled-components';
import { 
  Mouse, 
  Hand, 
  Square, 
  Type, 
  Image, 
  Layers,
  Play,
  Save,
  Folder,
  Settings
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { IconButton, Button } from '../../styles/GlobalStyles';
import { UserMenu } from '../Auth/UserMenu';

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

const ProjectName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-right: auto;
  margin-left: ${props => props.theme.spacing.xl};
`;

export function Toolbar() {
  const { state, dispatch } = useApp();

  return (
    <ToolbarContainer>
      <ToolbarSection>
        <IconButton title="New Project">
          <Folder size={16} />
        </IconButton>
        <IconButton title="Save">
          <Save size={16} />
        </IconButton>
      </ToolbarSection>

      <ToolbarSection>
        <ModeToggle>
          <ModeButton 
            active={state.editorMode === 'ui'}
            onClick={() => dispatch({ type: 'SET_EDITOR_MODE', payload: 'ui' })}
          >
            UI Editor
          </ModeButton>
          <ModeButton 
            active={state.editorMode === 'blueprint'}
            onClick={() => dispatch({ type: 'SET_EDITOR_MODE', payload: 'blueprint' })}
          >
            Blueprint
          </ModeButton>
        </ModeToggle>
      </ToolbarSection>

      {state.editorMode === 'ui' && (
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

      <ProjectName>{state.project.name}</ProjectName>

      <ToolbarSection>
        <Button variant="primary">
          <Play size={14} style={{ marginRight: '4px' }} />
          Preview
        </Button>
        <div style={{ width: '16px' }} />
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
    </ToolbarContainer>
  );
}
