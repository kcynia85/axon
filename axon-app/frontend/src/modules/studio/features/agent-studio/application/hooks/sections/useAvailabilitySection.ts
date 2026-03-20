import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { AvailabilitySectionProps, AvailabilitySectionViewProps } from "../../../types/sections/availability.types";

export const useAvailabilitySection = ({ syncDraft }: AvailabilitySectionProps): AvailabilitySectionViewProps => {
	const form = useFormContext<CreateAgentFormData>();
	return {
		control: form.control,
		syncDraft,
	};
};
