import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";

const PROPERTY_TYPE_OPTIONS = [
	{ value: "text" as const, label: "Text" },
	{ value: "link" as const, label: "Link/URL" },
	{ value: "number" as const, label: "Number" },
	{ value: "boolean" as const, label: "Boolean" },
	{ value: "date" as const, label: "Date" },
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
			number={3}
			title="Context"
			description="Define input context parameters for this automation"
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
