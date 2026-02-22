import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    console.log(`Attempting to delete edge: ${id}`);
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            zIndex: 1000, // Increased z-index
          }}
          className="nodrag nopan"
        >
          <button
            className="w-4 h-4 bg-background border-2 border-default-400 rounded-full flex justify-center items-center text-xs text-default-400 hover:default-400 hover:text-default-200 hover:border-default-200 transition-all"
            onClick={onEdgeClick}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
