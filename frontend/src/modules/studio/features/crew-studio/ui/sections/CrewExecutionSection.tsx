import { FormSection } from "@/shared/ui/form/FormSection";
import { useFormContext, useWatch } from "react-hook-form";
import { HierarchicalExecution } from "./execution/HierarchicalExecution";
import { ParallelExecution } from "./execution/ParallelExecution";
import { SequentialExecution } from "./execution/SequentialExecution";
import type { CrewStudioFormData } from "../../types/crew-schema";

interface Props {
	availableAgents: { id: string; name: string; subtitle?: string }[];
}

/**
 * CrewExecutionSection: Dynamic form section changing its layout 
 * depending on the selected collaboration mode.
 */
export const CrewExecutionSection = ({ availableAgents }: Props) => {
	const { control } = useFormContext<CrewStudioFormData>();
	const currentType = useWatch({
		control,
		name: "crew_process_type",
	});

	// Choose appropriate execution view
	const renderExecution = () => {
		switch (currentType) {
			case "Hierarchical":
				return <HierarchicalExecution agents={availableAgents} />;
			case "Parallel":
				return <ParallelExecution agents={availableAgents} />;
			case "Sequential":
				return <SequentialExecution agents={availableAgents} />;
			default:
				return <HierarchicalExecution agents={availableAgents} />;
		}
	};

	// Dynamic section title for better UX
	const sectionTitle = currentType === "Sequential" 
		? "Define Sequence of Tasks" 
		: currentType === "Hierarchical" 
			? "Lead & Team Members" 
			: "Team Members (Agents)";

	return (
		<FormSection id="execution" number={3} title={sectionTitle}>
			<div className="max-w-4xl">
				{renderExecution()}
			</div>
		</FormSection>
	);
};
