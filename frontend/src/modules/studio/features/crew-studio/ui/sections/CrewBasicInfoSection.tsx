import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { useFormContext, Controller } from "react-hook-form";

const DATA_TYPE_OPTIONS = [
	{ label: "Link", value: "Link" },
	{ label: "File", value: "File" },
	{ label: "String", value: "String" },
];

/**
 * CrewBasicInfoSection: The first section of the form collecting crew foundations.
 */
export const CrewBasicInfoSection = () => {
	const { register, control, formState: { errors } } = useFormContext();

	return (
		<FormSection id="basic-info" number={1} title="Basic Information">
			<div className="space-y-12">
				<FormItemField 
					label="Crew Name" 
					error={errors.crew_name?.message as string}
				>
					<FormTextField 
						{...register("crew_name")} 
						placeholder="e.g. Research Team" 
					/>
				</FormItemField>

				<FormItemField 
					label="Goal / Description"
					error={errors.crew_description?.message as string}
				>
					<FormTextarea 
						{...register("crew_description")} 
						placeholder="Describe the main task and purpose of this crew..." 
						className="min-h-[120px]"
					/>
				</FormItemField>

				<div className="space-y-6">
					<FormSubheading>Keywords</FormSubheading>
					<Controller
						control={control}
						name="crew_keywords"
						render={({ field }) => (
							<FormTagInput 
								value={field.value || []} 
								onChange={field.onChange}
								onBlur={field.onBlur}
								placeholder="e.g. research, analysis, scraping..." 
							/>
						)}
					/>
				</div>

				<div className="space-y-6">
					<FormSubheading>Context</FormSubheading>
					<Controller
						control={control}
						name="contexts"
						render={({ field }) => (
							<FormPropertyTable
								items={field.value || []}
								onChange={field.onChange}
								onBlur={field.onBlur}
								typeOptions={DATA_TYPE_OPTIONS}
								namePlaceholder="context name (e.g. competitors_list)"
								addPlaceholder="+ Add Context"
							/>
						)}
					/>
				</div>

				<div className="space-y-6">
					<FormSubheading>Artefact</FormSubheading>
					<Controller
						control={control}
						name="artefacts"
						render={({ field }) => (
							<FormPropertyTable
								items={field.value || []}
								onChange={field.onChange}
								onBlur={field.onBlur}
								typeOptions={DATA_TYPE_OPTIONS}
								namePlaceholder="artefact name (e.g. synthesis.md)"
								addPlaceholder="+ Add Artefact"
							/>
						)}
					/>
				</div>
			</div>
		</FormSection>
	);
};
