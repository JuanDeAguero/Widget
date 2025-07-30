import styled from 'styled-components';

export const UIEditorContainer = styled.div`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  position: relative;
  overflow: hidden;
`;

export const Canvas = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.colors.secondary};
  background-image: 
    linear-gradient(${props => props.theme.colors.border} 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.theme.colors.border} 1px, transparent 1px);
  background-size: 20px 20px;
  position: relative;
  overflow: auto;
`;

export const Viewport = styled.div`
  width: 1200px;
  height: 800px;
  background-color: white;
  margin: 50px auto;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

export const UIElement = styled.div<{ 
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  selected?: boolean;
}>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border: 2px solid ${props => props.selected ? props.theme.colors.accent : 'transparent'};
  cursor: pointer;
  user-select: none;

  &:hover {
    border-color: ${props => props.theme.colors.accentOrange};
  }
`;

export const Button = styled.div`
  width: 100%;
  height: 100%;
  background-color: #007acc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
`;

export const Text = styled.div`
  width: 100%;
  height: 100%;
  color: #333;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed #ccc;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
`;

export const Image = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
`;

export const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  z-index: 10;
`;