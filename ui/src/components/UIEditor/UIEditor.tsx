import { useApp } from '../../contexts/AppContext';
import {
  UIEditorContainer,
  Canvas,
  Viewport,
  UIElement,
  Button,
  Text,
  Input,
  Container,
  Image,
  EmptyState
} from './UIEditor.styles.ts';

export function UIEditor() {
  const { state, dispatch } = useApp();

  const handleElementClick = (element: any) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: element });
  };

  const renderElement = (element: any) => {
    const isSelected = state.selectedElement?.id === element.id;

    let content;
    switch (element.type) {
      case 'button':
        content = <Button>{element.properties?.label || 'Button'}</Button>;
        break;
      case 'text':
        content = <Text>{element.properties?.text || 'Text'}</Text>;
        break;
      case 'input':
        content = <Input placeholder={element.properties?.placeholder || ''} />;
        break;
      case 'container':
        content = <Container />;
        break;
      case 'image':
        content = <Image>Image</Image>;
        break;
      default:
        content = <div>Unknown Element</div>;
    }

    return (
      <UIElement
        key={element.id}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        selected={isSelected}
        onClick={() => handleElementClick(element)}
      >
        {content}
      </UIElement>
    );
  };

  return (
    <UIEditorContainer>
      <Canvas>
        <Viewport>
          {state.project.uiElements.length === 0 && (
            <EmptyState>
              <div>Drag elements from the toolbar to start building your UI</div>
            </EmptyState>
          )}
          {state.project.uiElements.map(renderElement)}
        </Viewport>
      </Canvas>
    </UIEditorContainer>
  );
}