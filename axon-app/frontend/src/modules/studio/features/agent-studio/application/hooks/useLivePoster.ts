import { useMemo } from "react";
import { useLLMModels } from "@/modules/settings/application/useSettings";
import type { LivePosterProps, LivePosterViewProps } from "../../types/components.types";

export const useLivePoster = ({ data }: LivePosterProps): LivePosterViewProps => {
	const { data: models } = useLLMModels();
	
	const modelName = useMemo(() => {
		if (!data.llm_model_id) return "Select Model";
		const model = models?.find(m => m.id === data.llm_model_id);
		return model?.model_display_name || data.llm_model_id;
	}, [data.llm_model_id, models]);

	const inferenceCost = useMemo(() => {
		return data.llm_model_id === "gemini-2.0-flash" ? "$0.0001" : "$0.002";
	}, [data.llm_model_id]);

	return {
		modelName,
		inferenceCost,
		data,
	};
};
