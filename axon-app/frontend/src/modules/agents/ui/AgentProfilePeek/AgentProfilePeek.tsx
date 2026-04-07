"use client";

import React from "react";
import { 
  Globe, 
  Database, 
  ShieldCheck, 
  CloudSun, 
  Zap, 
  Hash, 
  FileText,
  Code2,
  Boxes
} from "lucide-react";
import { KNOWLEDGE_HUB_NAMES, LLM_MODEL_NAMES, getWorkspaceLabel } from "@/modules/workspaces/domain/constants";
import { Agent } from "@/shared/domain/workspaces";
import { getAgentAvatarUrl } from "@/shared/lib/utils";
import { useInternalTools } from "@/modules/resources/application/useInternalTools";
import { AgentProfilePeekView } from "./AgentProfilePeekView";
import { AgentSkill, AgentField } from "./AgentProfilePeekView.types";

type AgentProfilePeekProps = {
  readonly agent: Agent | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: (agentId: string) => void;
}

/**
 * AgentProfilePeek: Intelligent container for displaying agent details in a SidePeek.
 * Standard: Container pattern, zero manual memoization.
 */
export const AgentProfilePeek = ({ agent, isOpen, onClose, onEdit, onDelete }: AgentProfilePeekProps) => {
  const { data: internalTools = [] } = useInternalTools();
  
  if (!agent) return null;

  const skillIcons: Record<string, React.ElementType | null> = {
    "web_search": Globe,
    "code_interpreter": Code2,
    "file_browser": Database,
    "web search": Globe,
    "file browser": Database,
    "finance": Database,
    "security": ShieldCheck,
    "weather": CloudSun,
    "utility": Zap,
    "math": Hash,
    "text": FileText
  };

  const getFields = (schema: unknown, interfaceItems: readonly { name: string; field_type: string }[] | undefined): AgentField[] => {
    if (interfaceItems && interfaceItems.length > 0) {
      return interfaceItems.map((interfaceItem) => ({ 
        name: interfaceItem.name, 
        type: String(interfaceItem.field_type) 
      }));
    }
    if (schema && typeof schema === 'object') {
      return Object.entries(schema as Record<string, string>).map(([name, fieldType]) => ({ 
        name, 
        type: fieldType 
      }));
    }
    return [];
  };

  const inputFields = getFields(agent.input_schema, agent.data_interface?.context);
  const outputFields = getFields(agent.output_schema, agent.data_interface?.artefacts);

  const customIdsFromFunctions = agent.custom_functions || [];
  const customIdsFromLegacy = agent.tools || [];
  const allCustomIds = Array.from(new Set([...customIdsFromFunctions, ...customIdsFromLegacy]));

  const allSkills: AgentSkill[] = [
    ...(agent.native_skills || []).map(skillId => ({ 
      id: skillId, 
      name: skillId.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      Icon: skillIcons[skillId.toLowerCase()] || undefined
    })),
    ...allCustomIds.map(customSkillId => {
      const toolItem = internalTools.find(tool => tool.tool_function_name === customSkillId || tool.id === customSkillId);
      return { 
        id: customSkillId, 
        name: toolItem?.tool_display_name || customSkillId, 
        isCustom: true,
        Icon: skillIcons[customSkillId.toLowerCase()] || Boxes
      };
    })
  ];

  const availabilityLabels = Array.from(new Set(
    (agent.availability_workspace || []).map(getWorkspaceLabel)
  )).filter(Boolean).sort();

  const keywords = (agent.agent_keywords || []).filter(keywordTag => keywordTag !== "python" && keywordTag !== "synced");
  const knowledgeHubs = (agent.knowledge_hub_ids || []).map(hubId => KNOWLEDGE_HUB_NAMES[hubId] ?? hubId);
  const avatarUrl = getAgentAvatarUrl(agent.id, agent.agent_visual_url);

  const handleEdit = () => {
    onEdit?.();
  };

  const handleDelete = (agentId: string) => {
    if (onDelete) {
      onDelete(agentId);
      onClose();
    }
  };

  return (
    <AgentProfilePeekView
      isOpen={isOpen}
      onClose={onClose}
      onEdit={handleEdit}
      onDelete={handleDelete}
      title={agent.agent_name || "Agent"}
      description={agent.agent_role_text || "AI Agent"}
      avatarUrl={avatarUrl}
      goal={agent.agent_goal}
      llmModelName={agent.llm_model_id ? (LLM_MODEL_NAMES[agent.llm_model_id] ?? agent.llm_model_id) : "GPT-4o"}
      keywords={keywords}
      inputFields={inputFields}
      outputFields={outputFields}
      knowledgeHubs={knowledgeHubs}
      allSkills={allSkills}
      availabilityLabels={availabilityLabels}
      agentId={agent.id}
    />
  );
};
