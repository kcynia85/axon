// frontend/src/modules/spaces/domain/defaults.ts

import { DomainNode, DomainEdge, TemplateContext, TemplateArtefact, TemplateAction } from './types';

export type WorkspaceEntityTransferData = {
  readonly id: string;
  readonly type: string;
  readonly label: string;
  readonly zoneColor: string;
  readonly [key: string]: unknown;
};

interface RawProperty {
    readonly id?: string;
    readonly name?: string;
    readonly label?: string;
    readonly field_type?: string;
    readonly expectedType?: string;
}

/**
 * Mapuje dane z encji Workspaces na wewnętrzny format Canvasu dla poszczególnych Node'ów.
 * Przywraca "wnętrzności" UI (kroki, taski, metryki) bazując na faktycznej konfiguracji encji.
 */
export const mapTemplateWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const rawInputs = (transferData.template_inputs as Record<string, unknown>[]) || [];
  const rawOutputs = (transferData.template_outputs as Record<string, unknown>[]) || [];
  const rawMethodology = (transferData.methodology_flow as Record<string, unknown>[]) || [];
  const rawChecklist = (transferData.template_checklist_items as Record<string, unknown>[]) || [];

  const mappedActions: TemplateAction[] = [];

  if (rawMethodology.length > 0) {
    rawMethodology.forEach((m) => {
      mappedActions.push({
        id: (m.id as string) || Math.random().toString(),
        label: (m.label as string) || 'Step',
        description: m.description as string,
        psyche_level: m.psyche_level as string,
        isCompleted: false,
        section: 'Methodology'
      });
    });
  } else {
    rawChecklist.forEach((c) => {
        const subactions = c.subactions as Record<string, unknown>[] | undefined;
        if (subactions && subactions.length > 0) {
            subactions.forEach((sub) => {
                mappedActions.push({
                    id: sub.id as string,
                    label: sub.label as string,
                    isCompleted: !!sub.isCompleted,
                    section: c.label as string
                });
            });
        } else {
            mappedActions.push({
                id: c.id as string,
                label: c.label as string,
                isCompleted: !!c.isCompleted,
                section: 'General'
            });
        }
    });
  }

  return {
    contexts: rawInputs.map((i): TemplateContext => ({ 
        id: (i.id as string) || (i.name as string), 
        label: (i.label as string) || (i.name as string), 
        expectedType: (i.expectedType as TemplateContext['expectedType']) || 'any' 
    })),
    artefacts: rawOutputs.map((o): TemplateArtefact => ({ 
        id: (o.id as string) || (o.name as string), 
        label: (o.label as string) || (o.name as string), 
        status: 'in_review', 
        isOutput: true 
    })),
    actions: mappedActions,
    psyche_config: transferData.psyche_config as any,
    status: 'working'
  };
};

export const mapAgentWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const dataInterface = transferData.data_interface as Record<string, unknown> | undefined;
  const contextRequirements: TemplateContext[] = ((dataInterface?.context as RawProperty[]) || []).map((c) => ({
      id: c.id || c.name || Math.random().toString(), 
      label: c.name || c.label || "Parametr", 
      expectedType: (c.field_type as TemplateContext['expectedType']) || 'any'
  }));

  // Przywrócenie plan_steps dla animacji UI - mapujemy skille i instrukcje na kroki
  const skills = (transferData.native_skills as string[]) || [];
  const guardrails = (transferData.guardrails as Record<string, unknown>) || {};
  const instructions = (guardrails.instructions as string[]) || [];
  const constraints = (guardrails.constraints as string[]) || [];
  const allSteps = [...skills, ...instructions, ...constraints];
  
  const plan_steps = allSteps.length > 0 
    ? allSteps.map((s, i) => ({ id: `${i}`, label: s, status: 'pending' as const }))
    : [{ id: '1', label: 'Inicjalizacja profilu', status: 'pending' as const }, { id: '2', label: 'Realizacja celu', status: 'pending' as const }];

  return {
    progress: 0,
    requires_consultation: contextRequirements.length > 0,
    requires_alignment: !!transferData.agent_goal,
    requires_critique: true,
    consultation_questions: contextRequirements.map((c) => ({ id: `q-${c.id}`, question: `Podaj dane dla: ${c.label}` })),
    context_requirements: contextRequirements,
    alignment_summary: (transferData.agent_goal as string) || 'Gotowy do pracy.',
    metrics: { tokens: 0, cost: 0, duration: '0s' },
    plan_steps
  };
};

export const mapCrewWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const dataInterface = transferData.data_interface as Record<string, unknown> | undefined;
  const contextRequirements: TemplateContext[] = ((dataInterface?.context as RawProperty[]) || []).map((c) => ({
      id: c.id || c.name || Math.random().toString(), 
      label: c.name || c.label || "Parametr", 
      expectedType: (c.field_type as TemplateContext['expectedType']) || 'any'
  }));
  const artefacts: TemplateArtefact[] = ((dataInterface?.artefacts as RawProperty[]) || []).map((a) => ({
      id: a.id || a.name || Math.random().toString(), 
      label: a.name || a.label || "Wynik", 
      status: 'in_review'
  }));
  
  // Pobieramy rozwiązanych członków (role + visualUrl)
  const resolvedMembers = (transferData._resolved_members as Record<string, unknown>[]) || [];
  const roles = resolvedMembers.map(m => m.role as string);

  const resolvedManager = (transferData._resolved_manager as Record<string, unknown>) || null;

  // Sprawdzamy oba możliwe pola dla typu procesu
  const rawProcessType = (transferData.crew_process_type || transferData.process_type) as string;
  const process_type = (rawProcessType || 'sequential').toLowerCase() as 'sequential' | 'hierarchical' | 'parallel';

  return {
    process_type,
    manager_title: resolvedManager?.role as string | undefined,
    manager_visual_url: resolvedManager?.visualUrl as string | undefined,
    roles,
    tasks: resolvedMembers.map((member, i) => ({
        id: `t-${i}-${Math.random().toString(36).substring(2, 5)}`,
        label: `Zadanie dla: ${member.role}`,
        status: 'pending' as const,
        assignedAgentTitle: member.role as string,
        visualUrl: member.visualUrl as string | undefined
    })),
    shared_memory: [],
    context_requirements: contextRequirements,
    artefacts: artefacts,
    metrics: { duration: '0s', tokens: 0 }
  };
};

const ensureObject = (val: unknown): Record<string, unknown> => {
  if (!val) return {};
  if (typeof val === 'string') {
    try { return JSON.parse(val) as Record<string, unknown>; } catch { return {}; }
  }
  return val as Record<string, unknown>;
};

const mapSchemasToContextsAndArtefacts = (transferData: Record<string, unknown>, inputSchemaKey: string, outputSchemaKey: string) => {
  const dataInterface = transferData.data_interface as Record<string, unknown> | undefined;
  const inputSchema = ensureObject(transferData[inputSchemaKey]);
  const outputSchema = ensureObject(transferData[outputSchemaKey]);

  // Map inputs from schema keys if data_interface is missing
  const contexts: TemplateContext[] = dataInterface?.context && (dataInterface.context as RawProperty[]).length > 0
    ? (dataInterface.context as RawProperty[]).map((c) => ({ id: c.id || c.name || '', label: c.name || c.label || '', expectedType: (c.field_type as TemplateContext['expectedType']) || 'any' }))
    : Object.entries(inputSchema).map(([key, config]) => {
        const fieldType = (typeof config === 'object' && config !== null) ? (config as Record<string, unknown>).field_type : config;
        return { 
          id: key, 
          label: key, 
          expectedType: (fieldType as TemplateContext['expectedType']) || 'any' 
        };
      });

  // Map outputs from schema keys if data_interface is missing
  const artefacts: TemplateArtefact[] = dataInterface?.artefacts && (dataInterface.artefacts as RawProperty[]).length > 0
    ? (dataInterface.artefacts as RawProperty[]).map((a) => ({ id: a.id || a.name || '', label: a.name || a.label || '', status: 'in_review' as const, isOutput: true }))
    : Object.entries(outputSchema).map(([key]) => ({ 
        id: key, 
        label: key, 
        status: 'in_review' as const, 
        isOutput: true 
      }));
  
  return { contexts, artefacts };
};

export const mapServiceWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const { contexts, artefacts } = mapSchemasToContextsAndArtefacts(transferData, 'service_input_schema', 'service_output_schema');
  const capabilities = (transferData.capabilities || []) as (string | { name: string })[];
  
  return {
    actionName: (transferData.service_name as string) || 'Uruchom usługę',
    status: 'pending',
    capabilities: capabilities.map(c => typeof c === 'string' ? c : c.name),
    contexts,
    artefacts
  };
};

export const mapAutomationWorkspaceConfigToNodeData = (transferData: Record<string, unknown>) => {
  const { contexts, artefacts } = mapSchemasToContextsAndArtefacts(transferData, 'automation_input_schema', 'automation_output_schema');

  return {
    state: 'idle',
    description: (transferData.automation_description || transferData.description) as string,
    platform: (transferData.automation_platform || transferData.platform) as string || 'n8n',
    contexts,
    artefacts,
    actions: [] as TemplateAction[]
  };
};

export const DEFAULT_INITIAL_NODES: readonly DomainNode[] = [];
export const DEFAULT_INITIAL_EDGES: readonly DomainEdge[] = [];
