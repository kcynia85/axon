import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";

interface Props {
	onSyncDraft: () => void;
}

export const DefinitionSection = ({ onSyncDraft }: Props) => {
	const { control } = useFormContext();

	return (
		<FormSection 
		        id="definition" 
		        number={1} 
		        title="Definition"
		        description="Define the core purpose and metadata for this template."
		        variant="island"
		>

			<div className="space-y-12">
				<FormField
					control={control}
					name="name"
					render={({ field }) => (
						<FormItemField label="Name">
							<FormTextField
								{...field}
								onBlur={onSyncDraft}
								placeholder="e.g. Competitive Analysis"
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="goal"
					render={({ field }) => (
						<FormItemField label="Goal">
							<FormTextField
								{...field}
								onBlur={onSyncDraft}
								placeholder="Define the goal of this template..."
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="description"
					render={({ field }) => (
						<FormItemField label="Description">
							<FormTextarea
								{...field}
								onBlur={onSyncDraft}
								placeholder="Add a detailed description of the purpose..."
								rows={4}
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="keywords"
					render={({ field }) => (
						<FormItemField label="Keywords">
							<FormTagInput
								value={field.value || []}
								onChange={(val) => {
									field.onChange(val);
									onSyncDraft();
								}}
								onBlur={onSyncDraft}
								placeholder="Enter a tag and press Enter..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
