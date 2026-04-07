import { useFormContext } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { FormField } from "@/shared/ui/ui/Form";
import type { ServiceStudioFormData } from "../../types/service-schema";
import { Link, Globe } from "lucide-react";

export const ServiceBasicInfoSection = () => {
	const { control } = useFormContext<ServiceStudioFormData>();
	
	return (
		<FormSection
		        id="basic-info"
		        number={1}
		        title="Basic Info"
		        description="Define the core identity and connection details for this external service."
		        variant="island"
		>

			<div className="space-y-12">
				<FormField
					control={control}
					name="name"
					render={({ field, fieldState }) => (
						<FormItemField label="Service Name" error={fieldState.error?.message}>
							<FormTextField 
								{...field}
								placeholder="e.g. ElevenLabs, OpenAI, SerpApi" 
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="url"
					render={({ field, fieldState }) => (
						<FormItemField label="Connection URL / API Root" error={fieldState.error?.message}>
							<FormTextField 
								{...field}
								placeholder="https://api.service.com/v1" 
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="business_context"
					render={({ field, fieldState }) => (
						<FormItemField label="Business Context" error={fieldState.error?.message}>
							<FormTextarea 
								{...field}
								placeholder="Explain why this service is being integrated and what value it adds to the workspace..."
								className="min-h-[150px]"
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="keywords"
					render={({ field, fieldState }) => (
						<FormItemField label="Keywords" error={fieldState.error?.message}>
							<FormTagInput 
								{...field}
								placeholder="Add keywords (e.g. scraping, speech, genai)..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
