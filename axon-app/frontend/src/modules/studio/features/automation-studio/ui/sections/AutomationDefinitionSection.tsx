import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useFormContext } from "react-hook-form";
import { useAutomationProviders } from "@/modules/settings/application/useAutomationProviders";
import type { AutomationFormData } from "../../types/automation-schema";

/**
 * AutomationDefinitionSection: Definition of the automation semantics and connection trigger.
 */
export const AutomationDefinitionSection = () => {
	const { control, watch, setValue } = useFormContext<AutomationFormData>();
	const { data: providers = [] } = useAutomationProviders();

	const selectedProviderId = watch("connection.automationProviderId");

	const handleProviderChange = (value: string | string[]) => {
		const providerId = Array.isArray(value) ? value[0] : value;
		setValue("connection.automationProviderId", providerId === "manual" ? null : providerId);
		
		if (providerId && providerId !== "manual") {
			const provider = providers.find(p => p.id === providerId);
			if (provider) {
				setValue("connection.platform", provider.platform);
			}
		}
	};

	const providerOptions = [
		{ id: "manual", name: "Webhook (Manualna konfiguracja)" },
		...providers.map(p => ({ id: p.id, name: p.name }))
	];

	return (
		<FormSection
		        id="definition"
		        number={1}
		        title="Definicja i Wyzwalacz"
		        description="Określ cel automatyzacji oraz skonfiguruj punkt wejścia (Webhook)"
		        variant="island"
		>
			<div className="space-y-12">
				<FormField
					control={control}
					name="definition.name"
					render={({ field, fieldState }) => (
						<FormItemField 
							label="Nazwa Automatyzacji" 
							error={fieldState.error?.message}
						>
							<FormTextField
								{...field}
								placeholder="np. Lead Extractor v2"
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="connection.automationProviderId"
					render={({ field, fieldState }) => (
						<FormItemField label="Platforma" error={fieldState.error?.message}>
							<FormSelect
								options={providerOptions}
								value={field.value || "manual"}
								onChange={handleProviderChange}
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="connection.url"
					render={({ field, fieldState }) => (
						<FormItemField 
							label="Webhook URL" 
							error={fieldState.error?.message}
						>
							<FormTextField
								{...field}
								placeholder="https://n8n.your-domain.com/webhook/..."
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="connection.method"
					render={({ field, fieldState }) => (
						<FormItemField 
							label="Metoda HTTP" 
							error={fieldState.error?.message}
						>
							<FormSelect
								options={[
									{ id: "POST", name: "POST" },
									{ id: "GET", name: "GET" },
									{ id: "PUT", name: "PUT" },
									{ id: "PATCH", name: "PATCH" },
									{ id: "DELETE", name: "DELETE" },
								]}
								value={field.value}
								onChange={field.onChange}
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
								placeholder="np. Ta automatyzacja wyciąga leady z profilów LinkedIn i zapisuje je do pliku CSV..."
								className="min-h-[120px]"
							/>
						</FormItemField>
					)}
				/>

				<FormField
					control={control}
					name="definition.keywords"
					render={({ field, fieldState }) => (
						<FormItemField 
							label="Słowa kluczowe" 
							error={fieldState.error?.message}
						>
							<FormTagInput
								value={field.value}
								onChange={field.onChange}
								placeholder="Dodaj tagi (np. scraping, linkedin, leads)..."
							/>
						</FormItemField>
					)}
				/>
			</div>
		</FormSection>
	);
};

