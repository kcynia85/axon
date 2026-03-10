import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { InterfaceSectionProps, InterfaceSectionViewProps } from "../../../types/sections/interface.types";

export const useInterfaceSection = ({ syncDraft }: InterfaceSectionProps): InterfaceSectionViewProps => {
	const form = useFormContext<CreateAgentFormData>();
	return {
		control: form.control,
		syncDraft,
	};
};
