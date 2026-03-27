import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { RouterLiveGraph } from "./graph/RouterLiveGraph";
import type { RouterFormData } from "../../types/router-schema";

export const RouterLivePoster = () => {
	const { control } = useFormContext<RouterFormData>();
	
	// Watch all form values to ensure the graph updates when any selection changes
	useWatch({ control });

	return (
		<div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
			<RouterLiveGraph />
		</div>
	);
};
