export interface File {
  id: string;
  name: string;
  type: 'widget' | 'component' | 'image' | 'icon' | 'blueprint' | 'database' | 'endpoint' | 'queue' | 'job';
  path: string;
  content?: any;
  thumbnail?: string;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface OpenFile {
  id: string;
  name: string;
  type: 'widget' | 'component' | 'image' | 'icon' | 'blueprint' | 'database' | 'endpoint' | 'queue' | 'job';
  path?: string;
  isModified?: boolean;
  content?: any;
}

export interface UIElement {
  id: string;
  type: 'button' | 'text' | 'input' | 'container' | 'image';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
  children?: UIElement[];
}

export interface BlueprintNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    nodeType?: string;
    inputs?: BlueprintPin[];
    outputs?: BlueprintPin[];
    properties?: Record<string, any>;
  };
}

export interface BlueprintPin {
  id: string;
  type: 'execution' | 'data';
  dataType?: 'string' | 'number' | 'boolean' | 'object';
  name: string;
  value?: any;
}

export interface BlueprintEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface WidgetProject {
  id: string;
  name: string;
  files: File[];
  uiElements: UIElement[];
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}

export interface Project {
  id: string;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  files?: File[];
}

export type EditorMode = 'ui' | 'blueprint';