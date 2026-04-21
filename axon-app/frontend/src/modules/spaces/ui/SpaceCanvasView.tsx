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
import { toast } from "sonner";

export const SpaceCanvasView = ({ initialConfiguration, workspaceId }: SpaceCanvasViewProperties) => {
  const orchestrator = useSpaceCanvasOrchestrator(workspaceId, initialConfiguration);
  const canvasViewProperties = useSpaceCanvasView({ ...orchestrator, workspaceId });
  const { data: spaceData } = useSpaceQuery(workspaceId);
  const searchParams = useSearchParams();
  const { setCenter } = useReactFlow();
  
  const { data: agents = [] } = useAgents(workspaceId);
  const { data: crews = [] } = useCrews(workspaceId);
  const metaAgent = useMetaAgent(workspaceId);

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
          const draftNameToNodeIdMap = new Map<string, string>();
          const nodesToAddToCanvas: Array<{ type: string; data: Record<string, unknown>; workspaceId: string }> = [];
          const persistedEntities: any[] = [];

          // 1. Persist all entities to the backend/workspace FIRST
          for (const draft of drafts) {
              const type = draft.entity;
              let persistedEntity: any = null;
              const p = draft.payload || {};
              const targetWorkspace = draft.target_workspace || "ws-discovery";

              switch (type) {
                  case 'agent':
                      persistedEntity = await createAgent({
                          agent_name: p.agent_name || draft.name,
                          agent_role_text: p.agent_role_text || draft.description,
                          agent_goal: p.agent_goal || draft.description,
                          agent_backstory: p.agent_backstory || "",
                          system_instruction: p.system_instruction || "",
                          model_tier: p.model_tier || "TIER_2_EXPERT",
                          temperature: p.temperature ?? 0.7,
                          native_skills: Array.from(new Set(p.native_skills || [])),
                          tools: Array.from(new Set(p.tools || [])),
                          availability_workspace: [targetWorkspace],
                          ...p
                      });
                      break;
                  case 'crew':
                      persistedEntity = await createCrew({
                          crew_name: p.crew_name || draft.name,
                          crew_description: p.crew_description || draft.description,
                          crew_process_type: p.crew_process_type || 'Sequential',
                          agent_member_ids: p.agent_member_ids || [],
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
                  default:
                      console.warn(`Attempted to persist unknown entity type: ${type}`);
              }

              if (persistedEntity?.id) {
                  const finalName = persistedEntity.agent_name || persistedEntity.crew_name || persistedEntity.template_name || persistedEntity.service_name || draft.name;
                  const finalDescription = persistedEntity.agent_role_text || persistedEntity.crew_description || persistedEntity.template_description || persistedEntity.service_description || draft.description;

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

          // 2. Add all nodes to canvas in a SINGLE BATCH to avoid race conditions and misparenting
          const createdIds = orchestrator.addMultipleNodesToCanvas(
              persistedEntities.map(pe => ({ type: pe.type, data: pe.data, workspaceId: pe.workspaceId }))
          );

          // Map draft names to newly created node IDs
          persistedEntities.forEach((pe, index) => {
              draftNameToNodeIdMap.set(pe.draftName, createdIds[index]);
          });

          // 3. Create connections/edges between the new nodes based on SAME-ZONE connections
          for (const conn of connections) {
              const sourceNodeId = draftNameToNodeIdMap.get(conn.source_draft_name);
              const targetNodeId = draftNameToNodeIdMap.get(conn.target_draft_name);

              if (sourceNodeId && targetNodeId) {
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
          toast.error("Failed to create flow. Please try again.");
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
            contextLabel: orchestrator.currentlySelectedNode 
                ? `${orchestrator.currentlySelectedNode.type}: ${orchestrator.currentlySelectedNode.data?.name || orchestrator.currentlySelectedNode.id}`
                : `Space Canvas`
        }}
    />
  );
};
