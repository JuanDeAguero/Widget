import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { WidgetProject, EditorMode, UIElement, BlueprintNode, BlueprintEdge, File, OpenFile } from '../types';
import { api } from '../services/projectAPI';
import { authAPI } from '../services/authAPI';

interface AppState {
  project: WidgetProject;
  selectedElement: UIElement | null;
  selectedNode: BlueprintNode | null;
  selectedQueueJob: any | null;
  editorMode: EditorMode;
  fileEditorModes: Record<string, EditorMode>;
  isContentBrowserOpen: boolean;
  openFiles: OpenFile[];
  activeFileId: string | null;
  isProjectLoading: boolean;
  blueprintViewports: Record<string, { x: number; y: number; zoom: number }>;
  blueprintStates: Record<string, { nodes: any[]; edges: any[] }>;
  blueprintSelections: Record<string, { selectedNodes: string[]; selectedEdges: string[] }>;
}

type AppAction =
  | { type: 'SET_PROJECT_LOADING'; payload: boolean }
  | { type: 'SET_EDITOR_MODE'; payload: EditorMode }
  | { type: 'SET_FILE_EDITOR_MODE'; payload: { fileId: string; mode: EditorMode } }
  | { type: 'SELECT_ELEMENT'; payload: UIElement | null }
  | { type: 'SELECT_NODE'; payload: BlueprintNode | null }
  | { type: 'SELECT_QUEUE_JOB'; payload: any | null }
  | { type: 'TOGGLE_CONTENT_BROWSER' }
  | { type: 'LOAD_PROJECT'; payload: WidgetProject }
  | { type: 'ADD_FILE'; payload: File }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'RENAME_FILE'; payload: { id: string; name: string } }
  | { type: 'UPDATE_UI_ELEMENT'; payload: UIElement }
  | { type: 'ADD_UI_ELEMENT'; payload: UIElement }
  | { type: 'REMOVE_UI_ELEMENT'; payload: string }
  | { type: 'ADD_NODE'; payload: BlueprintNode }
  | { type: 'UPDATE_NODE'; payload: BlueprintNode }
  | { type: 'REMOVE_NODE'; payload: string }
  | { type: 'ADD_EDGE'; payload: BlueprintEdge }
  | { type: 'REMOVE_EDGE'; payload: string }
  | { type: 'OPEN_FILE'; payload: OpenFile }
  | { type: 'CLOSE_FILE'; payload: string }
  | { type: 'SET_ACTIVE_FILE'; payload: string | null }
  | { type: 'UPDATE_FILE_MODIFIED'; payload: { id: string; isModified: boolean } }
  | { type: 'UPDATE_PROJECT_FILE'; payload: { id: string; content: any } }
  | { type: 'SET_BLUEPRINT_VIEWPORT'; payload: { fileId: string; viewport: { x: number; y: number; zoom: number } } }
  | { type: 'SET_BLUEPRINT_STATE'; payload: { fileId: string; nodes: any[]; edges: any[] } }
  | { type: 'SET_BLUEPRINT_SELECTION'; payload: { fileId: string; selectedNodes: string[]; selectedEdges: string[] } }
  | { type: 'REORDER_TABS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'ADD_DATABASE_COLUMN' }
  | { type: 'ADD_DATABASE_ROW' };

const initialState: AppState = {
  project: {
    id: '',
    name: '',
    files: [],
    uiElements: [],
    nodes: [],
    edges: [],
  },
  selectedElement: null,
  selectedNode: null,
  selectedQueueJob: null,
  editorMode: 'ui',
  fileEditorModes: {},
  isContentBrowserOpen: true,
  openFiles: [],
  activeFileId: 'blueprint-1',
  isProjectLoading: true,
  blueprintViewports: {},
  blueprintStates: {},
  blueprintSelections: {},
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROJECT_LOADING':
      return { ...state, isProjectLoading: action.payload };

    case 'SET_EDITOR_MODE':
      return { ...state, editorMode: action.payload };

    case 'SET_FILE_EDITOR_MODE':
      return { 
        ...state, 
        fileEditorModes: {
          ...state.fileEditorModes,
          [action.payload.fileId]: action.payload.mode
        }
      };

    case 'SELECT_ELEMENT':
      return { ...state, selectedElement: action.payload };

    case 'SELECT_NODE':
      return { ...state, selectedNode: action.payload };

    case 'SELECT_QUEUE_JOB':
      return { ...state, selectedQueueJob: action.payload };

    case 'TOGGLE_CONTENT_BROWSER':
      return { ...state, isContentBrowserOpen: !state.isContentBrowserOpen };

    case 'LOAD_PROJECT':
      return {
        ...state,
        project: {
          ...state.project,
          id: action.payload.id,
          name: action.payload.name,
          files: action.payload.files,
        },
        isProjectLoading: false,
      };

    case 'ADD_FILE':
      return {
        ...state,
        project: {
          ...state.project,
          files: [...state.project.files, action.payload],
        },
      };

    case 'DELETE_FILE':
      return {
        ...state,
        project: {
          ...state.project,
          files: state.project.files.filter(file => file.id !== action.payload),
        },
      };

    case 'RENAME_FILE':
      return {
        ...state,
        project: {
          ...state.project,
          files: state.project.files.map(file => 
            file.id === action.payload.id 
              ? { ...file, name: action.payload.name }
              : file
          ),
        },
      };

    case 'ADD_UI_ELEMENT':
      return {
        ...state,
        project: {
          ...state.project,
          uiElements: [...state.project.uiElements, action.payload],
        },
      };

    case 'UPDATE_UI_ELEMENT':
      return {
        ...state,
        project: {
          ...state.project,
          uiElements: state.project.uiElements.map(el =>
            el.id === action.payload.id ? action.payload : el
          ),
        },
      };

    case 'REMOVE_UI_ELEMENT':
      return {
        ...state,
        project: {
          ...state.project,
          uiElements: state.project.uiElements.filter(el => el.id !== action.payload),
        },
      };

    case 'ADD_NODE':
      return {
        ...state,
        project: {
          ...state.project,
          nodes: [...state.project.nodes, action.payload],
        },
      };

    case 'UPDATE_NODE':
      return {
        ...state,
        project: {
          ...state.project,
          nodes: state.project.nodes.map(node =>
            node.id === action.payload.id ? action.payload : node
          ),
        },
      };

    case 'REMOVE_NODE':
      return {
        ...state,
        project: {
          ...state.project,
          nodes: state.project.nodes.filter(node => node.id !== action.payload),
        },
      };

    case 'ADD_EDGE':
      return {
        ...state,
        project: {
          ...state.project,
          edges: [...state.project.edges, action.payload],
        },
      };

    case 'REMOVE_EDGE':
      return {
        ...state,
        project: {
          ...state.project,
          edges: state.project.edges.filter(edge => edge.id !== action.payload),
        },
      };

    case 'OPEN_FILE':
      const existingFile = state.openFiles.find(file => file.id === action.payload.id);
      if (existingFile) {
        const updatedOpenFiles = state.openFiles.map(file =>
          file.id === action.payload.id ? { ...file, content: action.payload.content } : file
        );
        return { 
          ...state, 
          openFiles: updatedOpenFiles,
          activeFileId: action.payload.id 
        };
      }
      
      let newFileEditorModes = { ...state.fileEditorModes };
      if (!newFileEditorModes[action.payload.id]) {
        newFileEditorModes[action.payload.id] = action.payload.type === 'blueprint' ? 'blueprint' : 'ui';
      }
      
      const clearedBlueprintSelections = { ...state.blueprintSelections };
      delete clearedBlueprintSelections[action.payload.id];
      
      return {
        ...state,
        openFiles: [...state.openFiles, action.payload],
        activeFileId: action.payload.id,
        fileEditorModes: newFileEditorModes,
        blueprintSelections: clearedBlueprintSelections,
      };

    case 'CLOSE_FILE':
      const newOpenFiles = state.openFiles.filter(file => file.id !== action.payload);
      let newActiveFileId = state.activeFileId;
      
      if (state.activeFileId === action.payload) {
        const currentIndex = state.openFiles.findIndex(file => file.id === action.payload);
        if (newOpenFiles.length > 0) {
          const nextIndex = currentIndex < newOpenFiles.length ? currentIndex : currentIndex - 1;
          newActiveFileId = newOpenFiles[nextIndex]?.id || null;
        } else {
          newActiveFileId = null;
        }
      }
      
      const newBlueprintSelections = { ...state.blueprintSelections };
      delete newBlueprintSelections[action.payload];
      
      return {
        ...state,
        openFiles: newOpenFiles,
        activeFileId: newActiveFileId,
        blueprintSelections: newBlueprintSelections,
      };

    case 'SET_ACTIVE_FILE':
      return { ...state, activeFileId: action.payload };

    case 'UPDATE_FILE_MODIFIED':
      return {
        ...state,
        openFiles: state.openFiles.map(file =>
          file.id === action.payload.id
            ? { ...file, isModified: action.payload.isModified }
            : file
        ),
      };

    case 'UPDATE_PROJECT_FILE':
      return {
        ...state,
        project: {
          ...state.project,
          files: state.project.files.map(file =>
            file.id === action.payload.id
              ? { ...file, content: action.payload.content }
              : file
          ),
        },
      };

    case 'SET_BLUEPRINT_VIEWPORT':
      return {
        ...state,
        blueprintViewports: {
          ...state.blueprintViewports,
          [action.payload.fileId]: action.payload.viewport,
        },
      };

    case 'SET_BLUEPRINT_STATE':
      return {
        ...state,
        blueprintStates: {
          ...state.blueprintStates,
          [action.payload.fileId]: {
            nodes: action.payload.nodes,
            edges: action.payload.edges,
          },
        },
      };

    case 'SET_BLUEPRINT_SELECTION':
      return {
        ...state,
        blueprintSelections: {
          ...state.blueprintSelections,
          [action.payload.fileId]: {
            selectedNodes: action.payload.selectedNodes,
            selectedEdges: action.payload.selectedEdges,
          },
        },
      };

    case 'REORDER_TABS':
      const { fromIndex, toIndex } = action.payload;
      const reorderedFiles = [...state.openFiles];
      const [movedFile] = reorderedFiles.splice(fromIndex, 1);
      reorderedFiles.splice(toIndex, 0, movedFile);
      return {
        ...state,
        openFiles: reorderedFiles,
      };

    case 'ADD_DATABASE_COLUMN':
      window.dispatchEvent(new CustomEvent('database-add-column'));
      return state;

    case 'ADD_DATABASE_ROW':
      window.dispatchEvent(new CustomEvent('database-add-row'));
      return state;

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadProject: (projectId: string) => Promise<void>;
  loadDefaultProject: () => Promise<void>;
  loadLastOpenedProject: () => Promise<void>;
  setBlueprintViewport: (fileId: string, viewport: { x: number; y: number; zoom: number }) => void;
  getBlueprintViewport: (fileId: string) => { x: number; y: number; zoom: number } | null;
  setBlueprintState: (fileId: string, nodes: any[], edges: any[]) => void;
  getBlueprintState: (fileId: string) => { nodes: any[]; edges: any[] } | null;
  setBlueprintSelection: (fileId: string, selectedNodes: string[], selectedEdges: string[]) => void;
  getBlueprintSelection: (fileId: string) => { selectedNodes: string[]; selectedEdges: string[] };
  getFileEditorMode: (fileId: string) => EditorMode;
  setFileEditorMode: (fileId: string, mode: EditorMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadProject = useCallback(async (projectId: string) => {
    dispatch({ type: 'SET_PROJECT_LOADING', payload: true });
    const projectData = await api.projects.getProject(projectId);
    dispatch({ 
      type: 'LOAD_PROJECT', 
      payload: {
        id: projectData.id,
        name: projectData.name,
        files: projectData.files,
        uiElements: [],
        nodes: [],
        edges: [],
      }
    });
    
    const token = localStorage.getItem('widget_auth');
    if (token) {
      const parsed = JSON.parse(token);
      await authAPI.updateLastOpenedProject(parsed.token, projectId);
    }
  }, [dispatch]);

  const loadDefaultProject = useCallback(async () => {
    dispatch({ type: 'SET_PROJECT_LOADING', payload: true });
    const projectData = await api.projects.getDefaultProject();
    dispatch({ 
      type: 'LOAD_PROJECT', 
      payload: {
        id: projectData.id,
        name: projectData.name,
        files: projectData.files,
        uiElements: [],
        nodes: [],
        edges: [],
      }
    });
    
    const token = localStorage.getItem('widget_auth');
    if (token) {
      const parsed = JSON.parse(token);
      await authAPI.updateLastOpenedProject(parsed.token, projectData.id);
    }
  }, [dispatch]);

  const loadLastOpenedProject = useCallback(async () => {
    try {
      const token = localStorage.getItem('widget_auth');
      if (!token) return;
      
      const parsed = JSON.parse(token);
      const response = await authAPI.getLastOpenedProject(parsed.token);
      
      if (response.project_id) {
        await loadProject(response.project_id);
      } else {
        await loadDefaultProject();
      }
    } catch (error) {
      await loadDefaultProject();
    }
  }, [loadProject, loadDefaultProject]);

  useEffect(() => {
    loadLastOpenedProject();
  }, [loadLastOpenedProject]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasUnsavedOpenFiles = state.openFiles.some(file => file.isModified);
      
      const hasUnsavedBlueprintChanges = state.project.files.some(file => {
        const inMemoryState = state.blueprintStates[file.id];
        
        if (inMemoryState) {
          const savedContent = file.content;
          const inMemoryNodes = inMemoryState.nodes;
          const inMemoryEdges = inMemoryState.edges;
          
          if (!savedContent && (inMemoryNodes.length > 0 || inMemoryEdges.length > 0)) {
            return true;
          }
          
          if (savedContent) {
            const savedNodes = savedContent.nodes || [];
            const savedEdges = savedContent.edges || [];
            
            const nodesChanged = JSON.stringify(savedNodes) !== JSON.stringify(inMemoryNodes);
            const edgesChanged = JSON.stringify(savedEdges) !== JSON.stringify(inMemoryEdges);
            
            if (nodesChanged || edgesChanged) {
              return true;
            }
          }
        }
        
        return false;
      });
      
      if (hasUnsavedOpenFiles || hasUnsavedBlueprintChanges) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.openFiles, state.project.files, state.blueprintStates]);

  const setBlueprintViewport = useCallback((fileId: string, viewport: { x: number; y: number; zoom: number }) => {
    dispatch({ type: 'SET_BLUEPRINT_VIEWPORT', payload: { fileId, viewport } });
  }, [dispatch]);

  const getBlueprintViewport = useCallback((fileId: string) => {
    return state.blueprintViewports[fileId] || null;
  }, [state.blueprintViewports]);

  const setBlueprintState = useCallback((fileId: string, nodes: any[], edges: any[]) => {
    dispatch({ type: 'SET_BLUEPRINT_STATE', payload: { fileId, nodes, edges } });
  }, [dispatch]);

  const getBlueprintState = useCallback((fileId: string) => {
    return state.blueprintStates[fileId] || null;
  }, [state.blueprintStates]);

  const setBlueprintSelection = useCallback((fileId: string, selectedNodes: string[], selectedEdges: string[]) => {
    dispatch({ type: 'SET_BLUEPRINT_SELECTION', payload: { fileId, selectedNodes, selectedEdges } });
  }, [dispatch]);

  const getBlueprintSelection = useCallback((fileId: string) => {
    return state.blueprintSelections[fileId] || { selectedNodes: [], selectedEdges: [] };
  }, [state.blueprintSelections]);

  const getFileEditorMode = useCallback((fileId: string) => {
    return state.fileEditorModes[fileId] || 'ui';
  }, [state.fileEditorModes]);

  const setFileEditorMode = useCallback((fileId: string, mode: EditorMode) => {
    dispatch({ type: 'SET_FILE_EDITOR_MODE', payload: { fileId, mode } });
  }, [dispatch]);

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      loadProject,
      loadDefaultProject,
      loadLastOpenedProject,
      setBlueprintViewport,
      getBlueprintViewport,
      setBlueprintState,
      getBlueprintState,
      setBlueprintSelection,
      getBlueprintSelection,
      getFileEditorMode,
      setFileEditorMode
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}