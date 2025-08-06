import React, { useCallback, useEffect } from 'react';
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
import { CustomNode } from '../BlueprintEditor/CustomNode';
import { CustomEdge } from '../BlueprintEditor/CustomEdge';
import { CustomConnectionLine } from '../BlueprintEditor/CustomConnectionLine';

const JobContainer = styled.div`
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
      label: 'Start',
      nodeType: 'start',
      inputs: [],
      outputs: [
        { id: 'exec-out', type: 'execution', name: 'Next' }
      ]
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 400, y: 100 },
    data: {
      label: 'Send Email',
      nodeType: 'email',
      inputs: [
        { id: 'exec-in', type: 'execution', name: 'Previous' },
        { id: 'to-in', type: 'data', dataType: 'string', name: 'To' },
        { id: 'subject-in', type: 'data', dataType: 'string', name: 'Subject' },
        { id: 'body-in', type: 'data', dataType: 'string', name: 'Body' }
      ],
      outputs: [
        { id: 'exec-out', type: 'execution', name: 'Next' },
        { id: 'success-out', type: 'data', dataType: 'boolean', name: 'Success' }
      ],
      properties: {
        to: 'user@example.com',
        subject: 'Welcome!',
        body: 'Thank you for signing up!'
      }
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
  },
];

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

interface JobEditorProps {}

export const JobEditor: React.FC<JobEditorProps> = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { dispatch } = useApp();

  useEffect(() => {
    const handleAddNode = (event: any) => {
      const nodeType = event.detail?.nodeType || 'email';
      addNode(nodeType);
    };

    const handleSaveJob = () => {
      saveJob();
    };

    const handleTestJob = () => {
      testJob();
    };

    window.addEventListener('job-add-node', handleAddNode);
    window.addEventListener('job-save', handleSaveJob);
    window.addEventListener('job-test', handleTestJob);

    return () => {
      window.removeEventListener('job-add-node', handleAddNode);
      window.removeEventListener('job-save', handleSaveJob);
      window.removeEventListener('job-test', handleTestJob);
    };
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'custom',
      };
      setEdges((eds) => addEdge(edge, eds) as any);
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    dispatch({ type: 'SELECT_NODE', payload: node });
  }, [dispatch]);

  const addNode = (nodeType: string) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position: { x: 200, y: 200 },
      data: {
        label: `New ${nodeType}`,
        nodeType,
        inputs: [
          { id: 'exec-in', type: 'execution', name: 'Previous' }
        ],
        outputs: [
          { id: 'exec-out', type: 'execution', name: 'Next' }
        ],
        properties: {}
      },
    };

    setNodes((nds) => [...nds, newNode] as any);
  };

  const saveJob = () => {

  };

  const testJob = () => {
    
  };

  return (
    <JobContainer>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={CustomConnectionLine}
        fitView
        snapToGrid
        snapGrid={[10, 10]}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
      
      {nodes.length === 0 && (
        <EmptyState>
          <div>Start building your job workflow</div>
          <div>Add nodes from the toolbar above</div>
        </EmptyState>
      )}
    </JobContainer>
  );
};