import { useCallback, useMemo, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import type { Connection, Node, Edge } from '@xyflow/react';

type UseCanvasLogicReturn = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (params: Connection) => void;
  isValidConnection: (connection: Connection) => boolean;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  selectedNode: Node | undefined;
  onNodeDataChange: (nodeId: string, newData: Record<string, unknown>) => void;
};

const defaultInitialNodes: Node[] = [
  // --- DISCOVERY ZONE ---
  {
    id: 'zone-discovery',
    type: 'zone',
    position: { x: 100, y: 100 },
    data: {
      label: 'Discovery',
      type: 'discovery',
      color: 'purple',
    },
    style: { width: 1000, height: 800 },
  },
  {
    id: 'agent-researcher',
    type: 'agent',
    position: { x: 50, y: 50 },
    parentId: 'zone-discovery',
    extent: 'parent',
    data: {
      label: 'User Researcher',
      state: 'working',
      progress: 45,
      zoneColor: 'purple',
    },
  },
  {
    id: 'template-interviews',
    type: 'template',
    position: { x: 400, y: 50 },
    parentId: 'zone-discovery',
    extent: 'parent',
    data: {
      label: 'Interview Synthesis',
      status: 'in_progress',
      completedActions: 2,
      totalActions: 5,
      zoneColor: 'purple',
    },
  },

  // --- PRODUCT MANAGEMENT ZONE ---
  {
    id: 'zone-product',
    type: 'zone',
    position: { x: 1200, y: 100 },
    data: {
      label: 'Product Management',
      type: 'product',
      color: 'blue',
    },
    style: { width: 1000, height: 800 },
  },
  {
    id: 'agent-analyst',
    type: 'agent',
    position: { x: 50, y: 50 },
    parentId: 'zone-product',
    extent: 'parent',
    data: {
      label: 'Product Analyst',
      state: 'done',
      progress: 100,
      zoneColor: 'blue',
    },
  },
  {
    id: 'template-prd',
    type: 'template',
    position: { x: 400, y: 400 },
    parentId: 'zone-product',
    extent: 'parent',
    data: {
      label: 'PRD v2.0',
      status: 'working',
      completedActions: 4,
      totalActions: 10,
      zoneColor: 'blue',
    },
  },

  // --- DESIGN ZONE ---
  {
    id: 'zone-design',
    type: 'zone',
    position: { x: 100, y: 1000 },
    data: {
      label: 'Design',
      type: 'design',
      color: 'pink',
    },
    style: { width: 1000, height: 800 },
  },
  {
    id: 'crew-design',
    type: 'crew',
    position: { x: 50, y: 50 },
    parentId: 'zone-design',
    extent: 'parent',
    data: {
      label: 'UI Design Crew',
      state: 'working',
      zoneColor: 'pink',
    },
  },
  {
    id: 'service-figma',
    type: 'service',
    position: { x: 400, y: 400 },
    parentId: 'zone-design',
    extent: 'parent',
    data: {
      label: 'Figma Sync',
      actionName: 'Export Assets',
      status: 'in_progress',
      zoneColor: 'pink',
    },
  },

  // --- DELIVERY ZONE ---
  {
    id: 'zone-delivery',
    type: 'zone',
    position: { x: 1200, y: 1000 },
    data: {
      label: 'Delivery',
      type: 'delivery',
      color: 'green',
    },
    style: { width: 1000, height: 800 },
  },
  {
    id: 'auto-ci',
    type: 'automation',
    position: { x: 50, y: 50 },
    parentId: 'zone-delivery',
    extent: 'parent',
    data: {
      label: 'CI/CD Pipeline',
      state: 'completed',
      artifactName: 'build_report.pdf',
      zoneColor: 'green',
    },
  },
];

const defaultInitialEdges: Edge[] = [
  // Discovery Internal
  { id: 'e-disc-1', source: 'agent-researcher', target: 'template-interviews', type: 'CustomEdge', style: { stroke: '#666', strokeWidth: 2 } },
  
  // Cross-Zone: Discovery -> Product
  { 
    id: 'e-zone-disc-prod', 
    source: 'zone-discovery', 
    target: 'zone-product', 
    type: 'CustomEdge', 
    style: { stroke: '#666', strokeWidth: 3 } 
  },

  // Product Internal
  { id: 'e-prod-1', source: 'agent-analyst', target: 'template-prd', type: 'CustomEdge', style: { stroke: '#666', strokeWidth: 2 } },

  // Cross-Zone: Product -> Design
  { 
    id: 'e-zone-prod-des', 
    source: 'zone-product', 
    target: 'zone-design', 
    type: 'CustomEdge', 
    style: { stroke: '#666', strokeWidth: 3 } 
  },

  // Design Internal
  { id: 'e-des-1', source: 'crew-design', target: 'service-figma', type: 'CustomEdge', style: { stroke: '#666', strokeWidth: 2 } },

  // Cross-Zone: Design -> Delivery
  { 
    id: 'e-zone-des-del', 
    source: 'zone-design', 
    target: 'zone-delivery', 
    type: 'CustomEdge', 
    style: { stroke: '#666', strokeWidth: 3 } 
  },
];

export const useCanvasLogic = (initialData?: unknown): UseCanvasLogicReturn => {
  // Use initialData if it has nodes, otherwise fallback to defaultInitialNodes
  const canvasData = initialData as { nodes?: Node[]; edges?: Edge[] } | undefined;
  const initialNodes = canvasData?.nodes || defaultInitialNodes;
  const initialEdges = canvasData?.edges || defaultInitialEdges;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      const isZoneConnection = sourceNode?.type === 'zone' && targetNode?.type === 'zone';
      const edgeStyle = { 
        stroke: '#666', 
        strokeWidth: isZoneConnection ? 3 : 2 
      };

      setEdges((prevEdges) => addEdge({ ...params, type: 'CustomEdge', style: edgeStyle }, prevEdges));
    },
    [nodes, setEdges],
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, _node: Node) => {
    // Selection handled by React Flow's onNodesChange
  }, []);

  const onPaneClick = useCallback(() => {
    // Deselection handled by React Flow's onNodesChange
  }, []);

  const selectedNode = useMemo(() => nodes.find((nodeItem) => nodeItem.selected), [nodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const dataString = event.dataTransfer.getData('application/axon-data');

      if (!type || !dataString) {
        return;
      }

      const data = JSON.parse(dataString) as Record<string, unknown>;

      const position = {
        x: event.clientX - 300,
        y: event.clientY - 100,
      };

      const newNode: Node = {
        id: `dndnode_${Math.random()}`,
        type,
        position,
        data: {
          ...data,
          state: 'missing_context',
        },
        style: type === 'zone' ? { width: 500, height: 400 } : undefined,
      };

      setNodes((prevNodes) => prevNodes.concat(newNode));
    },
    [setNodes],
  );

  const onNodeDataChange = useCallback((nodeId: string, newData: Record<string, unknown>) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node)),
    );
  }, [setNodes]);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const isSourceZone = sourceNode.type === 'zone';
      const isTargetZone = targetNode.type === 'zone';

      // 1. Zone to Zone is allowed
      if (isSourceZone && isTargetZone) return true;

      // 2. Zone to Entity (or vice versa) is NOT allowed
      if (isSourceZone !== isTargetZone) return false;

      // 3. Entity to Entity is allowed ONLY if they are in the same zone
      return sourceNode.parentId === targetNode.parentId;
    },
    [nodes],
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    onNodeClick,
    onPaneClick,
    onDragOver,
    onDrop,
    selectedNode,
    onNodeDataChange,
  };
};
