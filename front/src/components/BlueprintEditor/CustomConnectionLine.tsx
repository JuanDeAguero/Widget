import { type ConnectionLineComponentProps } from '@xyflow/react';

export function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) {
  const distance = Math.abs(toX - fromX);
  const minCurve = 60;
  const maxCurve = 250;
  const minDistance = 100;
  const maxDistance = 800;
  
  const normalizedDistance = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)));
  const curveStrength = minCurve + (maxCurve - minCurve) * normalizedDistance;
  
  const sourceControlX = fromX + curveStrength;
  const sourceControlY = fromY;
  const targetControlX = toX - curveStrength;
  const targetControlY = toY;
  
  const edgePath = `M ${fromX} ${fromY} C ${sourceControlX} ${sourceControlY} ${targetControlX} ${targetControlY} ${toX} ${toY}`;

  return (
    <g>
      <path
        d={edgePath}
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}