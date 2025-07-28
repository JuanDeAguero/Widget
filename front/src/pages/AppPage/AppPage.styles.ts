import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const EditorArea = styled.div`
  display: flex;
  flex: 1;
`;