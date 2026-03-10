import type { Control } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export type AvailabilitySectionProps = {
	readonly syncDraft: () => void;
};

export type AvailabilitySectionViewProps = {
	readonly control: Control<CreateAgentFormData>;
	readonly syncDraft: () => void;
};
