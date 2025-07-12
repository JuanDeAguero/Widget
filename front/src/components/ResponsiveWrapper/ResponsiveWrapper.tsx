import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Monitor, AlertTriangle } from 'lucide-react';

const MIN_WIDTH = 1100;

const NarrowScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
`;

const MessageCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 40px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.5s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px auto;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
`;

const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 24px 0;
`;

const RequirementText = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 16px;
  color: #fca5a5;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrentResolution = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-family: monospace;
`;

interface ResponsiveWrapperProps {
  children: React.ReactNode;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth < MIN_WIDTH) {
    return (
      <NarrowScreenContainer>
        <MessageCard>
          <IconWrapper>
            <Monitor size={40} />
          </IconWrapper>
          <Title>Desktop Resolution Required</Title>
          <Description>
            This application is designed for wide desktop screens and requires a minimum width of {MIN_WIDTH} pixels to function properly.
          </Description>
          <RequirementText>
            <AlertTriangle size={24} />
            Please use a desktop computer or expand your browser window to continue.
          </RequirementText>
          <CurrentResolution>
            Current resolution: {windowWidth} × {window.innerHeight} px
          </CurrentResolution>
        </MessageCard>
      </NarrowScreenContainer>
    );
  }

  return <>{children}</>;
};