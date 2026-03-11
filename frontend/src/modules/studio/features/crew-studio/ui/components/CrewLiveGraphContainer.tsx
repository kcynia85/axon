import { useFormContext, useWatch } from "react-hook-form";
import { CrewLiveGraph } from "./graph/CrewLiveGraph";
import type { CrewStudioFormData } from "../../types/crew-schema";

interface Props {
	availableAgents: { id: string; name: string; subtitle?: string; avatarUrl?: string }[];
}

export const CrewLiveGraphContainer = ({ availableAgents }: Props) => {
	const { control } = useFormContext<CrewStudioFormData>();
	
	const type = useWatch({ control, name: "crew_process_type" });

	return (
		<div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
			{/* The Graph */}
			<CrewLiveGraph availableAgents={availableAgents} />
		</div>
	);
};
