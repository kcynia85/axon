// frontend/src/modules/spaces/application/hooks/useSpaceCanvasHistory.ts

import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

type CanvasState = {
  nodes: Node[];
  edges: Edge[];
};

const HISTORY_KEY = ['space-canvas-history'];

export const useSpaceCanvasHistory = (
  nodes: Node[],
  edges: Edge[],
  updateNodes: (nodes: Node[]) => void,
  updateEdges: (edges: Edge[]) => void
) => {
  const queryClient = useQueryClient();

  // We use TanStack Query cache to store the history stacks
  // initialData ensures we have a structure from the start
  const { data: history } = useQuery({
    queryKey: HISTORY_KEY,
    queryFn: () => ({ undoStack: [] as CanvasState[], redoStack: [] as CanvasState[] }),
    initialData: { undoStack: [], redoStack: [] },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const takeSnapshot = useCallback(() => {
    const snapshot: CanvasState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };

    queryClient.setQueryData(HISTORY_KEY, (prev: any) => ({
      undoStack: [...(prev?.undoStack || []), snapshot].slice(-50),
      redoStack: []
    }));
  }, [nodes, edges, queryClient]);

  const undo = useCallback(() => {
    const currentHistory = queryClient.getQueryData(HISTORY_KEY) as any;
    if (!currentHistory || currentHistory.undoStack.length === 0) return;

    const undoStack = currentHistory.undoStack;
    const redoStack = currentHistory.redoStack;
    
    const prevState = undoStack[undoStack.length - 1];
    const currentSnapshot: CanvasState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };

    queryClient.setQueryData(HISTORY_KEY, {
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, currentSnapshot]
    });

    updateNodes(prevState.nodes);
    updateEdges(prevState.edges);
  }, [nodes, edges, queryClient, updateNodes, updateEdges]);

  const redo = useCallback(() => {
    const currentHistory = queryClient.getQueryData(HISTORY_KEY) as any;
    if (!currentHistory || currentHistory.redoStack.length === 0) return;

    const undoStack = currentHistory.undoStack;
    const redoStack = currentHistory.redoStack;

    const nextState = redoStack[redoStack.length - 1];
    const currentSnapshot: CanvasState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };

    queryClient.setQueryData(HISTORY_KEY, {
      undoStack: [...undoStack, currentSnapshot],
      redoStack: redoStack.slice(0, -1)
    });

    updateNodes(nextState.nodes);
    updateEdges(nextState.edges);
  }, [nodes, edges, queryClient, updateNodes, updateEdges]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const isZ = event.key.toLowerCase() === 'z';
    const isY = event.key.toLowerCase() === 'y';
    const isMod = event.ctrlKey || event.metaKey;

    if (isMod && isZ) {
      event.preventDefault();
      undo();
    } else if (isMod && isY) {
      event.preventDefault();
      redo();
    }
  }, [undo, redo]);

  return { takeSnapshot, handleKeyDown };
};
