import { useCallback, useEffect, useState, useRef } from 'react';
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
  type Viewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from 'styled-components';
import { useApp } from '../../contexts/AppContext';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { CustomConnectionLine } from './CustomConnectionLine';
import { api } from '../../services/projectAPI';

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

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: ${props => props.theme.colors.accentOrange};
  }
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
  const {
    state,
    dispatch,
    setBlueprintViewport,
    getBlueprintViewport,
    setBlueprintState,
    getBlueprintState,
    setBlueprintSelection,
    getBlueprintSelection
  } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isInitializing, setIsInitializing] = useState(true);
  const lastLoadedContentRef = useRef<string | null>(null);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });

  const normalizeNodesForComparison = (nodes: any[]) => {
    return nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));
  };

  const normalizeEdgesForComparison = (edges: any[]) => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
      data: edge.data,
    }));
  };

  useEffect(() => {
    lastLoadedContentRef.current = null;
    setIsInitializing(true);
    
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }
    
    if (state.activeFileId && getBlueprintViewport) {
      const savedViewport = getBlueprintViewport(state.activeFileId);
      if (savedViewport) {
        setViewport(savedViewport);
      }
    }

    if (state.activeFileId && getBlueprintState) {
      const savedBlueprintState = getBlueprintState(state.activeFileId);
      if (savedBlueprintState) {
        const savedSelection = getBlueprintSelection(state.activeFileId);
        const nodesWithSelection = savedBlueprintState.nodes.map((node: any) => ({
          ...node,
          selected: savedSelection.selectedNodes.includes(node.id)
        }));
        const edgesWithSelection = savedBlueprintState.edges.map((edge: any) => ({
          ...edge,
          selected: savedSelection.selectedEdges.includes(edge.id)
        }));
        
        setNodes(nodesWithSelection);
        setEdges(edgesWithSelection);
      }
    }
    
    setIsInitializing(false);
    
    return () => {
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [state.activeFileId]);

  useEffect(() => {
    const currentViewport = viewport;
    const currentFileId = state.activeFileId;
    const currentNodes = nodes;
    const currentEdges = edges;
    const currentOpenFiles = state.openFiles;
    
    return () => {
      if (currentFileId) {
        const fileStillOpen = currentOpenFiles.some(file => file.id === currentFileId);
        
        if (setBlueprintViewport) {
          if (fileStillOpen) {
            setBlueprintViewport(currentFileId, currentViewport);
          }
        }
        
        if (setBlueprintState) {
          if (fileStillOpen) {
            const normalizedNodes = normalizeNodesForComparison(currentNodes);
            const normalizedEdges = normalizeEdgesForComparison(currentEdges);
            setBlueprintState(currentFileId, normalizedNodes, normalizedEdges);
          }
        }
        
        if (fileStillOpen) {
          const selectedNodes = currentNodes.filter((node: any) => node.selected).map((node: any) => node.id);
          const selectedEdges = currentEdges.filter((edge: any) => edge.selected).map((edge: any) => edge.id);
          setBlueprintSelection(currentFileId, selectedNodes, selectedEdges);
        }
      }
    };
  }, [viewport, state.activeFileId, nodes, edges, state.openFiles]);

  const previousActiveFileId = useRef<string | null>(null);
  useEffect(() => {
    const currentViewport = viewport;
    const currentNodes = nodes;
    const currentEdges = edges;
    
    if (previousActiveFileId.current && previousActiveFileId.current !== state.activeFileId) {
      const previousFileStillOpen = state.openFiles.some(file => file.id === previousActiveFileId.current);
      
      if (setBlueprintViewport && previousFileStillOpen) {
        setBlueprintViewport(previousActiveFileId.current, currentViewport);
      }
      
      if (setBlueprintState && previousFileStillOpen) {
        const normalizedNodes = normalizeNodesForComparison(currentNodes);
        const normalizedEdges = normalizeEdgesForComparison(currentEdges);
        setBlueprintState(previousActiveFileId.current, normalizedNodes, normalizedEdges);
      }
      
      if (previousFileStillOpen) {
        const selectedNodes = currentNodes.filter((node: any) => node.selected).map((node: any) => node.id);
        const selectedEdges = currentEdges.filter((edge: any) => edge.selected).map((edge: any) => edge.id);
        setBlueprintSelection(previousActiveFileId.current, selectedNodes, selectedEdges);
      }
    }
    previousActiveFileId.current = state.activeFileId;
  }, [state.activeFileId, viewport, nodes, edges, state.openFiles]);

  const gridSize = 20;

  const onViewportChange = useCallback((newViewport: Viewport) => {
    setViewport(newViewport);
    if (state.activeFileId && setBlueprintViewport) {
      setBlueprintViewport(state.activeFileId, newViewport);
    }
    
    if (state.activeFileId && setBlueprintState) {
      const normalizedNodes = normalizeNodesForComparison(nodes);
      const normalizedEdges = normalizeEdgesForComparison(edges);
      setBlueprintState(state.activeFileId, normalizedNodes, normalizedEdges);
    }
  }, [state.activeFileId, nodes, edges]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state.activeFileId && setBlueprintViewport) {
        setBlueprintViewport(state.activeFileId, viewport);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.activeFileId, viewport]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state.activeFileId && setBlueprintState) {
        const normalizedNodes = normalizeNodesForComparison(nodes);
        const normalizedEdges = normalizeEdgesForComparison(edges);
        setBlueprintState(state.activeFileId, normalizedNodes, normalizedEdges);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.activeFileId, nodes, edges]);

  useEffect(() => {
    if (state.activeFileId) {
      const activeFile = state.openFiles.find(f => f.id === state.activeFileId);
      
      if (activeFile) {
        const contentHash = JSON.stringify({
          content: activeFile.content,
          fileId: activeFile.id,
          fileName: activeFile.name
        });
        
        if (lastLoadedContentRef.current !== contentHash) {
          lastLoadedContentRef.current = contentHash;
          
          let shouldUpdateNodes = false;
          let newNodes = [];
          let newEdges = [];
          
          if (activeFile.type === 'blueprint') {
            const inMemoryState = getBlueprintState ? getBlueprintState(activeFile.id) : null;
            if (inMemoryState) {
              newNodes = inMemoryState.nodes;
              newEdges = inMemoryState.edges;
              shouldUpdateNodes = true;
            } else if (activeFile.content) {
              const { nodes: savedNodes, edges: savedEdges } = activeFile.content;
              if (savedNodes && savedEdges) {
                newNodes = savedNodes;
                newEdges = savedEdges;
                shouldUpdateNodes = true;
              } else {
                newNodes = [];
                newEdges = [];
                shouldUpdateNodes = true;
              }
            } else {
              newNodes = [];
              newEdges = [];
              shouldUpdateNodes = true;
            }
          } else if (activeFile.type === 'widget' || activeFile.type === 'component') {
            const inMemoryState = getBlueprintState ? getBlueprintState(activeFile.id) : null;
            if (inMemoryState) {
              newNodes = inMemoryState.nodes;
              newEdges = inMemoryState.edges;
              shouldUpdateNodes = true;
            } else if (activeFile.content && activeFile.content.nodes && activeFile.content.edges) {
              newNodes = activeFile.content.nodes;
              newEdges = activeFile.content.edges;
              shouldUpdateNodes = true;
            } else {
              newNodes = [];
              newEdges = [];
              shouldUpdateNodes = true;
            }
          }
          
          if (shouldUpdateNodes) {            
            setIsInitializing(true);
            
            const savedSelection = getBlueprintSelection(activeFile.id);
            const nodesWithSelection = newNodes.map((node: any) => ({
              ...node,
              selected: savedSelection.selectedNodes.includes(node.id)
            }));
            const edgesWithSelection = newEdges.map((edge: any) => ({
              ...edge,
              selected: savedSelection.selectedEdges.includes(edge.id)
            }));
            
            setNodes(nodesWithSelection);
            setEdges(edgesWithSelection);
            
            if (getBlueprintViewport) {
              try {
                const savedViewport = getBlueprintViewport(activeFile.id);
                if (savedViewport) {
                  setViewport(savedViewport);
                } else {
                  setViewport({ x: 0, y: 0, zoom: 1 });
                }
              } catch (error) {
                setViewport({ x: 0, y: 0, zoom: 1 });
              }
            } else {
              setViewport({ x: 0, y: 0, zoom: 1 });
            }
            
            const currentContent = activeFile.content;
            const savedNodes = currentContent?.nodes || [];
            const savedEdges = currentContent?.edges || [];
            
            const nodesChanged = JSON.stringify(savedNodes) !== JSON.stringify(newNodes);
            const edgesChanged = JSON.stringify(savedEdges) !== JSON.stringify(newEdges);
            
            dispatch({
              type: 'UPDATE_FILE_MODIFIED',
              payload: { id: activeFile.id, isModified: nodesChanged || edgesChanged }
            });
            
            if (initializationTimeoutRef.current) {
              clearTimeout(initializationTimeoutRef.current);
            }
            
            setIsInitializing(false);
          }
        }
      }
    }
  }, [state.activeFileId, state.openFiles]);

  const saveBlueprint = useCallback(async () => {
    if (!state.activeFileId) return;
    
    const activeFile = state.openFiles.find(f => f.id === state.activeFileId);
    if (!activeFile || (activeFile.type !== 'blueprint' && activeFile.type !== 'widget' && activeFile.type !== 'component')) {
      return;
    }

    const currentBlueprintState = getBlueprintState ? getBlueprintState(activeFile.id) : null;
    const rawNodes = currentBlueprintState ? currentBlueprintState.nodes : nodes;
    const rawEdges = currentBlueprintState ? currentBlueprintState.edges : edges;

    const blueprintNodes = normalizeNodesForComparison(rawNodes);
    const blueprintEdges = normalizeEdgesForComparison(rawEdges);

    const blueprintContent = {
      nodes: blueprintNodes,
      edges: blueprintEdges,
      version: '1.0.0',
      savedAt: new Date().toISOString()
    };

    try {
      if (state.project?.id && activeFile?.id) {
        await api.projects.updateFile(state.project.id, activeFile.id, { content: blueprintContent });
      }

      dispatch({
        type: 'OPEN_FILE',
        payload: {
          ...activeFile,
          content: blueprintContent,
          isModified: false
        }
      });

      dispatch({
        type: 'UPDATE_PROJECT_FILE',
        payload: { id: activeFile.id, content: blueprintContent }
      });

      dispatch({
        type: 'UPDATE_FILE_MODIFIED',
        payload: { id: activeFile.id, isModified: false }
      });
    } finally {
      window.dispatchEvent(new CustomEvent('save-end'));
    }
  }, [state.activeFileId, state.openFiles, state.project.id, nodes, edges, dispatch, getBlueprintState]);

  useEffect(() => {
    const handleSave = () => {
      saveBlueprint();
    };

    window.addEventListener('blueprint-save', handleSave);
    return () => {
      window.removeEventListener('blueprint-save', handleSave);
    };
  }, [saveBlueprint]);

  useEffect(() => {
    const checkModification = () => {
      if (!isInitializing && state.activeFileId && lastLoadedContentRef.current !== null) {
        const activeFile = state.openFiles.find(f => f.id === state.activeFileId);
        if (activeFile && (activeFile.type === 'blueprint' || activeFile.type === 'widget' || activeFile.type === 'component')) {
          const currentContent = activeFile.content;
          const savedNodes = currentContent?.nodes || [];
          const savedEdges = currentContent?.edges || [];
          
          const normalizedSavedNodes = normalizeNodesForComparison(savedNodes);
          const normalizedCurrentNodes = normalizeNodesForComparison(nodes);
          const normalizedSavedEdges = normalizeEdgesForComparison(savedEdges);
          const normalizedCurrentEdges = normalizeEdgesForComparison(edges);
          
          const nodesChanged = JSON.stringify(normalizedSavedNodes) !== JSON.stringify(normalizedCurrentNodes);
          const edgesChanged = JSON.stringify(normalizedSavedEdges) !== JSON.stringify(normalizedCurrentEdges);
          
          if (nodesChanged || edgesChanged) {
            dispatch({
              type: 'UPDATE_FILE_MODIFIED',
              payload: { id: activeFile.id, isModified: true }
            });
          }
          
          if (setBlueprintState) {
            setBlueprintState(activeFile.id, normalizedCurrentNodes, normalizedCurrentEdges);
          }
        }
      }
    };
    
    const timeoutId = setTimeout(checkModification, 0);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [nodes, edges, isInitializing, state.activeFileId, state.openFiles, dispatch, setBlueprintState]);

  useEffect(() => {
    if (!isInitializing && state.activeFileId) {
      const fileStillOpen = state.openFiles.some(file => file.id === state.activeFileId);
      
      if (fileStillOpen) {
        const selectedNodes = nodes.filter((node: any) => node.selected).map((node: any) => node.id);
        const selectedEdges = edges.filter((edge: any) => edge.selected).map((edge: any) => edge.id);
        
        setBlueprintSelection(state.activeFileId, selectedNodes, selectedEdges);
      }
    }
  }, [nodes, edges, isInitializing, state.activeFileId, state.openFiles, setBlueprintSelection]);

  useEffect(() => {
    const handleAddNode = (event: any) => {
      const nodeType = event.detail?.nodeType || 'function';
      addNode(nodeType);
    };

    window.addEventListener('blueprint-add-node', handleAddNode);

    return () => {
      window.removeEventListener('blueprint-add-node', handleAddNode);
    };
  }, []);

  const addNode = (nodeType: string) => {
    let newNode;
    
    switch (nodeType) {
      case 'event':
        newNode = {
          id: `node_${Date.now()}`,
          type: 'custom',
          position: { x: 200, y: 200 },
          data: {
            label: 'New Event',
            nodeType: 'event',
            inputs: [],
            outputs: [
              { id: 'exec-out', type: 'execution', name: 'Exec' }
            ]
          },
        };
        break;

      case 'function':
        newNode = {
          id: `node_${Date.now()}`,
          type: 'custom',
          position: { x: 200, y: 200 },
          data: {
            label: 'New Function',
            nodeType: 'function',
            inputs: [
              { id: 'exec-in', type: 'execution', name: 'Exec' },
              { id: 'input-1', type: 'data', dataType: 'string', name: 'Input' }
            ],
            outputs: [
              { id: 'exec-out', type: 'execution', name: 'Exec' }
            ],
            textValue: ''
          },
        };
        break;

      case 'variable':
        newNode = {
          id: `node_${Date.now()}`,
          type: 'custom',
          position: { x: 200, y: 200 },
          data: {
            label: 'New Variable',
            nodeType: 'variable',
            variableName: 'New Variable',
            inputs: [],
            outputs: [
              { id: 'value-out', type: 'data', dataType: 'string', name: 'Value' }
            ],
            properties: {
              value: 'New Value'
            }
          },
        };
        break;

      case 'endpoint':
        newNode = {
          id: `node_${Date.now()}`,
          type: 'custom',
          position: { x: 200, y: 200 },
          data: {
            label: 'API Endpoint',
            nodeType: 'function',
            inputs: [
              { id: 'exec-in', type: 'execution', name: 'Exec' },
              { id: 'params-in', type: 'data', dataType: 'object', name: 'Params' }
            ],
            outputs: [
              { id: 'exec-out', type: 'execution', name: 'Exec' },
              { id: 'response-out', type: 'data', dataType: 'object', name: 'Response' }
            ],
            textValue: ''
          },
        };
        break;
        
      default:
        newNode = {
          id: `node_${Date.now()}`,
          type: 'custom',
          position: { x: 200, y: 200 },
          data: {
            label: 'New Node',
            nodeType: 'function',
            inputs: [
              { id: 'exec-in', type: 'execution', name: 'Exec' }
            ],
            outputs: [
              { id: 'exec-out', type: 'execution', name: 'Exec' }
            ],
            textValue: ''
          },
        };
    }
    
    setNodes((nds) => [...nds, newNode]);
  };

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
        fitView={false}
        viewport={viewport}
        onViewportChange={onViewportChange}
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