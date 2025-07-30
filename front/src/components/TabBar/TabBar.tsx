import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import type { OpenFile } from '../../index';
import {
  LoadingContainer,
  LoadingRectangle,
  TabBarContainer,
  TabsContainer,
  ProjectName,
  Tab,
  TabIcon,
  TabName,
  ModifiedIndicator,
  CloseButton
} from './TabBar.styles.ts';

export function ProjectNameLoader() {
  return (
    <LoadingContainer>
      <LoadingRectangle />
    </LoadingContainer>
  );
}

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