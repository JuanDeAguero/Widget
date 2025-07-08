import styled from 'styled-components';
import { useApp } from '../../contexts/AppContext';
import { Panel, PanelHeader, PanelContent, VerticalSeparator } from '../../styles/GlobalStyles';

const PropertyContainer = styled(Panel)`
  width: ${props => props.theme.sizes.panelWidth};
  border-left: 1px solid ${props => props.theme.colors.border};
`;

const PropertyGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
`;

const PropertyInput = styled.input`
  width: 100%;
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs};
  font-size: 12px;
  border-radius: 2px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs};
  font-size: 12px;
  border-radius: 2px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const PropertyRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  margin-top: ${props => props.theme.spacing.xl};
`;

export function PropertyPanel() {
  const { state } = useApp();

  const renderUIElementProperties = () => {
    if (!state.selectedElement) {
      return <EmptyState>Select an element to view properties</EmptyState>;
    }

    const element = state.selectedElement;

    return (
      <>
        <PropertyGroup>
          <PropertyLabel>Name</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={element.name} 
            onChange={() => {}} 
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Type</PropertyLabel>
          <PropertySelect value={element.type}>
            <option value="button">Button</option>
            <option value="text">Text</option>
            <option value="input">Input</option>
            <option value="container">Container</option>
            <option value="image">Image</option>
          </PropertySelect>
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Transform</PropertyLabel>
          <PropertyRow>
            <div style={{ flex: 1 }}>
              <PropertyLabel>X</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.x} 
                onChange={() => {}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Y</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.y} 
                onChange={() => {}}
              />
            </div>
          </PropertyRow>
          <PropertyRow>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Width</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.width} 
                onChange={() => {}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Height</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.height} 
                onChange={() => {}}
              />
            </div>
          </PropertyRow>
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Appearance</PropertyLabel>
          {element.type === 'text' && (
            <>
              <PropertyLabel>Text</PropertyLabel>
              <PropertyInput 
                type="text" 
                value={element.properties?.text || ''} 
                onChange={() => {}}
              />
              <PropertyLabel>Font Size</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.properties?.fontSize || 14} 
                onChange={() => {}}
              />
            </>
          )}
          {element.type === 'button' && (
            <>
              <PropertyLabel>Label</PropertyLabel>
              <PropertyInput 
                type="text" 
                value={element.properties?.label || ''} 
                onChange={() => {}}
              />
            </>
          )}
        </PropertyGroup>
      </>
    );
  };

  const renderNodeProperties = () => {
    if (!state.selectedNode) {
      return <EmptyState>Select a node to view properties</EmptyState>;
    }

    const node = state.selectedNode;

    return (
      <>
        <PropertyGroup>
          <PropertyLabel>Node Type</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={node.type} 
            readOnly 
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Label</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={node.data.label} 
            onChange={() => {}}
          />
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Position</PropertyLabel>
          <PropertyRow>
            <div style={{ flex: 1 }}>
              <PropertyLabel>X</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={node.position.x} 
                onChange={() => {}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Y</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={node.position.y} 
                onChange={() => {}}
              />
            </div>
          </PropertyRow>
        </PropertyGroup>
      </>
    );
  };

  return (
    <PropertyContainer>
      <PanelHeader>Properties</PanelHeader>
      <PanelContent>
        {state.editorMode === 'ui' ? renderUIElementProperties() : renderNodeProperties()}
      </PanelContent>
    </PropertyContainer>
  );
}
