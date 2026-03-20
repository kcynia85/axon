import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { DataInterfaceSectionProps, DataInterfaceSectionViewProps } from "../../../types/sections/data-interface.types";

export const useDataInterfaceSection = ({ syncDraft }: DataInterfaceSectionProps): DataInterfaceSectionViewProps => {
	const form = useFormContext<CreateAgentFormData>();
	return {
		control: form.control,
		syncDraft,
	};
};
