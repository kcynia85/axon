import { FormSection } from "@/shared/ui/form/FormSection";
import { useFormContext, useWatch } from "react-hook-form";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import type { CrewStudioFormData } from "../../types/crew-schema";
import { CREW_TYPE_OPTIONS } from "../../types/sections.constants";

interface Props {
	onTypeChange: (type: CrewStudioFormData["crew_process_type"]) => void;
	onSyncDraft: () => void;
}

/**
 * CrewTypeSelectionSection: Choice of the main collaboration pattern.
 * This decision affects the dynamic layout of the next sections.
 */
export const CrewTypeSelectionSection = ({ onTypeChange, onSyncDraft }: Props) => {
	const { control } = useFormContext<CrewStudioFormData>();
	const currentType = useWatch({
		control,
		name: "crew_process_type",
	});

	return (
		<FormSection id="type-selection" number={2} title="Collaboration Pattern" variant="island">

			<div className="grid grid-cols-1 gap-6">
				{CREW_TYPE_OPTIONS.map((type) => (
					<FormRadio 
						key={type.id}
						title={type.title}
						description={type.description}
						checked={currentType === type.id}
						onChange={() => {
							onTypeChange(type.id);
							onSyncDraft();
						}}
					/>
				))}
			</div>
		</FormSection>
	);
};
