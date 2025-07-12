export interface WidgetBlueprint {
  id: string;
  name: string;
  type: 'widget' | 'component';
  created: Date;
  modified: Date;
  thumbnail?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'blueprint';
  path: string;
  size?: number;
  created: Date;
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
  assets: Asset[];
  blueprints: WidgetBlueprint[];
  uiElements: UIElement[];
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
}

export type EditorMode = 'ui' | 'blueprint';