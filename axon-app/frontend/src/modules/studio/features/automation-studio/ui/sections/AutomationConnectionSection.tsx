import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useFormContext } from "react-hook-form";
import type { AutomationFormData } from "../../types/automation-schema";

const PLATFORM_OPTIONS = [
	{ id: "n8n", name: "n8n", subtitle: "Workflow automation tool" },
	{ id: "make", name: "Make", subtitle: "Formerly Integromat" },
	{ id: "zapier", name: "Zapier", subtitle: "Connecting apps" },
	{ id: "custom", name: "Custom Webhook", subtitle: "Direct HTTP endpoint" },
];

const METHOD_OPTIONS = [
	{ id: "GET", name: "GET" },
	{ id: "POST", name: "POST" },
	{ id: "PUT", name: "PUT" },
	{ id: "PATCH", name: "PATCH" },
	{ id: "DELETE", name: "DELETE" },
];

/**
 * AutomationConnectionSection: Configuration of the technical bridge.
 * Authorization fields moved to a separate section.
 */
export const AutomationConnectionSection = () => {
	const { control } = useFormContext<AutomationFormData>();

	return (
		<FormSection
		        id="connection"
		        number={2}
		        title="Connection Configuration"
		        description="Configure the technical bridge to the automation platform"
		        variant="island"
		>

			<div className="space-y-12">
				<FormField
					control={control}
					name="connection.platform"
					render={({ field, fieldState }) => (
						<FormItemField label="Platforma" error={fieldState.error?.message}>
							<FormSelect
								options={PLATFORM_OPTIONS}
								value={field.value}
								onChange={field.onChange}
								placeholder="Wybierz platformę..."
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="connection.method"
					render={({ field, fieldState }) => (
						<FormItemField label="Metoda" error={fieldState.error?.message}>
							<FormSelect
								options={METHOD_OPTIONS}
								value={field.value}
								onChange={field.onChange}
								placeholder="Wybierz metodę..."
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="connection.url"
					render={({ field, fieldState }) => (
						<FormItemField label="Adres URL (Webhook)" error={fieldState.error?.message}>
							<FormTextField
								{...field}
								placeholder="https://n8n.cloud/webhook/ocr-v1"
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};
