// frontend/src/modules/spaces/application/hooks/useSpaceCanvasState.ts

import { useNodesState, useEdgesState } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { DEFAULT_INITIAL_NODES, DEFAULT_INITIAL_EDGES } from '../../domain/defaults';
import { SpaceCanvasStateConfiguration } from '../../domain/types';

export const useSpaceCanvasState = (initialCanvasConfiguration?: unknown): SpaceCanvasStateConfiguration => {
  const parsedCanvasConfiguration = initialCanvasConfiguration as { nodes?: Node[]; edges?: Edge[] } | undefined;
  const initialNodesForCanvas = parsedCanvasConfiguration?.nodes ?? [...DEFAULT_INITIAL_NODES];
  const initialEdgesForCanvas = parsedCanvasConfiguration?.edges ?? [...DEFAULT_INITIAL_EDGES];

  const [canvasNodes, setCanvasNodes, handleCanvasNodesChange] = useNodesState(initialNodesForCanvas);
  const [canvasEdges, setCanvasEdges, handleCanvasEdgesChange] = useEdgesState(initialEdgesForCanvas);

  // Derived state - React Compiler handles optimization
  const currentlySelectedNode = canvasNodes.find((node) => node.selected) || null;

  return {
    canvasNodes,
    canvasEdges,
    updateCanvasNodes: setCanvasNodes,
    updateCanvasEdges: setCanvasEdges,
    handleCanvasNodesChange,
    handleCanvasEdgesChange,
    currentlySelectedNode,
  };
};
