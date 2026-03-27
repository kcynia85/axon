import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ProviderFormData } from "../../types/provider-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";

export const ProviderAuthSection = () => {
	const { register, control, formState: { errors } } = useFormContext<ProviderFormData>();
	const providerType = useWatch({ control, name: "provider_type" });

	return (
		<FormSection id="auth" number={1} title="Auth & Connection">
			<div className="space-y-12 max-w-2xl">
				<FormItemField 
					label="Nazwa wyświetlana" 
					error={errors.display_name?.message}
					hint="Przyjazna nazwa widoczna w systemie."
				>
					<FormTextField 
						{...register("display_name")}
						placeholder="np. OpenAI"
					/>
				</FormItemField>

				<FormItemField 
					label="Unikalne ID" 
					error={errors.provider_id?.message}
					hint="Techniczny identyfikator (małe litery, bez spacji)."
				>
					<FormTextField 
						{...register("provider_id")}
						placeholder="openai"
					/>
				</FormItemField>

				<FormItemField 
					label="Base URL (Endpoint)" 
					error={errors.base_url?.message}
					hint="Adres serwera API (musi być dostępny z poziomu backendu Axon)."
				>
					<FormTextField 
						{...register("base_url")}
						placeholder="https://api.openai.com/v1"
					/>
				</FormItemField>

				{(providerType === "cloud" || providerType === "meta") && (
					<FormItemField 
						label="Klucz API (Globalny)" 
						error={errors.api_key?.message}
						hint="Klucz API używany do wszystkich połączeń."
					>
						<FormTextField 
							{...register("api_key")}
							type="password"
							placeholder="sk-..."
						/>
					</FormItemField>
				)}

				{providerType === "meta" && (
					<div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-10 mt-12">
						<FormSubheading>Nagłówki Niestandardowe</FormSubheading>
						
						<FormItemField 
							label="HTTP-Referer" 
							error={(errors.custom_headers as any)?.http_referer?.message}
							hint="Wymagany przez niektórych dostawców (np. OpenRouter)."
						>
							<FormTextField 
								{...register("custom_headers.http_referer" as any)}
								placeholder="https://axon.app"
							/>
						</FormItemField>

						<FormItemField 
							label="X-Title" 
							error={(errors.custom_headers as any)?.x_title?.message}
							hint="Nazwa Twojej aplikacji widoczna w panelu dostawcy."
						>
							<FormTextField 
								{...register("custom_headers.x_title" as any)}
								placeholder="Axon Command Center"
							/>
						</FormItemField>
					</div>
				)}

				{providerType === "local" && (
					<FormItemField 
						label="Klucz API (Opcjonalny)" 
						error={errors.api_key?.message}
						hint="Pozostaw puste, jeśli Twoja lokalna instancja nie wymaga autoryzacji."
					>
						<FormTextField 
							{...register("api_key")}
							placeholder="Brak klucza (domyślnie)"
						/>
					</FormItemField>
				)}
			</div>
		</FormSection>
	);
};
