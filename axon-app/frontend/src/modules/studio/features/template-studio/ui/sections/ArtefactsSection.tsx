import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { ARTEFACT_PROPERTY_TYPES } from "../../types/template-studio.constants";

interface Props {
	onSyncDraft: () => void;
}

export const ArtefactsSection = ({ onSyncDraft }: Props) => {
	const { control } = useFormContext();

	return (
		<FormSection 
			id="artefacts" 
			number={4} 
			title="Artefacts"
			description="Define artefacts that should be produced or used during the process."
		>
			<div className="space-y-8">
				<FormField
					control={control}
					name="artefact_items"
					render={({ field }) => (
						<FormItemField>
							<FormPropertyTable
								items={field.value || []}
								onChange={(val) => {
									field.onChange(val);
									onSyncDraft();
								}}
								onBlur={onSyncDraft}
								typeOptions={ARTEFACT_PROPERTY_TYPES}
								addPlaceholder="Add Artefact (e.g. competitors_list)..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
