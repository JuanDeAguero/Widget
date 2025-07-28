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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LoadingRectangle = styled.div`
  width: 60px;
  height: 12px;
  border-radius: 2px;
  background-color: #666;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingText = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  margin-left: 4px;
`;

interface LoadingAnimationProps {
  text?: string;
}

export function LoadingAnimation({ text = '' }: LoadingAnimationProps) {
  return (
    <LoadingContainer>
      <LoadingRectangle />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
}

export function ProjectNameLoader() {
  return (
    <LoadingContainer>
      <LoadingRectangle />
    </LoadingContainer>
  );
}