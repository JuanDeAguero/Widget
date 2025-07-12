import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { WidgetProject, EditorMode, UIElement, BlueprintNode, BlueprintEdge, Asset, WidgetBlueprint } from '../types';

interface AppState {
  project: WidgetProject;
  selectedElement: UIElement | null;
  selectedNode: BlueprintNode | null;
  editorMode: EditorMode;
  isContentBrowserOpen: boolean;
}

type AppAction =
  | { type: 'SET_EDITOR_MODE'; payload: EditorMode }
  | { type: 'SELECT_ELEMENT'; payload: UIElement | null }
  | { type: 'SELECT_NODE'; payload: BlueprintNode | null }
  | { type: 'TOGGLE_CONTENT_BROWSER' }
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'ADD_BLUEPRINT'; payload: WidgetBlueprint }
  | { type: 'UPDATE_UI_ELEMENT'; payload: UIElement }
  | { type: 'ADD_UI_ELEMENT'; payload: UIElement }
  | { type: 'REMOVE_UI_ELEMENT'; payload: string }
  | { type: 'ADD_NODE'; payload: BlueprintNode }
  | { type: 'UPDATE_NODE'; payload: BlueprintNode }
  | { type: 'REMOVE_NODE'; payload: string }
  | { type: 'ADD_EDGE'; payload: BlueprintEdge }
  | { type: 'REMOVE_EDGE'; payload: string };

const initialState: AppState = {
  project: {
    id: 'default-project',
    name: 'My Widget Project',
    assets: [
      {
        id: '1',
        name: 'sample-image.png',
        type: 'image',
        path: '/assets/sample-image.png',
        created: new Date(),
      },
      {
        id: '2',
        name: 'icon-set.svg',
        type: 'icon',
        path: '/assets/icon-set.svg',
        created: new Date(),
      },
    ],
    blueprints: [
      {
        id: '1',
        name: 'MainWidget',
        type: 'widget',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '2',
        name: 'ButtonComponent',
        type: 'component',
        created: new Date(),
        modified: new Date(),
      },
    ],
    uiElements: [],
    nodes: [],
    edges: [],
  },
  selectedElement: null,
  selectedNode: null,
  editorMode: 'ui',
  isContentBrowserOpen: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_EDITOR_MODE':
      return { ...state, editorMode: action.payload };
    case 'SELECT_ELEMENT':
      return { ...state, selectedElement: action.payload };
    case 'SELECT_NODE':
      return { ...state, selectedNode: action.payload };
    case 'TOGGLE_CONTENT_BROWSER':
      return { ...state, isContentBrowserOpen: !state.isContentBrowserOpen };
    case 'ADD_ASSET':
      return {
        ...state,
        project: {
          ...state.project,
          assets: [...state.project.assets, action.payload],
        },
      };
    case 'ADD_BLUEPRINT':
      return {
        ...state,
        project: {
          ...state.project,
          blueprints: [...state.project.blueprints, action.payload],
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
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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