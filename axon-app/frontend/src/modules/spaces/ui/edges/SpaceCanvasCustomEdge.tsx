// frontend/src/modules/spaces/ui/edges/SpaceCanvasCustomEdge.tsx

import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';

export const SpaceCanvasCustomEdge = ({
  id: edgeUniqueIdentifier,
  sourceX: horizontalCoordinateOfSourceNode,
  sourceY: verticalCoordinateOfSourceNode,
  targetX: horizontalCoordinateOfTargetNode,
  targetY: verticalCoordinateOfTargetNode,
  sourcePosition: connectionPositionOnSourceNode,
  targetPosition: connectionPositionOnTargetNode,
  style: edgeVisualStyleProperties = {},
  markerEnd: visualMarkerAtTheEndOfEdge,
}: EdgeProps) => {
  const { setEdges: updateCanvasEdges } = useReactFlow();
  
  const [
    visualPathDataForBezierCurve, 
    horizontalCoordinateForEdgeRemovalButton, 
    verticalCoordinateForEdgeRemovalButton
  ] = getBezierPath({
    sourceX: horizontalCoordinateOfSourceNode,
    sourceY: verticalCoordinateOfSourceNode,
    sourcePosition: connectionPositionOnSourceNode,
    targetX: horizontalCoordinateOfTargetNode,
    targetY: verticalCoordinateOfTargetNode,
    targetPosition: connectionPositionOnTargetNode,
  });

  const handleEdgeRemovalInteraction = () => {
    updateCanvasEdges((currentEdges) => 
        currentEdges.filter((edge) => edge.id !== edgeUniqueIdentifier)
    );
  };

  return (
    <>
      <BaseEdge 
        path={visualPathDataForBezierCurve} 
        markerEnd={visualMarkerAtTheEndOfEdge} 
        style={edgeVisualStyleProperties} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${horizontalCoordinateForEdgeRemovalButton}px,${verticalCoordinateForEdgeRemovalButton}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            zIndex: 1000,
          }}
          className="nodrag nopan"
        >
          <button
            className="w-4 h-4 bg-background border-2 border-default-400 rounded-full flex justify-center items-center text-xs text-default-400 hover:default-400 hover:text-default-200 hover:border-default-200 transition-all"
            onClick={handleEdgeRemovalInteraction}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

SpaceCanvasCustomEdge.displayName = "SpaceCanvasCustomEdge";
