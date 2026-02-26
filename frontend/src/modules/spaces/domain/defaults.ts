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
    style: { width: 1200, height: 1000 },
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
      requires_consultation: true,
      requires_alignment: true,
      requires_critique: true,
      consultation_questions: [
        { id: 'q1', question: 'Jaki jest główny cel badania użytkowników?' },
        { id: 'q2', question: 'Czy masz preferowaną metodologię (np. wywiady, ankiety)?' },
        { id: 'q3', question: 'Na jakim etapie projektu obecnie jesteśmy?' }
      ],
      context_requirements: [
        { id: '1', label: 'topic', expectedType: 'any' },
        { id: '2', label: 'target_audience', expectedType: 'any' },
        { id: '3', label: 'tone_of_voice', expectedType: 'any' }
      ]
    },
  },
  {
    id: 'crew-hierarchical',
    type: 'crew',
    position: { x: 400, y: 50 },
    parentId: 'zone-discovery',
    extent: 'parent',
    data: {
      label: 'Research Team',
      state: 'missing_context',
      zoneColor: 'purple',
      process_type: 'hierarchical',
      manager_title: 'Social Media Manager',
      roles: ['Social Media Analyzer', 'Report Writer', 'Web Scraper'],
      tasks: [],
      shared_memory: [
        { id: 'f1', fact: 'Główni konkurenci stosują model subskrypcyjny.', sourceAgentTitle: 'Web Scraper', timestamp: '14:20' },
        { id: 'f2', fact: 'Użytkownicy narzekają na czas ładowania dashboardu.', sourceAgentTitle: 'Social Media Analyzer', timestamp: '14:25' }
      ],
      context_requirements: [
        { id: 'c1', label: 'brand_guidelines', link: 'docs.google.com/brand', expectedType: 'any' },
        { id: 'c2', label: 'target_audience', link: 'Enterprise B2B', expectedType: 'any' },
        { id: 'c3', label: 'budget_limit', link: '50k PLN', expectedType: 'any' },
      ],
      artefacts: [
        { id: 'a1', label: 'final_report', status: 'in_review' }
      ],
      metrics: { duration: '2 min 15s', tokens: 4200 }
    },
  },
  {
    id: 'crew-sequential',
    type: 'crew',
    position: { x: 50, y: 400 },
    parentId: 'zone-discovery',
    extent: 'parent',
    data: {
      label: 'Content Pipeline',
      state: 'missing_context',
      zoneColor: 'purple',
      process_type: 'sequential',
      roles: ['Web Researcher', 'Content Writer'],
      tasks: [],
      context_requirements: [
        { id: 'cr1', label: 'topic', expectedType: 'any' }
      ],
      artefacts: [
        { id: 'art1', label: 'article_draft.md', status: 'in_review' }
      ]
    },
  },
  {
    id: 'crew-marketing',
    type: 'crew',
    position: { x: 400, y: 400 },
    parentId: 'zone-discovery',
    extent: 'parent',
    data: {
      label: 'Marketing Content Crew',
      state: 'missing_context',
      zoneColor: 'purple',
      process_type: 'sequential',
      roles: ['SEO Specialist', 'Copywriter', 'Legal Reviewer'],
      tasks: [],
      shared_memory: [
        { id: 'mf1', fact: 'Primary keyword is "agentic workflows".', sourceAgentTitle: 'SEO Specialist', timestamp: '10:05' }
      ],
      context_requirements: [
        { id: 'mc1', label: 'topic', link: 'Agentic Workflows in 2026', expectedType: 'any' }
      ],
      artefacts: [
        { id: 'mart1', label: 'blog_post_v1.md', status: 'in_review' }
      ],
      metrics: { duration: '1 min 45s', tokens: 2800 }
    },
  },
  {
    id: 'crew-parallel',
    type: 'crew',
    position: { x: 800, y: 50 },
    parentId: 'zone-discovery',
    extent: 'parent',
    data: {
      label: 'Market Sentiment Team',
      state: 'missing_context',
      zoneColor: 'purple',
      process_type: 'parallel',
      roles: ['Report Writer', 'Web Scraper', 'Social Analyzer', 'News Bot'],
      tasks: [],
      context_requirements: [
        { id: 'pc1', label: 'prices', link: 'docs.google.com/prices', expectedType: 'any' },
        { id: 'pc2', label: 'brand_name', expectedType: 'any' },
        { id: 'pc3', label: 'rss_channel', expectedType: 'any' },
      ],
      artefacts: [
        { id: 'pa1', label: 'final_report.md', status: 'in_review' }
      ],
      metrics: { cost: 0.50, tokens: 8000 }
    },
  },

  // --- PRODUCT MANAGEMENT ZONE ---
  {
    id: 'zone-product',
    type: 'zone',
    position: { x: 1400, y: 100 },
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
    position: { x: 100, y: 1200 },
    data: {
      label: 'Design',
      type: 'design',
      color: 'pink',
    },
    style: { width: 1000, height: 800 },
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
    position: { x: 1400, y: 1200 },
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

  // --- GROWTH & MARKET ZONE ---
  {
    id: 'zone-growth',
    type: 'zone',
    position: { x: 100, y: 2200 },
    data: {
      label: 'Growth & Market',
      type: 'growth',
      color: 'yellow',
    },
    style: { width: 1000, height: 800 },
  },
];

export const DEFAULT_INITIAL_EDGES: readonly Edge[] = [
  // Discovery Internal
  { id: 'e-disc-1', source: 'agent-researcher', target: 'crew-hierarchical', type: 'CustomEdge', style: { stroke: '#666', strokeWidth: 2 } },
  { id: 'e-disc-2', source: 'crew-sequential', target: 'crew-parallel', type: 'CustomEdge', style: { stroke: '#666', strokeWidth: 2 } },

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

  // Cross-Zone: Design -> Delivery
  {
    id: 'e-zone-des-del',
    source: 'zone-design',
    target: 'zone-delivery',
    type: 'CustomEdge',
    style: { stroke: '#666', strokeWidth: 3 }
  },
];
