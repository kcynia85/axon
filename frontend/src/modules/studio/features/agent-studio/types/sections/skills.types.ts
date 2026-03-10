import type { Control } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export type SkillsSectionProps = {
	readonly syncDraft: () => void;
};

export type SkillsSectionViewProps = {
	readonly control: Control<CreateAgentFormData>;
	readonly syncDraft: () => void;
};
