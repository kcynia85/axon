import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
	onSyncDraft: () => void;
}

/**
 * CrewBasicInfoSection: The first section of the form collecting crew foundations.
 */
export const CrewBasicInfoSection = ({ onSyncDraft }: Props) => {
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
						onBlur={onSyncDraft}
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
						onBlur={onSyncDraft}
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
								onChange={(val) => {
									field.onChange(val);
									onSyncDraft();
								}}
								onBlur={onSyncDraft}
								placeholder="e.g. research, analysis, scraping..." 
							/>
						)}
					/>
				</div>
			</div>
		</FormSection>
	);
};
