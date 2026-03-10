import { useMemo } from "react";
import { MODEL_NAMES } from "../../types/agent-studio.constants";
import type { LivePosterProps, LivePosterViewProps } from "../../types/components.types";

export const useLivePoster = ({ data }: LivePosterProps): LivePosterViewProps => {
	const modelName = useMemo(() => {
		return data.llm_model_id
			? MODEL_NAMES[data.llm_model_id] || data.llm_model_id
			: "Select Model";
	}, [data.llm_model_id]);

	const inferenceCost = useMemo(() => {
		return data.llm_model_id === "gemini-2.0-flash" ? "$0.0001" : "$0.002";
	}, [data.llm_model_id]);

	return {
		modelName,
		inferenceCost,
		data,
	};
};
