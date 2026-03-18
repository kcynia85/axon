import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { CONTEXT_PROPERTY_TYPES } from "../../types/template-studio.constants";

interface Props {
	onSyncDraft: () => void;
}

export const ContextSection = ({ onSyncDraft }: Props) => {
	const { control } = useFormContext();

	return (
		<FormSection 
			id="context" 
			number={3} 
			title="Context"
			description="Define contextual information that this template requires to be effective."
		>
			<div className="space-y-8">
				<FormField
					control={control}
					name="context_items"
					render={({ field }) => (
						<FormItemField>
							<FormPropertyTable
								items={field.value || []}
								onChange={(val) => {
									field.onChange(val);
									onSyncDraft();
								}}
								onBlur={onSyncDraft}
								typeOptions={CONTEXT_PROPERTY_TYPES}
								addPlaceholder="Add Context (e.g. brand_guidelines)..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
