import { FormSection } from "@/shared/ui/form/FormSection";
import { useFormContext, useWatch } from "react-hook-form";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import type { CrewStudioFormData } from "../../types/crew-schema";

const TYPES = [
	{ 
		id: "Hierarchical", 
		title: "Hierarchical", 
		description: "Managed structure. A crew where a lead/manager agent coordinates and synthesizes the work of other members." 
	},
	{ 
		id: "Parallel", 
		title: "Parallel", 
		description: "Standard team structure where agents work concurrently on the task independently." 
	},
	{ 
		id: "Sequential", 
		title: "Sequential", 
		description: "Strict sequence of tasks. Each step has its own description and assigned specialist." 
	},
] as const;

interface Props {
	onTypeChange: (type: CrewStudioFormData["crew_process_type"]) => void;
}

/**
 * CrewTypeSelectionSection: Allows the user to select the crew operating model.
 */
export const CrewTypeSelectionSection = ({ onTypeChange }: Props) => {
	const { control } = useFormContext<CrewStudioFormData>();
	const currentType = useWatch({
		control,
		name: "crew_process_type",
	});

	return (
		<FormSection id="collaboration-type" number={2} title="Collaboration Process Selection (Type)">
			<div className="grid grid-cols-1 gap-4">
				{TYPES.map((type) => (
					<FormRadio
						key={type.id}
						title={type.title}
						description={type.description}
						checked={currentType === type.id}
						onChange={() => {
							onTypeChange(type.id);
						}}
					/>
				))}
			</div>
		</FormSection>
	);
};
