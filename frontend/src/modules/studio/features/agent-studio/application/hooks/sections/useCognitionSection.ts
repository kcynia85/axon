import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { CognitionSectionProps, CognitionSectionViewProps } from "../../../types/sections/cognition.types";

export const useCognitionSection = ({ syncDraft }: CognitionSectionProps): CognitionSectionViewProps => {
	const form = useFormContext<CreateAgentFormData>();
	return {
		control: form.control,
		syncDraft,
	};
};
