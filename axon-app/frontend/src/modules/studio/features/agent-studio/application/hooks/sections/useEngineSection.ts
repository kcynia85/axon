import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { EngineSectionProps, EngineSectionViewProps } from "../../../types/sections/engine.types";

export const useEngineSection = ({ syncDraft }: EngineSectionProps): EngineSectionViewProps => {
	const form = useFormContext<CreateAgentFormData>();
	return {
		control: form.control,
		syncDraft,
	};
};
