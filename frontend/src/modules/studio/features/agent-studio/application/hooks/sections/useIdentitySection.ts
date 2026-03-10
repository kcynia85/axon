import { useFormContext } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { IdentitySectionProps, IdentitySectionViewProps } from "../../../types/sections/identity.types";

export const useIdentitySection = ({ syncDraft }: IdentitySectionProps): IdentitySectionViewProps => {
	const form = useFormContext<CreateAgentFormData>();
	return {
		control: form.control,
		syncDraft,
	};
};
