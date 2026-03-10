import type { Control } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";

export type InterfaceSectionProps = {
	readonly syncDraft: () => void;
};

export type InterfaceSectionViewProps = {
	readonly control: Control<CreateAgentFormData>;
	readonly syncDraft: () => void;
};
