import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";

/**
 * AutomationDefinitionSection: Definition of the automation semantics.
 * Matching Agent Studio & Crew Studio pattern: Vertical layout with standard FormItemField.
 */
export const AutomationDefinitionSection = () => {
	const { control } = useFormContext<AutomationFormData>();

	return (
		<FormSection
		        id="definition"
		        number={1}
		        title="Definition"
		        description="Describe the purpose and semantics of this automation for AI discovery"
		        variant="island"
		>

			<div className="space-y-12">
				<FormField
					control={control}
					name="definition.name"
					render={({ field, fieldState }) => (
						<FormItemField 
							label="Automation Name" 
							error={fieldState.error?.message}
						>
							<FormTextField
								{...field}
								placeholder="e.g. Lead Extractor v2"
								className="bg-transparent border-zinc-800 focus:border-zinc-700 text-white"
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="definition.semanticDescription"
					render={({ field, fieldState }) => (
						<FormItemField 
							label="Opis semantyczny (dla AI)" 
							error={fieldState.error?.message}
						>
							<FormTextarea
								{...field}
								placeholder="e.g. This automation extracts leads from LinkedIn profiles and saves them to a CSV file..."
								className="min-h-[150px] leading-relaxed text-zinc-300 focus:text-white"
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="definition.keywords"
					render={({ field, fieldState }) => (
						<FormItemField 
							label="Keywords" 
							error={fieldState.error?.message}
						>
							<FormTagInput
								value={field.value}
								onChange={field.onChange}
								placeholder="Add keywords (e.g. scraping, linkedin, leads)..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
