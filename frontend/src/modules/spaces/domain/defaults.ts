// frontend/src/modules/spaces/domain/defaults.ts

import type { Node, Edge } from '@xyflow/react';
import type { TemplateContext, TemplateArtefact } from './types';

/**
 * Mapuje dane Template z Workspaces (template_inputs / template_outputs)
 * na format Context/Artefacts używany przez Template Node na canvasie.
 * Wywoływane przy tworzeniu nowego node'a przez drag & drop lub sidebar.
 */
export const mapTemplateWorkspaceConfigToNodeData = (
  transferData: Record<string, unknown>
): { contexts: TemplateContext[]; artefacts: TemplateArtefact[] } => {
  const rawInputs = transferData.template_inputs as Array<{ id: string; label: string; expectedType?: string }> | undefined;
  const rawOutputs = transferData.template_outputs as Array<{ id: string; label: string }> | undefined;

  const contexts: TemplateContext[] = (rawInputs ?? []).map((input) => ({
    id: input.id,
    label: input.label,
    expectedType: (input.expectedType as TemplateContext['expectedType']) ?? 'any',
  }));

  const artefacts: TemplateArtefact[] = (rawOutputs ?? []).map((output) => ({
    id: output.id,
    label: output.label,
    status: 'in_review' as const,
    isOutput: true,
  }));

  return { contexts, artefacts };
};

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
      state: 'missing_context',
      progress: 0,
      zoneColor: 'purple',
      context_requirements: [
        { id: '1', label: 'topic', expectedType: 'any' },
        { id: '2', label: 'target_audience', expectedType: 'any' },
        { id: '3', label: 'tone_of_voice', expectedType: 'any' }
      ]
    },
  },
  {
    id: 'agent-strategist',
    type: 'agent',
    position: { x: 50, y: 400 },
    parentId: 'zone-discovery',
    extent: 'parent',
    data: {
      label: 'UX Strategist',
      state: 'conversation',
      progress: 45,
      zoneColor: 'purple',
      pending_question: 'Czy strategia ma uwzględniać ekspansję na rynki azjatyckie w Q4?',
      context_requirements: [
        { id: '1', label: 'market_data', link: 'https://axon.ai/data/market_q3.json', expectedType: 'json' },
        { id: '2', label: 'competitor_analysis', link: 'node://Interview Synthesis/competitors_list.csv', expectedType: 'csv' }
      ]
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
      status: 'working',
      actions: [
        { id: 'a1', label: 'Zdefiniuj Pytania Badawcze', isCompleted: false, section: 'Cel Researchu (Checklist)' },
        { id: 'a2', label: 'Indetyfikacja grupy odbiorców', isCompleted: true, section: 'Cel Researchu (Checklist)' },
        { id: 'a3', label: 'Zidentyfikuj "white space" na rynku', isCompleted: false, section: 'Cel Researchu (Checklist)' },
        { id: 'a4', label: 'Wypełnij tabelę na podstawie danych (Nazwa firmy + Przewaga + ceny)', isCompleted: false, section: 'Profile Konkurencji' },
        { id: 'a5', label: 'Komunikacja', isCompleted: false, section: 'Wnioski Strategiczne' },
        { id: 'a6', label: 'Marketing', isCompleted: false, section: 'Wnioski Strategiczne' },
      ],
      contexts: [
        { id: 'c1', label: 'brand_guidelines', expectedType: 'json' },
        { id: 'c2', label: 'persona', expectedType: 'json' },
      ],
      artefacts: [
        { id: 'art1', label: 'competitors_list', status: 'in_progress' },
        { id: 'art2', label: 'benchmark_link', status: 'completed' },
      ],
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
      actions: [
        { id: 'p1', label: 'Market Research', isCompleted: true, section: 'Discovery' },
        { id: 'p2', label: 'User Personas', isCompleted: true, section: 'Discovery' },
        { id: 'p3', label: 'Feature List', isCompleted: true, section: 'Definition' },
        { id: 'p4', label: 'Technical Spec', isCompleted: true, section: 'Definition' },
        { id: 'p5', label: 'Timeline', isCompleted: false, section: 'Execution' },
        { id: 'p6', label: 'Resource Plan', isCompleted: false, section: 'Execution' },
        { id: 'p7', label: 'Risk Assessment', isCompleted: false, section: 'Governance' },
        { id: 'p8', label: 'Stakeholder Review', isCompleted: false, section: 'Governance' },
        { id: 'p9', label: 'Budgeting', isCompleted: false, section: 'Governance' },
        { id: 'p10', label: 'Final Approval', isCompleted: false, section: 'Governance' },
      ],
      contexts: [],
      artefacts: [],
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
  {
    id: 'service-elevenlabs',
    type: 'service',
    position: { x: 50, y: 400 },
    parentId: 'zone-design',
    extent: 'parent',
    data: {
      label: 'ElevenLabs',
      actionName: 'Generate Intro Voiceover',
      status: 'in_progress',
      capabilities: ['Text-to-Speech'],
      contexts: [
        { id: 'c1', label: 'File, URL etc.', expectedType: 'any' }
      ],
      artefacts: [
        { id: 'art1', label: 'Intro Voiceover_v1.mp3', status: 'in_review', isOutput: true }
      ],
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
      state: 'idle',
      contexts: [
        { id: 'ac1', label: 'github_repo_url', expectedType: 'any' },
        { id: 'ac2', label: 'deployment_target', expectedType: 'json' },
      ],
      artefacts: [],
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
