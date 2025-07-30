import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const LoadingRectangle = styled.div`
  width: 60px;
  height: 12px;
  border-radius: 2px;
  background-color: #666;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const TabBarContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.header};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  height: 32px;
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    height: 2px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const ProjectName = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.header};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const Tab = styled.div<{ isActive: boolean; isModified: boolean; isDragging?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 12px;
  min-width: 120px;
  max-width: 200px;
  height: 100%;
  background-color: ${props => props.isActive ? props.theme.colors.background : props.theme.colors.header};
  color: ${props => props.isActive ? props.theme.colors.text : props.theme.colors.textSecondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  cursor: ${props => props.isDragging ? 'grabbing' : 'pointer'};
  user-select: none;
  position: relative;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  
  &:hover {
    background-color: ${props => props.isActive ? props.theme.colors.background : props.theme.colors.hover};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.isActive ? props.theme.colors.accent : 'transparent'};
  }
`;

export const TabIcon = styled.div<{ fileType: string }>`
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  
  ${props => {
    switch (props.fileType) {
      case 'widget':
        return `background-color: ${props.theme.colors.accent};`;
      case 'component':
        return `background-color: ${props.theme.colors.accentOrange};`;
      case 'image':
        return `background-color: ${props.theme.colors.success};`;
      case 'icon':
        return `background-color: ${props.theme.colors.warning};`;
      case 'database':
        return `background-color: #9333ea;`;
      case 'endpoint':
        return `background-color: #f59e0b;`;
      case 'queue':
        return `background-color: #8b5cf6;`;
      case 'job':
        return `background-color: #10b981;`;
      case 'blueprint':
        return `background-color: #3b82f6;`;
      default:
        return `background-color: ${props.theme.colors.textSecondary};`;
    }
  }}
`;

export const TabName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
`;

export const ModifiedIndicator = styled.span`
  margin-left: 4px;
  color: #ef4444;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 2px;
  margin-left: 4px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  transform: translateY(1px);
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;