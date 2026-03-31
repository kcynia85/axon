import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import type { FormPropertyTableItem } from "@/shared/types/form/FormPropertyTable.types";
import { ARTEFACT_TYPES } from "../../types/agent-studio.constants";
import { useDataInterfaceSection } from "../../application/hooks/sections/useDataInterfaceSection";
import type { DataInterfaceSectionProps } from "../../types/sections/data-interface.types";

export type ArtefactsSectionProps = DataInterfaceSectionProps;

export const ArtefactsSection = (props: ArtefactsSectionProps) => {
	const { control, syncDraft } = useDataInterfaceSection(props);

	return (
		<FormSection id="ARTEFACTS" number={6} title="Artefacts" variant="island">
			<div className="space-y-4">
				<FormField
					control={control}
					name="data_interface.artefacts"
					render={({ field }) => (
						<FormItemField>
							<FormPropertyTable
								items={(field.value || []) as FormPropertyTableItem[]}
								onChange={(val) => {
									field.onChange(val);
									syncDraft();
								}}
								onBlur={syncDraft}
								namePlaceholder="e.g. final_report"
								addPlaceholder="Add artefact..."
								typeOptions={ARTEFACT_TYPES}
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
