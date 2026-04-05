import { useState, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface CanvasSnapshot {
    nodes: Node[];
    edges: Edge[];
}

export const useSpaceCanvasHistory = (
  nodes: Node[],
  edges: Edge[],
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void,
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void
) => {
  const historyRef = useRef<CanvasSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const takeSnapshot = () => {
    const snapshot: CanvasSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    historyRef.current = historyRef.current.slice(0, historyIndex + 1);
    historyRef.current.push(snapshot);
    setHistoryIndex(historyRef.current.length - 1);
    
    // Limit history size
    if (historyRef.current.length > 50) {
        historyRef.current.shift();
        setHistoryIndex(prev => prev - 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const snapshot = historyRef.current[prevIndex];
      setNodes(JSON.parse(JSON.stringify(snapshot.nodes)));
      setEdges(JSON.parse(JSON.stringify(snapshot.edges)));
      setHistoryIndex(prevIndex);
    }
  };

  const redo = () => {
    if (historyIndex < historyRef.current.length - 1) {
      const nextIndex = historyIndex + 1;
      const snapshot = historyRef.current[nextIndex];
      setNodes(JSON.parse(JSON.stringify(snapshot.nodes)));
      setEdges(JSON.parse(JSON.stringify(snapshot.edges)));
      setHistoryIndex(nextIndex);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  };

  return { takeSnapshot, undo, redo, handleKeyDown };
};
