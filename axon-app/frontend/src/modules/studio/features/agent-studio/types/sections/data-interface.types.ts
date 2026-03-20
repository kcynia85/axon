import type { Control } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export type DataInterfaceSectionProps = {
	readonly syncDraft: () => void;
};

export type DataInterfaceSectionViewProps = {
	readonly control: Control<CreateAgentFormData>;
	readonly syncDraft: () => void;
};
