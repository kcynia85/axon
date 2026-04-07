import { ReactNode, ElementType } from "react";

export type AgentSkill = {
  id: string;
  name: string;
  isCustom?: boolean;
  Icon?: ElementType;
};

export type AgentField = {
  name: string;
  type: string;
};

export type AgentProfilePeekViewProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit: () => void;
  readonly onDelete: (id: string) => void;
  readonly title: string;
  readonly description: string;
  readonly avatarUrl: string;
  readonly goal?: string;
  readonly llmModelName: string;
  readonly keywords: readonly string[];
  readonly inputFields: readonly AgentField[];
  readonly outputFields: readonly AgentField[];
  readonly knowledgeHubs: readonly string[];
  readonly allSkills: readonly AgentSkill[];
  readonly availabilityLabels: readonly string[];
  readonly agentId: string;
};
