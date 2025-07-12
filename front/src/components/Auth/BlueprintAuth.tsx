import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Handle,
  Position,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/authAPI';
import { Play, Zap, UserPlus, LogIn } from 'lucide-react';

const AuthContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 100%);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CompileButton = styled.button`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 12px 40px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateX(-50%);
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(239, 68, 68, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
`;

const BlueprintContainer = styled.div`
  flex: 1;
  position: relative;

  .react-flow__background {
    background-color: transparent;
  }

  .react-flow__minimap {
    background-color: rgba(37, 37, 38, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .react-flow__controls {
    background-color: rgba(37, 37, 38, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    button {
      background-color: rgba(45, 55, 72, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e5e7eb;
      
      &:hover {
        background-color: rgba(74, 85, 104, 0.8);
      }
    }
  }

  .react-flow__edge-path {
    stroke: #fbbf24;
    stroke-width: 3;
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: #f59e0b;
  }

  .react-flow__connection-line {
    stroke: #fbbf24;
    stroke-width: 3;
  }

  .react-flow__handle {
    border: 2px solid white;
    background: #fbbf24;
    width: 16px;
    height: 16px;
  }

  /* Better placeholder visibility */
  input::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1;
  }

  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1;
  }

  input::-moz-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1;
  }

  input:-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1;
  }
`;

const AuthNode = ({ data }: { data: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const getNodeColor = () => {
    switch (data.nodeType) {
      case 'event':
        return 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(185, 28, 28, 0.6) 100%)';
      case 'login':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.6) 100%)';
      case 'register':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.6) 100%)';
      default:
        return 'rgba(37, 37, 38, 0.9)';
    }
  };

  const getIcon = () => {
    switch (data.nodeType) {
      case 'event':
        return <Zap size={16} />;
      case 'login':
        return <LogIn size={16} />;
      case 'register':
        return <UserPlus size={16} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        background: getNodeColor(),
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        minWidth: '200px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'relative',
      }}
    >
      {data.nodeType !== 'event' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            background: '#fbbf24',
            width: '16px',
            height: '16px',
            border: '2px solid white',
          }}
        />
      )}
      
      {data.nodeType === 'event' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#fbbf24',
            width: '16px',
            height: '16px',
            border: '2px solid white',
          }}
        />
      )}

      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {getIcon()}
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label}</span>
      </div>

      <div style={{ padding: '16px' }}>
        {data.nodeType === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                data.onEmailChange?.(e.target.value);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '14px',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                data.onPasswordChange?.(e.target.value);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>
        )}

        {data.nodeType === 'register' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                data.onNameChange?.(e.target.value);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '14px',
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                data.onEmailChange?.(e.target.value);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '14px',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                data.onPasswordChange?.(e.target.value);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>
        )}

        {data.nodeType === 'event' && (
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Connect to Login or Create Account
          </div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  auth: AuthNode,
};

export const BlueprintAuth: React.FC = () => {
  const { state: authState, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  React.useEffect(() => {
    if (authState.error) {
      setError(authState.error);
      setIsLoading(false);
    }
  }, [authState.error]);

  const initialNodes: Node[] = [
    {
      id: 'start',
      type: 'auth',
      position: { x: 100, y: 200 },
      data: {
        label: 'On Start',
        nodeType: 'event',
      },
    },
    {
      id: 'login',
      type: 'auth',
      position: { x: 400, y: 100 },
      data: {
        label: 'Login',
        nodeType: 'login',
        onEmailChange: (email: string) => setLoginData(prev => ({ ...prev, email })),
        onPasswordChange: (password: string) => setLoginData(prev => ({ ...prev, password })),
      },
    },
    {
      id: 'register',
      type: 'auth',
      position: { x: 400, y: 300 },
      data: {
        label: 'Create Account',
        nodeType: 'register',
        onNameChange: (name: string) => setRegisterData(prev => ({ ...prev, name })),
        onEmailChange: (email: string) => setRegisterData(prev => ({ ...prev, email })),
        onPasswordChange: (password: string) => setRegisterData(prev => ({ ...prev, password })),
      },
    },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const handleCompile = async () => {
    setIsLoading(true);
    setError(null);
    clearError();

    const startTime = Date.now();
    const minLoadingTime = 1000;

    try {
      const startConnection = edges.find(edge => edge.source === 'start');
      
      if (!startConnection) {
        throw new Error('No connection from On Start node. Connect to Login or Create Account.');
      }

      if (startConnection.target === 'login') {
        if (!loginData.email || !loginData.password) {
          throw new Error('Please fill in all login fields');
        }
        
        const result = await authAPI.login({ 
          email: loginData.email, 
          password: loginData.password 
        });
        
        localStorage.setItem('widget_auth', JSON.stringify(result));

      } else if (startConnection.target === 'register') {
        if (!registerData.name || !registerData.email || !registerData.password) {
          throw new Error('Please fill in all registration fields');
        }
        
        const result = await authAPI.register({ 
          name: registerData.name, 
          email: registerData.email, 
          password: registerData.password 
        });
        
        localStorage.setItem('widget_auth', JSON.stringify(result));
      } else {
        throw new Error('Invalid connection target');
      }
      
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }
      
      window.location.reload();
      
    } catch (err) {
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }
      
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <CompileButton onClick={handleCompile} disabled={isLoading}>
        {isLoading ? (
          <div className="loading-spinner" />
        ) : (
          <Play size={16} />
        )}
        {isLoading ? 'Compiling...' : 'Compile'}
      </CompileButton>

      {error && (
        <ErrorPanel>
          {error}
        </ErrorPanel>
      )}

      <BlueprintContainer>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.data.nodeType) {
                case 'event': return '#dc2626';
                case 'login': return '#3b82f6';
                case 'register': return '#10b981';
                default: return '#6b7280';
              }
            }}
          />
        </ReactFlow>
      </BlueprintContainer>
    </AuthContainer>
  );
};