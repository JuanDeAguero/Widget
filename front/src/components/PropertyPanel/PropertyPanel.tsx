import { useState } from 'react';
import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Panel, PanelHeader, PanelContent, VerticalSeparator, IconButton } from '../../styles/GlobalStyles';

const PropertyContainer = styled(Panel)<{ isMinimized: boolean }>`
  width: ${props => props.isMinimized ? '24px' : props.theme.sizes.panelWidth};
  border-left: 1px solid ${props => props.theme.colors.border};
  transition: width 0.3s ease;
  overflow: hidden;
`;

const MinimizedBar = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  background-color: ${props => props.theme.colors.header};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  position: relative;
  padding-top: ${props => props.theme.spacing.md};
  
  &:hover {
    background-color: ${props => props.disabled ? props.theme.colors.header : props.theme.colors.hover};
  }
`;

const RotatedText = styled.div`
  writing-mode: vertical-lr;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  letter-spacing: 2px;
  user-select: none;
`;

const ExpandedHeader = styled(PanelHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: ${props => props.theme.spacing.xs};
`;

const HeaderTitle = styled.span`
  flex: 1;
`;

const PropertyGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const PropertyLabel = styled.label`
  display: block;
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
`;

const PropertyInput = styled.input`
  width: 100%;
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs};
  font-size: 12px;
  border-radius: 2px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs};
  font-size: 12px;
  border-radius: 2px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const PropertyTextarea = styled.textarea`
  width: 100%;
  background-color: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xs};
  font-size: 12px;
  border-radius: 2px;
  resize: vertical;
  min-height: 60px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
  }
`;

const PropertyRow = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
  margin-top: ${props => props.theme.spacing.xl};
`;

export function PropertyPanel() {
  const { state, getFileEditorMode } = useApp();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMinimizedBarDisabled, setIsMinimizedBarDisabled] = useState(false);

  const fileEditorMode = state.activeFileId ? getFileEditorMode(state.activeFileId) : 'ui';

  const toggleMinimized = () => {
    if (isMinimized) {
      if (isMinimizedBarDisabled) return;
      setIsMinimized(false);
    } else {
      setIsMinimized(true);
      setIsMinimizedBarDisabled(true);
      
      setTimeout(() => {
        setIsMinimizedBarDisabled(false);
      }, 300);
    }
  };
  
  if (isMinimized) {
    return (
      <PropertyContainer isMinimized={true}>
        <MinimizedBar 
          disabled={isMinimizedBarDisabled}
          onClick={toggleMinimized}
        >
          <RotatedText>PROPERTIES</RotatedText>
        </MinimizedBar>
      </PropertyContainer>
    );
  }

  const renderImageProperties = () => {
    const activeFile = state.openFiles.find(file => file.id === state.activeFileId);
    if (!activeFile || activeFile.type !== 'image') {
      return <EmptyState>No image selected</EmptyState>;
    }

    return (
      <>
        <PropertyGroup>
          <PropertyLabel>File Name</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={activeFile.name} 
            readOnly 
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>File Type</PropertyLabel>
          <PropertyInput 
            type="text" 
            value="PNG Image" 
            readOnly 
          />
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Dimensions</PropertyLabel>
          <PropertyRow>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Width</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={400} 
                readOnly 
              />
            </div>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Height</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={300} 
                readOnly 
              />
            </div>
          </PropertyRow>
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>File Size</PropertyLabel>
          <PropertyInput 
            type="text" 
            value="45.2 KB" 
            readOnly 
          />
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Import Settings</PropertyLabel>
          <PropertyLabel>Compression</PropertyLabel>
          <PropertySelect defaultValue="auto">
            <option value="auto">Auto</option>
            <option value="none">None</option>
            <option value="lossless">Lossless</option>
            <option value="lossy">Lossy</option>
          </PropertySelect>
          
          <PropertyLabel>Filter Mode</PropertyLabel>
          <PropertySelect defaultValue="bilinear">
            <option value="point">Point</option>
            <option value="bilinear">Bilinear</option>
            <option value="trilinear">Trilinear</option>
          </PropertySelect>
        </PropertyGroup>
      </>
    );
  };

  const renderUIElementProperties = () => {
    if (!state.selectedElement) {
      return <EmptyState>Select an element to view properties</EmptyState>;
    }

    const element = state.selectedElement;

    return (
      <>
        <PropertyGroup>
          <PropertyLabel>Name</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={element.name} 
            onChange={() => {}} 
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Type</PropertyLabel>
          <PropertySelect value={element.type}>
            <option value="button">Button</option>
            <option value="text">Text</option>
            <option value="input">Input</option>
            <option value="container">Container</option>
            <option value="image">Image</option>
          </PropertySelect>
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Transform</PropertyLabel>
          <PropertyRow>
            <div style={{ flex: 1 }}>
              <PropertyLabel>X</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.x} 
                onChange={() => {}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Y</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.y} 
                onChange={() => {}}
              />
            </div>
          </PropertyRow>
          <PropertyRow>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Width</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.width} 
                onChange={() => {}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Height</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.height} 
                onChange={() => {}}
              />
            </div>
          </PropertyRow>
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Appearance</PropertyLabel>
          {element.type === 'text' && (
            <>
              <PropertyLabel>Text</PropertyLabel>
              <PropertyInput 
                type="text" 
                value={element.properties?.text || ''} 
                onChange={() => {}}
              />
              <PropertyLabel>Font Size</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={element.properties?.fontSize || 14} 
                onChange={() => {}}
              />
            </>
          )}
          {element.type === 'button' && (
            <>
              <PropertyLabel>Label</PropertyLabel>
              <PropertyInput 
                type="text" 
                value={element.properties?.label || ''} 
                onChange={() => {}}
              />
            </>
          )}
        </PropertyGroup>
      </>
    );
  };

  const renderNodeProperties = () => {
    if (!state.selectedNode) {
      return <EmptyState>Select a node to view properties</EmptyState>;
    }

    const node = state.selectedNode;

    return (
      <>
        <PropertyGroup>
          <PropertyLabel>Node Type</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={node.type} 
            readOnly 
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Label</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={node.data.label} 
            onChange={() => {}}
          />
        </PropertyGroup>
        
        {node.data.nodeType === 'email' && (
          <>
            <PropertyGroup>
              <PropertyLabel>To</PropertyLabel>
              <PropertyInput 
                type="email" 
                value={node.data.properties?.to || ''} 
                onChange={() => {}}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Subject</PropertyLabel>
              <PropertyInput 
                type="text" 
                value={node.data.properties?.subject || ''} 
                onChange={() => {}}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Body</PropertyLabel>
              <PropertyTextarea 
                value={node.data.properties?.body || ''} 
                onChange={() => {}}
                rows={4}
              />
            </PropertyGroup>
          </>
        )}

        {node.data.nodeType === 'http' && (
          <>
            <PropertyGroup>
              <PropertyLabel>URL</PropertyLabel>
              <PropertyInput 
                type="url" 
                value={node.data.properties?.url || ''} 
                onChange={() => {}}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Method</PropertyLabel>
              <PropertySelect 
                value={node.data.properties?.method || 'GET'} 
                onChange={() => {}}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </PropertySelect>
            </PropertyGroup>
          </>
        )}

        {node.data.nodeType === 'wait' && (
          <PropertyGroup>
            <PropertyLabel>Duration (ms)</PropertyLabel>
            <PropertyInput 
              type="number" 
              value={node.data.properties?.duration || 1000} 
              onChange={() => {}}
            />
          </PropertyGroup>
        )}

        {node.data.nodeType === 'database' && (
          <>
            <PropertyGroup>
              <PropertyLabel>Query</PropertyLabel>
              <PropertyTextarea 
                value={node.data.properties?.query || ''} 
                onChange={() => {}}
                rows={3}
              />
            </PropertyGroup>
          </>
        )}

        {node.data.nodeType === 'file' && (
          <>
            <PropertyGroup>
              <PropertyLabel>File Path</PropertyLabel>
              <PropertyInput 
                type="text" 
                value={node.data.properties?.path || ''} 
                onChange={() => {}}
              />
            </PropertyGroup>
            <PropertyGroup>
              <PropertyLabel>Operation</PropertyLabel>
              <PropertySelect 
                value={node.data.properties?.operation || 'read'} 
                onChange={() => {}}
              >
                <option value="read">Read</option>
                <option value="write">Write</option>
                <option value="append">Append</option>
                <option value="delete">Delete</option>
              </PropertySelect>
            </PropertyGroup>
          </>
        )}

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Position</PropertyLabel>
          <PropertyRow>
            <div style={{ flex: 1 }}>
              <PropertyLabel>X</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={node.position.x} 
                onChange={() => {}}
              />
            </div>
            <div style={{ flex: 1 }}>
              <PropertyLabel>Y</PropertyLabel>
              <PropertyInput 
                type="number" 
                value={node.position.y} 
                onChange={() => {}}
              />
            </div>
          </PropertyRow>
        </PropertyGroup>
      </>
    );
  };

  const renderQueueJobProperties = () => {
    if (!state.selectedQueueJob) {
      return <EmptyState>Select a queue job to view properties</EmptyState>;
    }

    const job = state.selectedQueueJob;
    const jobFiles = state.project.files.filter(file => file.type === 'job');

    const handleJobFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedJobFile = event.target.value;
      window.dispatchEvent(new CustomEvent('queue-job-file-update', { 
        detail: { jobFile: selectedJobFile } 
      }));
    };

    return (
      <>
        <PropertyGroup>
          <PropertyLabel>Job Name</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={job.name} 
            readOnly
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Job Type</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={job.type} 
            readOnly
          />
        </PropertyGroup>

        <PropertyGroup>
          <PropertyLabel>Status</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={job.status} 
            readOnly
          />
        </PropertyGroup>

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Assigned Job File</PropertyLabel>
          <PropertySelect 
            value={job.jobFile || ''} 
            onChange={handleJobFileChange}
          >
            <option value="">None</option>
            {jobFiles.map(jobFile => (
              <option key={jobFile.id} value={jobFile.path}>
                {jobFile.name}
              </option>
            ))}
          </PropertySelect>
        </PropertyGroup>

        {job.jobFile && (
          <PropertyGroup>
            <PropertyLabel>Job File Path</PropertyLabel>
            <PropertyInput 
              type="text" 
              value={job.jobFile} 
              readOnly
            />
          </PropertyGroup>
        )}

        <VerticalSeparator />

        <PropertyGroup>
          <PropertyLabel>Created At</PropertyLabel>
          <PropertyInput 
            type="text" 
            value={job.createdAt.toLocaleString()} 
            readOnly
          />
        </PropertyGroup>

        {job.startedAt && (
          <PropertyGroup>
            <PropertyLabel>Started At</PropertyLabel>
            <PropertyInput 
              type="text" 
              value={job.startedAt.toLocaleString()} 
              readOnly
            />
          </PropertyGroup>
        )}

        {job.completedAt && (
          <PropertyGroup>
            <PropertyLabel>Completed At</PropertyLabel>
            <PropertyInput 
              type="text" 
              value={job.completedAt.toLocaleString()} 
              readOnly
            />
          </PropertyGroup>
        )}

        {job.progress !== undefined && (
          <PropertyGroup>
            <PropertyLabel>Progress</PropertyLabel>
            <PropertyInput 
              type="text" 
              value={`${job.progress}%`} 
              readOnly
            />
          </PropertyGroup>
        )}

        {job.error && (
          <PropertyGroup>
            <PropertyLabel>Error</PropertyLabel>
            <PropertyTextarea 
              value={job.error} 
              readOnly
              rows={2}
            />
          </PropertyGroup>
        )}
      </>
    );
  };

  return (
    <PropertyContainer isMinimized={false}>
      <ExpandedHeader>
        <HeaderTitle>Properties</HeaderTitle>
        <IconButton 
          onClick={toggleMinimized}
          title="Minimize Properties Panel"
        >
          <ChevronRight size={14} />
        </IconButton>
      </ExpandedHeader>
      <PanelContent>
        {(() => {
          const activeFile = state.openFiles.find(file => file.id === state.activeFileId);
          
          if (state.selectedQueueJob && activeFile?.type === 'queue') {
            return renderQueueJobProperties();
          }
          
          if (activeFile?.type === 'image') {
            return renderImageProperties();
          }
          
          return fileEditorMode === 'ui' ? renderUIElementProperties() : renderNodeProperties();
        })()}
      </PanelContent>
    </PropertyContainer>
  );
}