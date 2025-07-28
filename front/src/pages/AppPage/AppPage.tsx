import React from 'react';
import { ThemeProvider } from 'styled-components';
import { AppProvider } from '../../contexts/AppContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { ResponsiveWrapper } from '../../components/ResponsiveWrapper/ResponsiveWrapper';
import { theme } from '../../styles/theme';
import { Toolbar } from '../../components/Toolbar/Toolbar';
import { TabBar } from '../../components/TabBar/TabBar';
import { ContentBrowser } from '../../components/ContentBrowser/ContentBrowser';
import { PropertyPanel } from '../../components/PropertyPanel/PropertyPanel';
import { UIEditor } from '../../components/UIEditor/UIEditor';
import { BlueprintEditor } from '../../components/BlueprintEditor/BlueprintEditor';
import { DatabaseEditor } from '../../components/DatabaseEditor/DatabaseEditor';
import { JobQueueEditor } from '../../components/JobQueueEditor/JobQueueEditor';
import { JobEditor } from '../../components/JobEditor/JobEditor';
import { useApp } from '../../contexts/AppContext';
import { SEO } from '../../components/SEO/SEO';
import {
  AppContainer,
  MainContent,
  EditorContainer,
  EditorArea
} from './AppPage.styles.ts';

function AppContent() {
  const { state, getFileEditorMode } = useApp();

  const renderEditor = () => {
    if (!state.activeFileId) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          width: '100%',
          color: '#8d8d8d',
          fontSize: '14px'
        }}>
          No file selected
        </div>
      );
    }

    const activeFile = state.openFiles.find(file => file.id === state.activeFileId);
    if (!activeFile) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          width: '100%',
          color: '#8d8d8d',
          fontSize: '14px'
        }}>
          File not found
        </div>
      );
    }

    const fileEditorMode = getFileEditorMode(state.activeFileId);

    if (activeFile.type === 'widget' || activeFile.type === 'component') {
      return (
        <>
          {fileEditorMode === 'ui' ? <UIEditor /> : <BlueprintEditor />}
          <PropertyPanel />
        </>
      );
    } else if (activeFile.type === 'image') {
      return (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            flex: 1,
            backgroundColor: '#1e1e1e',
            padding: '20px'
          }}>
            <img 
              src="https://picsum.photos/400/300" 
              alt={activeFile.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                border: '1px solid #3e3e42',
                borderRadius: '4px'
              }}
            />
          </div>
          <PropertyPanel />
        </>
      );
    } else if (activeFile.type === 'database') {
      return (
        <>
          <DatabaseEditor tableName={activeFile.name} />
          <PropertyPanel />
        </>
      );
    } else if (activeFile.type === 'blueprint') {
      return (
        <>
          <BlueprintEditor />
          <PropertyPanel />
        </>
      );
    } else if (activeFile.type === 'queue') {
      return (
        <>
          <JobQueueEditor />
          <PropertyPanel />
        </>
      );
    } else if (activeFile.type === 'job') {
      return (
        <>
          <JobEditor />
          <PropertyPanel />
        </>
      );
    } else if (activeFile.type === 'endpoint') {
      return (
        <>
          <div style={{ 
            display: 'flex', 
            height: '100%',
            flex: 1,
            backgroundColor: '#1e1e1e'
          }}>
            <BlueprintEditor />
          </div>
          <PropertyPanel />
        </>
      );
    } else {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          width: '100%',
          color: '#8d8d8d',
          fontSize: '14px'
        }}>
          Preview for {activeFile.name}
        </div>
      );
    }
  };

  return (
    <AppContainer>
      <TabBar />
      <Toolbar />
      <MainContent>
        <EditorContainer>
          <EditorArea>
            {renderEditor()}
          </EditorArea>
          <ContentBrowser isOpen={state.isContentBrowserOpen} />
        </EditorContainer>
      </MainContent>
    </AppContainer>
  );
}

export const AppPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Widget App - Dashboard"
        description="Widget application dashboard - Login required"
        noIndex={true}
      />
      <ThemeProvider theme={theme}>
        <ResponsiveWrapper>
          <AuthProvider>
            <ProtectedRoute>
              <AppProvider>
                <AppContent />
              </AppProvider>
            </ProtectedRoute>
          </AuthProvider>
        </ResponsiveWrapper>
      </ThemeProvider>
    </>
  );
};