// frontend/src/modules/spaces/domain/defaults.ts

import type { Node, Edge } from '@xyflow/react';

export const DEFAULT_INITIAL_NODES: readonly Node[] = [
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

export const DEFAULT_INITIAL_EDGES: readonly Edge[] = [
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
