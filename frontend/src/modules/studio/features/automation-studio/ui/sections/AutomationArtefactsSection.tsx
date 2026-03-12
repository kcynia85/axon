import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";

const PROPERTY_TYPE_OPTIONS = [
	{ value: "text", label: "Text" },
	{ value: "link", label: "Link/URL" },
	{ value: "number", label: "Number" },
	{ value: "boolean", label: "Boolean" },
	{ value: "date", label: "Date" },
];

/**
 * AutomationArtefactsSection: Output artefacts.
 * Removed redundant label as requested.
 */
export const AutomationArtefactsSection = () => {
	const { control } = useFormContext<AutomationFormData>();

	return (
		<FormSection
			id="artefacts"
			number={4}
			title="Artefacts"
			description="Define output artefacts and results"
		>
			<div className="space-y-12">
				<FormField
					control={control}
					name="dataInterface.artefacts"
					render={({ field, fieldState }) => (
						<FormItemField error={fieldState.error?.message}>
							<FormPropertyTable
								items={field.value as any}
								onChange={field.onChange}
								typeOptions={PROPERTY_TYPE_OPTIONS}
								namePlaceholder="e.g. leads_csv"
								addPlaceholder="Add output artefact..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
