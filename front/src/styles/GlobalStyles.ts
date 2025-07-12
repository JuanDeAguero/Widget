import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    overflow: hidden;
    user-select: none;
  }

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea {
    background-color: ${props => props.theme.colors.tertiary};
    border: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
    font-family: inherit;
    border-radius: 2px;
    padding: ${props => props.theme.spacing.xs};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accent};
    }
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.tertiary};
    border-radius: 5px;

    &:hover {
      background: ${props => props.theme.colors.hover};
    }
  }
`;

export const Panel = styled.div`
  background-color: ${props => props.theme.colors.panel};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
`;

export const PanelHeader = styled.div`
  background-color: ${props => props.theme.colors.header};
  padding: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PanelContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: ${props => props.theme.spacing.sm};
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'accent' }>`
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.accent;
      case 'accent': return props.theme.colors.accentOrange;
      default: return props.theme.colors.tertiary;
    }
  }};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: 2px;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return '#0080d4';
        case 'accent': return '#ff7700';
        default: return props.theme.colors.hover;
      }
    }};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const IconButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.hover};
    border-color: ${props => props.theme.colors.border};
  }
`;

export const Separator = styled.div`
  width: 1px;
  height: 20px;
  background-color: ${props => props.theme.colors.border};
  margin: 0 ${props => props.theme.spacing.xs};
`;

export const VerticalSeparator = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin: ${props => props.theme.spacing.xs} 0;
`;