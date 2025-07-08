import { ThemeProvider } from 'styled-components';
import { AppProvider } from './contexts/AppContext';
import { GlobalStyle } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ContentBrowser } from './components/ContentBrowser/ContentBrowser';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';
import { UIEditor } from './components/UIEditor/UIEditor';
import { BlueprintEditor } from './components/BlueprintEditor/BlueprintEditor';
import { useApp } from './contexts/AppContext';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const EditorArea = styled.div`
  display: flex;
  flex: 1;
`;

function AppContent() {
  const { state } = useApp();

  return (
    <AppContainer>
      <Toolbar />
      <MainContent>
        <EditorContainer>
          <EditorArea>
            {state.editorMode === 'ui' ? <UIEditor /> : <BlueprintEditor />}
            <PropertyPanel />
          </EditorArea>
          <ContentBrowser isOpen={state.isContentBrowserOpen} />
        </EditorContainer>
      </MainContent>
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
