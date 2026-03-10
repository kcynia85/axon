import type { Control } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export type CognitionSectionProps = {
	readonly syncDraft: () => void;
};

export type CognitionSectionViewProps = {
	readonly control: Control<CreateAgentFormData>;
	readonly syncDraft: () => void;
};
