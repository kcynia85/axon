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
 * AutomationContextSection: Input parameters.
 * Removed redundant label as requested.
 */
export const AutomationContextSection = () => {
	const { control } = useFormContext<AutomationFormData>();

	return (
		<FormSection
				id="context"
				number={2}
				title="Kontekst Wejściowy"
				description="Zdefiniuj parametry wejściowe dla tej automatyzacji"
				variant="island"
		>

			<div className="space-y-12">
				<FormField
					control={control}
					name="dataInterface.context"
					render={({ field, fieldState }) => (
						<FormItemField error={fieldState.error?.message}>
							<FormPropertyTable
								items={field.value as any}
								onChange={field.onChange}
								typeOptions={PROPERTY_TYPE_OPTIONS}
								namePlaceholder="e.g. profile_link"
								addPlaceholder="Add input parameter..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
