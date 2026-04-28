import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";
import type { FormPropertyFieldType } from "@/shared/types/form/FormPropertyTable.types";

const PROPERTY_TYPE_OPTIONS: { readonly label: string; readonly value: FormPropertyFieldType }[] = [
	{ value: "string", label: "Text/String" },
	{ value: "number", label: "Number" },
	{ value: "boolean", label: "Boolean" },
	{ value: "json", label: "JSON" },
	{ value: "file", label: "File/URL" },
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
				number={3}
				title="Artefakty Wyjściowe"
				description="Zdefiniuj dane wyjściowe i rezultaty"
				variant="island"
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
