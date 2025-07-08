import { BaseEdge, type EdgeProps } from '@xyflow/react';

export interface CustomEdgeData {
  isExecution?: boolean;
}

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const distance = Math.abs(targetX - sourceX);
  const minCurve = 60;
  const maxCurve = 250;
  const minDistance = 100;
  const maxDistance = 800;
  
  const normalizedDistance = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)));
  const curveStrength = minCurve + (maxCurve - minCurve) * normalizedDistance;
  
  const sourceControlX = sourceX + curveStrength;
  const sourceControlY = sourceY;
  const targetControlX = targetX - curveStrength;
  const targetControlY = targetY;
  
  const edgePath = `M ${sourceX} ${sourceY} C ${sourceControlX} ${sourceControlY} ${targetControlX} ${targetControlY} ${targetX} ${targetY}`;

  const edgeStyle = {
    strokeWidth: 2,
    stroke: selected ? '#ff7700' : '#ffffff',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...(style || {}),
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
      />
    </>
  );
}
