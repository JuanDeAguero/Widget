import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from 'styled-components';
import { useApp } from '../../contexts/AppContext';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { CustomConnectionLine } from './CustomConnectionLine';

const BlueprintContainer = styled.div`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  position: relative;

  .react-flow__background {
    background-color: ${props => props.theme.colors.secondary};
  }

  .react-flow__minimap {
    background-color: ${props => props.theme.colors.panel};
    border: 1px solid ${props => props.theme.colors.border};
  }

  .react-flow__controls {
    background-color: ${props => props.theme.colors.panel};
    border: 1px solid ${props => props.theme.colors.border};
    
    button {
      background-color: ${props => props.theme.colors.tertiary};
      border: 1px solid ${props => props.theme.colors.border};
      color: ${props => props.theme.colors.text};
      
      &:hover {
        background-color: ${props => props.theme.colors.hover};
      }
    }
  }

  /* Custom edge styling is handled in CustomEdge component */
  .react-flow__edge.selected .react-flow__edge-path {
    stroke: ${props => props.theme.colors.accentOrange};
  }
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  z-index: 10;
  pointer-events: none;
`;

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 100, y: 100 },
    data: {
      label: 'On Click',
      nodeType: 'event',
      inputs: [],
      outputs: [
        { id: 'exec-out', type: 'execution', name: 'Exec' }
      ]
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: {
      label: 'Set Text',
      nodeType: 'function',
      inputs: [
        { id: 'exec-in', type: 'execution', name: 'Exec' },
        { id: 'target-in', type: 'data', dataType: 'object', name: 'Target' },
        { id: 'text-in', type: 'data', dataType: 'string', name: 'Text' }
      ],
      outputs: [
        { id: 'exec-out', type: 'execution', name: 'Exec' }
      ],
      textValue: ''
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 100, y: 300 },
    data: {
      label: 'String Variable',
      nodeType: 'variable',
      variableName: 'Some Text',
      inputs: [],
      outputs: [
        { id: 'value-out', type: 'data', dataType: 'string', name: 'Value' }
      ],
      properties: {
        value: 'Hello World!'
      }
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: {
      label: 'Object Variable',
      nodeType: 'variable',
      variableName: 'Title Text',
      inputs: [],
      outputs: [
        { id: 'value-out', type: 'data', dataType: 'object', name: 'Value' }
      ],
      properties: {
        type: 'Text Component'
      }
    },
  },
  {
    id: '5',
    type: 'custom',
    position: { x: 300, y: 200 },
    data: {
      label: 'If',
      nodeType: 'function',
      inputs: [
        { id: 'exec-in', type: 'execution', name: 'Exec' },
        { id: 'condition-in', type: 'data', dataType: 'boolean', name: 'Condition' }
      ],
      outputs: [
        { id: 'true-out', type: 'execution', name: 'True' },
        { id: 'false-out', type: 'execution', name: 'False' }
      ]
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'exec-out',
    targetHandle: 'exec-in',
    type: 'custom',
    data: { isExecution: true }
  },
  {
    id: 'e4-2',
    source: '4',
    target: '2',
    sourceHandle: 'value-out',
    targetHandle: 'target-in',
    type: 'custom',
    data: { isExecution: false }
  },
  {
    id: 'e3-2',
    source: '3',
    target: '2',
    sourceHandle: 'value-out',
    targetHandle: 'text-in',
    type: 'custom',
    data: { isExecution: false }
  },
];

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function BlueprintEditor() {
  const { dispatch } = useApp();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const gridSize = 20;

  const handleNodesChange = useCallback((changes: any[]) => {
    const snappedChanges = changes.map((change) => {
      if (change.type === 'position' && change.position) {
        const snappedX = Math.round(change.position.x / gridSize) * gridSize;
        const snappedY = Math.round(change.position.y / gridSize) * gridSize;
        return {
          ...change,
          position: {
            x: snappedX,
            y: snappedY,
          },
        };
      }
      return change;
    });
    onNodesChange(snappedChanges);
  }, [onNodesChange, gridSize]);

  const onConnect = useCallback(
    (params: Connection) => {
      const isExecution = Boolean(params.sourceHandle?.includes('exec') || params.targetHandle?.includes('exec'));
      
      setEdges((eds) => addEdge({
        ...params,
        type: 'custom',
        data: { isExecution }
      }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      dispatch({ type: 'SELECT_NODE', payload: {
        id: node.id,
        type: 'custom',
        position: node.position,
        data: node.data
      }});
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch({ type: 'SELECT_NODE', payload: null });
  }, [dispatch]);

  return (
    <BlueprintContainer>
      {nodes.length === 0 && (
        <EmptyState>
          <div>Right-click to add blueprint nodes</div>
        </EmptyState>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={CustomConnectionLine}
        defaultEdgeOptions={{
          type: 'custom',
        }}
        fitView
        attributionPosition="bottom-left"
        snapToGrid={true}
        snapGrid={[gridSize, gridSize]}
      >
        <Background variant={BackgroundVariant.Dots} gap={gridSize} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            switch (node.type) {
              case 'custom':
                return '#007acc';
              default:
                return '#ff6600';
            }
          }}
        />
      </ReactFlow>
    </BlueprintContainer>
  );
}
