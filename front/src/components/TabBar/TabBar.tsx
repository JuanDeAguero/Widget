import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../../contexts/AppContext';
import { ProjectNameLoader } from '../LoadingAnimation/LoadingAnimation';
import type { OpenFile } from '../../types';

const TabBarContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors.header};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  height: 32px;
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    height: 2px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ProjectName = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.header};
  white-space: nowrap;
  flex-shrink: 0;
`;

const Tab = styled.div<{ isActive: boolean; isModified: boolean; isDragging?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 12px;
  min-width: 120px;
  max-width: 200px;
  height: 100%;
  background-color: ${props => props.isActive ? props.theme.colors.background : props.theme.colors.header};
  color: ${props => props.isActive ? props.theme.colors.text : props.theme.colors.textSecondary};
  border-right: 1px solid ${props => props.theme.colors.border};
  cursor: ${props => props.isDragging ? 'grabbing' : 'pointer'};
  user-select: none;
  position: relative;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  
  &:hover {
    background-color: ${props => props.isActive ? props.theme.colors.background : props.theme.colors.hover};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.isActive ? props.theme.colors.accent : 'transparent'};
  }
`;

const TabIcon = styled.div<{ fileType: string }>`
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  
  ${props => {
    switch (props.fileType) {
      case 'widget':
        return `background-color: ${props.theme.colors.accent};`;
      case 'component':
        return `background-color: ${props.theme.colors.accentOrange};`;
      case 'image':
        return `background-color: ${props.theme.colors.success};`;
      case 'icon':
        return `background-color: ${props.theme.colors.warning};`;
      case 'database':
        return `background-color: #9333ea;`;
      case 'endpoint':
        return `background-color: #f59e0b;`;
      case 'queue':
        return `background-color: #8b5cf6;`;
      case 'job':
        return `background-color: #10b981;`;
      case 'blueprint':
        return `background-color: #3b82f6;`;
      default:
        return `background-color: ${props.theme.colors.textSecondary};`;
    }
  }}
`;

const TabName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
`;

const ModifiedIndicator = styled.span`
  margin-left: 4px;
  color: #ef4444;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 2px;
  margin-left: 4px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  transform: translateY(1px);
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const getFileTypeIcon = (type: string): string => {
  switch (type) {
    case 'widget':
      return 'W';
    case 'component':
      return 'C';
    case 'image':
      return 'I';
    case 'icon':
      return 'IC';
    case 'database':
      return 'DB';
    case 'endpoint':
      return 'EP';
    case 'queue':
      return 'Q';
    case 'job':
      return 'J';
    case 'blueprint':
      return 'BP';
    default:
      return 'F';
  }
};

export const TabBar: React.FC = () => {
  const { state, dispatch } = useApp();
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [, setDragOverIndex] = useState<number | null>(null);

  const handleTabClick = async (fileId: string) => {
    const projectFile = state.project.files.find(f => f.id === fileId);
    if (projectFile) {
      const openFile = {
        id: projectFile.id,
        name: projectFile.name,
        type: projectFile.type,
        path: projectFile.path,
        isModified: false,
        content: projectFile.content,
      };
      dispatch({ type: 'OPEN_FILE', payload: openFile });
    } else {
      dispatch({ type: 'SET_ACTIVE_FILE', payload: fileId });
    }
  };

  const handleCloseTab = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    dispatch({ type: 'CLOSE_FILE', payload: fileId });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedTabIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedTabIndex !== null && draggedTabIndex !== dropIndex) {
      dispatch({ 
        type: 'REORDER_TABS', 
        payload: { fromIndex: draggedTabIndex, toIndex: dropIndex } 
      });
    }
    
    setDraggedTabIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedTabIndex(null);
    setDragOverIndex(null);
  };

  if (state.openFiles.length === 0) {
    return (
      <TabBarContainer>
        <TabsContainer>
        </TabsContainer>
        <ProjectName>
          {state.isProjectLoading ? <ProjectNameLoader /> : state.project.name}
        </ProjectName>
      </TabBarContainer>
    );
  }

  return (
    <TabBarContainer>
      <TabsContainer>
        {state.openFiles.map((file: OpenFile, index: number) => (
          <Tab
            key={file.id}
            isActive={file.id === state.activeFileId}
            isModified={file.isModified || false}
            isDragging={draggedTabIndex === index}
            draggable
            onClick={() => handleTabClick(file.id)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <TabIcon fileType={file.type}>
              {getFileTypeIcon(file.type)}
            </TabIcon>
            <TabName>{file.name}</TabName>
            {file.isModified && <ModifiedIndicator>*</ModifiedIndicator>}
            <CloseButton onClick={(e) => handleCloseTab(e, file.id)}>
              <span style={{ transform: 'translateY(-1px)' }}>×</span>
            </CloseButton>
          </Tab>
        ))}
      </TabsContainer>
      <ProjectName>
        {state.isProjectLoading ? <ProjectNameLoader /> : state.project.name}
      </ProjectName>
    </TabBarContainer>
  );
};