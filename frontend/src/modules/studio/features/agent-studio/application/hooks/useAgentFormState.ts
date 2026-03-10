import { useFormContext, useWatch } from "react-hook-form";
import type { CreateAgentFormData } from "@/modules/agents/domain/agent.schema";
import type { AgentFormContextType } from "../../types/agent-studio.types";

export const useAgentFormState = (): AgentFormContextType => {
	const form = useFormContext<CreateAgentFormData>();
	if (!form) {
		throw new Error("useAgentFormState must be used within a FormProvider");
	}
	return form;
};

export const useAgentPosterState = (): Partial<CreateAgentFormData> => {
	const form = useFormContext<CreateAgentFormData>();
	if (!form) {
		throw new Error("useAgentPosterState must be used within a FormProvider");
	}

	return useWatch({ control: form.control });
};
