import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import styled from 'styled-components';
import { Zap, Settings, GitBranch } from 'lucide-react';

const NodeContainer = styled.div<{ isVariable?: boolean; nodeType?: string }>`
  background-color: ${props => props.isVariable ? 'rgba(37, 37, 38, 0.7)' : 'rgba(37, 37, 38, 0.9)'};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.isVariable ? '16px' : '8px'};
  min-width: ${props => props.isVariable ? '120px' : '160px'};
  width: ${props => props.isVariable ? '120px' : '160px'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    border-color: ${props => props.theme.colors.accentOrange};
  }

  &.selected {
    border-color: ${props => props.theme.colors.accent};
  }
`;

const NodeHeader = styled.div<{ isVariable?: boolean; nodeType?: string; label?: string }>`
  background: ${props => {
    if (props.isVariable) return 'rgba(37, 37, 38, 0.9)';
    if (props.nodeType === 'event') {
      return 'linear-gradient(135deg, rgba(220, 38, 38, 0.6) 0%, rgba(185, 28, 28, 0.4) 50%, rgba(153, 27, 27, 0.3) 100%)';
    }
    if (props.nodeType === 'function' && props.label === 'If') {
      return 'linear-gradient(135deg, rgba(128, 128, 128, 0.6) 0%, rgba(96, 96, 96, 0.4) 50%, rgba(64, 64, 64, 0.3) 100%)';
    }
    if (props.nodeType === 'function') {
      return 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 50%, rgba(29, 78, 216, 0.3) 100%)';
    }
    return props.theme.colors.header;
  }};
  padding: ${props => props.isVariable ? '4px 8px 4px 12px' : '4px 8px'};
  border-radius: ${props => props.isVariable ? '14px' : '6px 6px 0 0'};
  font-size: ${props => props.isVariable ? '11px' : '12px'};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  min-height: ${props => props.isVariable ? '20px' : '22px'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
      if (props.isVariable) return 'none';
      if (props.nodeType === 'event') {
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)';
      }
      if (props.nodeType === 'function') {
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)';
      }
      return 'none';
    }};
    pointer-events: none;
  }
`;

const NodeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const NodeBody = styled.div<{ nodeType?: string }>`
  padding: ${props => props.theme.spacing.sm};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  
  /* For event and function nodes, ensure content area fills remaining space to align with grid */
  ${props => (props.nodeType === 'event' || props.nodeType === 'function') && `
    flex: 1;
    padding: 6px 8px; /* Slightly reduce top/bottom padding to fit grid alignment */
  `}
`;

const Pin = styled.div<{ isInput: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isInput ? 'flex-start' : 'flex-end'};
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  position: relative;
  height: 20px;
`;

const PinLabel = styled.span<{ isInput: boolean }>`
  margin: ${props => props.isInput ? '0 0 0 8px' : '0 8px 0 0'};
  transform: translateY(-1px); /* Move only the text 2px up */
  color: white; /* Make pin text white */
`;

const CustomHandle = styled(Handle)<{ pinType: 'execution' | 'data'; isVariable?: boolean; pinId?: string }>`
  width: 8px;
  height: 8px;
  background-color: ${props => {
    if (props.pinType === 'execution') {
      return props.theme.colors.accentOrange;
    }
    if (props.pinId === 'condition-in') {
      return '#dc2626';
    }
    return props.theme.colors.accent;
  }};
  border: 2px solid transparent;
  border-radius: ${props => props.pinType === 'execution' ? '0' : '50%'};
  transform: ${props => props.pinType === 'execution' ? 'rotate(0deg)' : 'none'};
  position: ${props => props.isVariable ? 'absolute !important' : 'static !important'};

  &:hover {
    background-color: ${props => {
      if (props.pinType === 'execution') {
        return '#ff7700';
      }
      if (props.pinId === 'condition-in') {
        return '#ef4444';
      }
      return '#0080d4';
    }};
  }
`;

export interface CustomNodeData {
  label: string;
  nodeType?: 'event' | 'function' | 'variable';
  variableName?: string;
  inputs?: Array<{
    id: string;
    type: 'execution' | 'data';
    dataType?: string;
    name: string;
  }>;
  outputs?: Array<{
    id: string;
    type: 'execution' | 'data';
    dataType?: string;
    name: string;
  }>;
  properties?: Record<string, any>;
}

interface CustomNodeProps {
  data: CustomNodeData;
  selected?: boolean;
}

export const CustomNode = memo(({ data, selected }: CustomNodeProps) => {
  const isVariable = data.nodeType === 'variable';
  
  return (
    <NodeContainer 
      className={selected ? 'selected' : ''} 
      isVariable={isVariable}
      nodeType={data.nodeType}
    >
      <div style={{ position: 'relative' }}>
        <NodeHeader isVariable={isVariable} nodeType={data.nodeType} label={data.label}>
          {!isVariable && data.nodeType === 'event' && (
            <NodeIcon>
              <Zap />
            </NodeIcon>
          )}
          {!isVariable && data.nodeType === 'function' && data.label === 'If' && (
            <NodeIcon>
              <GitBranch />
            </NodeIcon>
          )}
          {!isVariable && data.nodeType === 'function' && data.label !== 'If' && (
            <NodeIcon>
              <Settings />
            </NodeIcon>
          )}
          {isVariable ? (data.variableName || data.label) : data.label}
        </NodeHeader>
        
        {isVariable && data.outputs && data.outputs.length > 0 && (
          <>
            {data.outputs.map((output) => (
              <CustomHandle
                key={output.id}
                type="source"
                position={Position.Right}
                id={output.id}
                pinType={output.type}
                isVariable={true}
                style={{ 
                  right: '8px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  zIndex: 10
                }}
              />
            ))}
          </>
        )}
      </div>
      
      {!isVariable && (
        <NodeBody nodeType={data.nodeType}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.inputs && data.inputs.map((input) => (
                <Pin key={input.id} isInput={true}>
                  <CustomHandle
                    type="target"
                    position={Position.Left}
                    id={input.id}
                    pinType={input.type}
                    isVariable={false}
                    pinId={input.id}
                  />
                  {input.type !== 'execution' && (
                    <PinLabel isInput={true}>{input.name}</PinLabel>
                  )}
                </Pin>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.outputs && data.outputs.map((output) => (
                <Pin key={output.id} isInput={false}>
                  {(output.type !== 'execution' || (output.name !== 'Exec' && output.name !== '')) && (
                    <PinLabel isInput={false}>{output.name}</PinLabel>
                  )}
                  <CustomHandle
                    type="source"
                    position={Position.Right}
                    id={output.id}
                    pinType={output.type}
                    isVariable={false}
                    pinId={output.id}
                  />
                </Pin>
              ))}
            </div>
          </div>

          {data.properties && (
            <div style={{ marginTop: '8px', fontSize: '10px', color: '#8d8d8d' }}>
              {Object.entries(data.properties).map(([key, value]) => (
                <div key={key}>
                  {key === 'buttonName' ? String(value) : `${key}: ${String(value)}`}
                </div>
              ))}
            </div>
          )}
        </NodeBody>
      )}
    </NodeContainer>
  );
});
