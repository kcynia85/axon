// frontend/src/modules/spaces/domain/defaults.ts

import { DomainNode, DomainEdge, TemplateContext, TemplateArtefact } from './types';

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

export const mapAgentWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const dataInterface = transferData.data_interface as Record<string, any> | undefined;
  const contextRequirements = (dataInterface?.context || []).map((c: any) => ({
      id: c.id || Math.random().toString(), label: c.name || c.label, expectedType: c.field_type || 'any'
  }));

  return {
    progress: 0,
    requires_consultation: true,
    requires_alignment: true,
    requires_critique: true,
    consultation_questions: [
      { id: 'q1', question: `What is the main goal for ${transferData.agent_name || 'this agent'}?` }
    ],
    context_requirements: contextRequirements,
    alignment_summary: transferData.agent_goal || '',
    metrics: { tokens: 0, cost: 0, duration: '0s' },
    plan_steps: [
      { id: '1', label: 'Analyze context', status: 'pending' },
      { id: '2', label: 'Execute main task', status: 'pending' }
    ]
  };
};

export const mapCrewWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const dataInterface = transferData.data_interface as Record<string, any> | undefined;
  const contextRequirements = (dataInterface?.context || []).map((c: any) => ({
      id: c.id || Math.random().toString(), label: c.name || c.label, expectedType: c.field_type || 'any'
  }));
  const artefacts = (dataInterface?.artefacts || []).map((a: any) => ({
      id: a.id || Math.random().toString(), label: a.name || a.label, status: 'in_review'
  }));
  
  return {
    process_type: (transferData.crew_process_type as string)?.toLowerCase() || 'sequential',
    manager_title: transferData.owner_agent_id ? 'Crew Manager' : undefined,
    roles: (transferData.agent_member_ids as string[])?.map((id, i) => `Agent Node ${i+1}`) || [],
    tasks: [],
    shared_memory: [],
    context_requirements: contextRequirements,
    artefacts: artefacts,
    metrics: { duration: '0s', tokens: 0 }
  };
};

export const mapServiceWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const dataInterface = transferData.data_interface as Record<string, any> | undefined;
  const contexts = (dataInterface?.context || []).map((c: any) => ({
      id: c.id || Math.random().toString(), label: c.name || c.label, expectedType: c.field_type || 'any'
  }));
  const artefacts = (dataInterface?.artefacts || []).map((a: any) => ({
      id: a.id || Math.random().toString(), label: a.name || a.label, status: 'in_review', isOutput: true
  }));
  
  const rawCapabilities = (transferData.capabilities as any[]) || [];

  return {
    actionName: transferData.service_name || 'Execute Service',
    status: 'pending',
    capabilities: rawCapabilities.map(c => c.name || c),
    contexts,
    artefacts
  };
};

export const mapAutomationWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const dataInterface = transferData.data_interface as Record<string, any> | undefined;
  const contexts = (dataInterface?.context || []).map((c: any) => ({
      id: c.id || Math.random().toString(), label: c.name || c.label, expectedType: c.field_type || 'any'
  }));
  const artefacts = (dataInterface?.artefacts || []).map((a: any) => ({
      id: a.id || Math.random().toString(), label: a.name || a.label, status: 'in_review', isOutput: true
  }));

  return {
    state: 'idle',
    contexts,
    artefacts
  };
};

export const DEFAULT_INITIAL_NODES: readonly DomainNode[] = [];

export const DEFAULT_INITIAL_EDGES: readonly DomainEdge[] = [];

