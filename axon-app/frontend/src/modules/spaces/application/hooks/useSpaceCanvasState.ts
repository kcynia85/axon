// frontend/src/modules/spaces/application/hooks/useSpaceCanvasState.ts

import { useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import { DEFAULT_INITIAL_NODES, DEFAULT_INITIAL_EDGES } from '../../domain/defaults';
import { SpaceCanvasStateConfiguration } from '../../domain/types';
import { useRef } from 'react';

export const useSpaceCanvasState = (initialCanvasConfiguration?: unknown): SpaceCanvasStateConfiguration => {
  const parsedCanvasConfiguration = initialCanvasConfiguration as { nodes?: Node[]; edges?: Edge[] } | undefined;
  const initialNodesForCanvas = parsedCanvasConfiguration?.nodes ?? [...DEFAULT_INITIAL_NODES];
  const initialEdgesForCanvas = parsedCanvasConfiguration?.edges ?? [...DEFAULT_INITIAL_EDGES];

  const [canvasNodes, setCanvasNodes] = useNodesState(initialNodesForCanvas);
  const [canvasEdges, setCanvasEdges] = useEdgesState(initialEdgesForCanvas);

  // REFS for latest state to prevent stale closures in async/debounced functions
  const latestNodesReference = useRef<Node[]>(initialNodesForCanvas);
  const latestEdgesReference = useRef<Edge[]>(initialEdgesForCanvas);

  // Atomic state + ref update wrappers
  const updateCanvasNodes = (updater: any) => {
    setCanvasNodes((currentNodes) => {
      const nextNodes = typeof updater === 'function' ? updater(currentNodes) : updater;
      latestNodesReference.current = nextNodes;
      return nextNodes;
    });
  };

  const updateCanvasEdges = (updater: any) => {
    setCanvasEdges((currentEdges) => {
      const nextEdges = typeof updater === 'function' ? updater(currentEdges) : updater;
      latestEdgesReference.current = nextEdges;
      return nextEdges;
    });
  };

  const onNodesChange = (changes: NodeChange[]) => {
    setCanvasNodes((currentNodes) => {
        const nextNodes = applyNodeChanges(changes, currentNodes);
        latestNodesReference.current = nextNodes;
        return nextNodes;
    });
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setCanvasEdges((currentEdges) => {
        const nextEdges = applyEdgeChanges(changes, currentEdges);
        latestEdgesReference.current = nextEdges;
        return nextEdges;
    });
  };

  // Derived state
  const currentlySelectedNode = canvasNodes.find((node) => node.selected) || null;

  return {
    canvasNodes,
    canvasEdges,
    updateCanvasNodes,
    updateCanvasEdges,
    handleCanvasNodesChange: onNodesChange,
    handleCanvasEdgesChange: onEdgesChange,
    currentlySelectedNode,
    latestNodesReference,
    latestEdgesReference
  };
};
