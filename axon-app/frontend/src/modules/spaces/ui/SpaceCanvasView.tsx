// frontend/src/modules/spaces/ui/SpaceCanvasView.tsx

"use client";

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReactFlow } from '@xyflow/react';
import { useAgents, useCreateAgent } from "@/modules/agents/infrastructure/useAgents";
import { useCrews, useCreateCrew } from "@/modules/workspaces/application/useCrews";
import { useCreateTemplate } from "@/modules/workspaces/application/useTemplates";
import { useCreateService } from "@/modules/workspaces/application/useServices";
import { useSpaceCanvasOrchestrator } from '../application/hooks/useSpaceCanvasOrchestrator';
import { SpaceCanvasPresentationView } from './pure/SpaceCanvasPresentationView';
import { useSpaceCanvasView } from './pure/useSpaceCanvasView';
import { SpaceCanvasViewProperties } from './types';
import { useSpaceQuery } from '../application/hooks';
import { useMetaAgent } from '../application/hooks/useMetaAgent';
import { useProjectDetailsQuery } from "@/modules/projects/application/hooks";
import { toast } from "sonner";
export const SpaceCanvasView = ({ initialConfiguration, workspaceId }: SpaceCanvasViewProperties) => {
  const orchestrator = useSpaceCanvasOrchestrator(workspaceId, initialConfiguration);
  const canvasViewProperties = useSpaceCanvasView({ ...orchestrator, workspaceId });
  const { data: spaceData } = useSpaceQuery(workspaceId);
  const { data: projectData } = useProjectDetailsQuery(spaceData?.projectId || "");
  const metaAgent = useMetaAgent(workspaceId, orchestrator.canvasNodes, projectData);
  const searchParams = useSearchParams();
  const { setCenter } = useReactFlow();
  
  const { data: agents = [] } = useAgents(workspaceId);
  const { data: crews = [] } = useCrews(workspaceId);

  // Mutations for real entity creation
  const { mutateAsync: createAgent } = useCreateAgent(workspaceId);
  const { mutateAsync: createCrew } = useCreateCrew(workspaceId);
  const { mutateAsync: createTemplate } = useCreateTemplate(workspaceId);
  const { mutateAsync: createService } = useCreateService(workspaceId);

  // Handle deep linking to specific nodes (e.g. from Project Studio artifacts)
  useEffect(() => {
    const focusNodeId = searchParams.get('focus_node');
    if (focusNodeId && orchestrator.canvasNodes.length > 0) {
        const node = orchestrator.canvasNodes.find(n => n.id === focusNodeId);
        if (node) {
            // 1. Select the node
            orchestrator.handleCanvasNodesChange([{
                id: focusNodeId,
                type: 'select',
                selected: true
            }]);

            // 2. Center the view on the node
            const x = node.position.x + (node.measured?.width ?? 200) / 2;
            const y = node.position.y + (node.measured?.height ?? 100) / 2;
            setCenter(x, y, { zoom: 1.2, duration: 800 });
        }
    }
  }, [searchParams, orchestrator.canvasNodes.length, setCenter]);

  const handleApproveDrafts = async (drafts: any[], connections: any[]) => {
      try {
          console.log("[MetaAgent] Starting approval of drafts:", drafts);

          // 0. Auto-generate drafts for missing members referenced in crews
          const memberNamesInCrews = new Set<string>();
          drafts.filter(d => d.entity === 'crew').forEach(crew => {
              const members = crew.agent_member_ids || crew.payload?.agent_member_ids || crew.payload?.members || [];
              members.forEach((m: string) => memberNamesInCrews.add(m));
          });
          
          const existingDraftNames = new Set(drafts.map(d => d.name));
          memberNamesInCrews.forEach(missingName => {
              if (!existingDraftNames.has(missingName)) {
                  console.log(`[MetaAgent] Auto-generating missing draft for member: ${missingName}`);
                  drafts.unshift({
                      entity: 'agent',
                      status: 'draft',
                      name: missingName,
                      description: `${missingName} (Auto-generated from Crew membership)`,
                      target_workspace: drafts.find(d => d.entity === 'crew')?.target_workspace || 'ws-discovery',
                      payload: {}
                  });
              }
          });

          const draftNameToNodeIdMap = new Map<string, string>();
          const draftNameToPersistedIdMap = new Map<string, string>();
          const persistedEntities: any[] = [];

          // 1. First Pass: Create all entities EXCEPT crews to get their UUIDs
          for (const draft of drafts) {
              if (draft.entity === 'crew') continue;

              const type = draft.entity;
              let persistedEntity: any = null;
              const p = draft.payload || {};
              const targetWorkspace = draft.target_workspace || "ws-discovery";

              console.log(`[MetaAgent] Creating ${type}: ${draft.name}`, p);

              switch (type) {
                  case 'agent':
                      persistedEntity = await createAgent({
                          agent_name: p.agent_name || draft.name,
                          agent_role_text: draft.agent_role_text || p.agent_role_text || draft.description,
                          agent_goal: p.agent_goal || draft.description,
                          agent_backstory: p.agent_backstory || "",
                          system_instruction: draft.system_instruction || p.system_instruction || "",
                          model_tier: p.model_tier || "TIER_2_EXPERT",
                          temperature: p.temperature ?? 0.7,
                          native_skills: Array.from(new Set(p.native_skills || [])),
                          tools: Array.from(new Set(p.tools || [])),
                          availability_workspace: [targetWorkspace],
                          ...p
                      });
                      break;
                  case 'template':
                      persistedEntity = await createTemplate({
                          template_name: p.template_name || draft.name,
                          template_description: p.template_description || draft.description,
                          template_markdown_content: p.template_markdown_content || "",
                          template_checklist_items: p.template_checklist_items || [],
                          template_inputs: p.template_inputs || [],
                          template_outputs: p.template_outputs || [],
                          availability_workspace: [targetWorkspace],
                          ...p
                      } as any);
                      break;
                  case 'service':
                      persistedEntity = await createService({
                          service_name: p.service_name || draft.name,
                          service_description: p.service_description || draft.description,
                          service_category: p.service_category || "General",
                          service_url: p.service_url || "",
                          capabilities: p.capabilities || [],
                          availability_workspace: [targetWorkspace],
                          ...p
                      } as any);
                      break;
              }

              if (persistedEntity?.id) {
                  draftNameToPersistedIdMap.set(draft.name, persistedEntity.id);
                  // Also set common variations for better matching
                  draftNameToPersistedIdMap.set(p.agent_name || draft.name, persistedEntity.id);
                  
                  const finalName = persistedEntity.agent_name || persistedEntity.template_name || persistedEntity.service_name || draft.name;
                  const finalDescription = persistedEntity.agent_role_text || persistedEntity.template_description || persistedEntity.service_description || draft.description;

                  persistedEntities.push({
                      draftName: draft.name,
                      type,
                      workspaceId: targetWorkspace,
                      data: {
                          ...persistedEntity,
                          label: finalName,
                          name: finalName,
                          description: finalDescription,
                          is_persisted: true,
                          artefacts: p.artefacts || persistedEntity.artefacts || [],
                          context_requirements: p.context_requirements || persistedEntity.context_requirements || []
                      }
                  });
              }
          }

          // 2. Second Pass: Create crews using the mapped UUIDs for agents
          console.log("[MetaAgent] Persisted ID Map for members:", Object.fromEntries(draftNameToPersistedIdMap));
          
          for (const draft of drafts) {
              if (draft.entity !== 'crew') continue;

              const p = draft.payload || {};
              const targetWorkspace = draft.target_workspace || "ws-discovery";
              
              // Meta-Agent sometimes uses 'members' instead of 'agent_member_ids' or just names in payload
              const rawMembers = draft.agent_member_ids || p.agent_member_ids || p.members || [];
              console.log(`[MetaAgent] Resolving members for ${draft.name} from raw data:`, rawMembers);

              // Map names to persisted UUIDs with enhanced fuzzy matching
              const resolvedMemberIds = rawMembers.map((nameOrId: string) => {
                  const resolved = draftNameToPersistedIdMap.get(nameOrId);
                  if (resolved) return resolved;

                  // Super-Fuzzy Match: Remove special chars and check inclusion
                  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
                  const searchClean = clean(nameOrId);
                  
                  for (const [dName, id] of draftNameToPersistedIdMap.entries()) {
                      const dClean = clean(dName);
                      if (dClean === searchClean || dClean.includes(searchClean) || searchClean.includes(dClean)) {
                          console.log(`[MetaAgent] Super-Fuzzy matched ${nameOrId} -> ${dName} (${id})`);
                          return id;
                      }
                  }

                  return nameOrId;
              }).filter((id: string) => {
                  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
                  return isUuid;
              });

              console.log(`[MetaAgent] Final member UUIDs for ${draft.name}:`, resolvedMemberIds);

              // CLEAN PAYLOAD: Remove raw names/IDs before spread to prevent overwriting our resolved UUIDs
              const cleanPayload = { ...p };
              delete cleanPayload.agent_member_ids;
              delete cleanPayload.members;

              const persistedEntity = await createCrew({
                  ...cleanPayload,
                  crew_name: p.crew_name || draft.name,
                  crew_description: p.crew_description || draft.description,
                  crew_process_type: draft.crew_process_type || p.crew_process_type || 'Sequential',
                  agent_member_ids: resolvedMemberIds,
                  data_interface: p.data_interface || { context: [], artefacts: [] },
                  availability_workspace: [targetWorkspace]
              });

              if (persistedEntity?.id) {
                  draftNameToPersistedIdMap.set(draft.name, persistedEntity.id);
                  
                  const finalName = persistedEntity.crew_name || draft.name;
                  const finalDescription = persistedEntity.crew_description || draft.description;

                  // HYDRATION: Manually populate resolved_members for immediate UI feedback on canvas
                  const hydratedMembers = resolvedMemberIds.map(id => {
                      const agentPE = persistedEntities.find(pe => pe.data.id === id);
                      return {
                          id,
                          role: agentPE?.data.agent_role_text || agentPE?.data.name || "Agent",
                          visualUrl: agentPE?.data.agent_visual_url || agentPE?.data.visualUrl
                      };
                  });

                  persistedEntities.push({
                      draftName: draft.name,
                      type: 'crew',
                      workspaceId: targetWorkspace,
                      data: {
                          ...persistedEntity,
                          label: finalName,
                          name: finalName,
                          description: finalDescription,
                          is_persisted: true,
                          resolved_members: hydratedMembers, // Crucial for the Team list
                          artefacts: p.artefacts || persistedEntity.artefacts || [],
                          context_requirements: p.context_requirements || persistedEntity.context_requirements || []
                      }
                  });
              }
          }

          // 3. Prepare entities for canvas
          const aggregatedAgentIds = new Set<string>();
          persistedEntities.forEach(pe => {
              if (pe.type === 'crew') {
                  const memberIds = pe.data.agent_member_ids || [];
                  memberIds.forEach((id: string) => aggregatedAgentIds.add(id));
              }
          });

          // Only add nodes that are NOT members of a crew
          const entitiesToAddToCanvas = persistedEntities.filter(pe => {
              if (pe.type === 'agent') {
                  return !aggregatedAgentIds.has(pe.data.id);
              }
              return true;
          });

          // Add to canvas
          const createdIds = orchestrator.addMultipleNodesToCanvas(
              entitiesToAddToCanvas.map(pe => ({ type: pe.type, data: pe.data, workspaceId: pe.workspaceId }))
          );

          entitiesToAddToCanvas.forEach((pe, index) => {
              draftNameToNodeIdMap.set(pe.draftName, createdIds[index]);
          });

          // 4. Create connections (Filtering Membership Edges)
          for (const conn of connections) {
              const sourceNodeId = draftNameToNodeIdMap.get(conn.source_draft_name);
              const targetNodeId = draftNameToNodeIdMap.get(conn.target_draft_name);

              if (sourceNodeId && targetNodeId) {
                  // Check if this connection is between a member and its crew (redundant)
                  const sourcePE = persistedEntities.find(pe => pe.draftName === conn.source_draft_name);
                  const targetPE = persistedEntities.find(pe => pe.draftName === conn.target_draft_name);
                  
                  const isSourceMemberOfTarget = sourcePE?.type === 'agent' && targetPE?.type === 'crew' && 
                                               (targetPE.data.agent_member_ids || []).includes(sourcePE.data.id);
                  const isTargetMemberOfSource = targetPE?.type === 'agent' && sourcePE?.type === 'crew' && 
                                               (sourcePE.data.agent_member_ids || []).includes(targetPE.data.id);

                  if (isSourceMemberOfTarget || isTargetMemberOfSource) {
                      console.log(`[MetaAgent] Skipping redundant edge between member and crew: ${conn.source_draft_name} <-> ${conn.target_draft_name}`);
                      continue;
                  }

                  orchestrator.handleNewConnectionCreated({
                      source: sourceNodeId,
                      target: targetNodeId,
                      sourceHandle: null,
                      targetHandle: null
                  });
              }
          }
          
          toast.success(`${drafts.length} entities created and flow established`);
          metaAgent.clearDraft();
          metaAgent.closePanel();
      } catch (error) {
          console.error("Failed to approve Meta-Agent flow drafts:", error);
          toast.error("Failed to create flow. Check console for details.");
      }
  };

  return (
    <SpaceCanvasPresentationView 
        {...orchestrator}
        workspaceId={workspaceId}
        canvasViewProperties={canvasViewProperties}
        spaceData={spaceData}
        isSaving={false}
        availableAgents={agents}
        availableCrews={crews}
        metaAgent={{
            ...metaAgent,
            onPropose: metaAgent.propose,
            onRejectDraft: metaAgent.clearDraft,
            onApproveDrafts: handleApproveDrafts,
            onNewChat: metaAgent.clearDraft,
            contextStats: metaAgent.contextStats,
            contextLabel: orchestrator.currentlySelectedNode 
                ? `${orchestrator.currentlySelectedNode.type}: ${orchestrator.currentlySelectedNode.data?.name || orchestrator.currentlySelectedNode.id}`
                : `Space Canvas`,
            hasProjectContext: !!spaceData?.projectId,
            hasNotionContext: !!projectData?.project_strategy_url
        }}
    />
  );
};
