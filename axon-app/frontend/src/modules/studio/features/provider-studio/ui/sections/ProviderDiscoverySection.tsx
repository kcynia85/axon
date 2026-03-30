import React from "react";
import { useFormContext } from "react-hook-form";
import { ProviderFormData } from "../../types/provider-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";

export const ProviderDiscoverySection = () => {
	const { register, formState: { errors } } = useFormContext<ProviderFormData>();

	return (
		<FormSection 
			id="discovery" 
			number={2} 
			title="Discovery & Mapping"
		>
			<div className="space-y-12 max-w-2xl">
				{/* Discovery Mapping */}
				<div className="space-y-8">
					<FormSubheading>Model Discovery (SSoT)</FormSubheading>
					
					<FormItemField 
						label="Ścieżka do listy modeli" 
						error={errors.discovery_json_path?.message}
						hint="Klucz w JSON, pod którym znajduje się tablica modeli (np. 'data' dla OpenAI, 'models' dla Google)."
					>
						<FormTextField 
							{...register("discovery_json_path")}
							placeholder="data"
						/>
					</FormItemField>

					<FormItemField 
						label="Klucz ID modelu" 
						error={errors.discovery_id_key?.message}
						hint="Unikalny identyfikator (np. 'id', 'name')."
					>
						<FormTextField 
							{...register("discovery_id_key")}
							placeholder="id"
						/>
					</FormItemField>

					<FormItemField 
						label="Klucz Nazwy modelu" 
						error={errors.discovery_name_key?.message}
						hint="Nazwa wyświetlana (np. 'name', 'displayName')."
					>
						<FormTextField 
							{...register("discovery_name_key")}
							placeholder="name"
						/>
					</FormItemField>

					<FormItemField 
						label="Klucz Context Window" 
						error={errors.discovery_context_key?.message}
						hint="Limit tokenów (np. 'context_length', 'inputTokenLimit')."
					>
						<FormTextField 
							{...register("discovery_context_key")}
							placeholder="context_length"
						/>
					</FormItemField>
				</div>

				{/* Inference Response Mapping */}
				<div className="space-y-8 pt-10 border-t border-zinc-900">
					<FormSubheading>Inference Mapping</FormSubheading>
					
					<FormItemField 
						label="Ścieżka do treści odpowiedzi" 
						error={errors.response_content_path?.message}
						hint="Kropkowa notacja ścieżki do tekstu (np. 'choices.0.message.content' dla OpenAI, 'content.0.text' dla Anthropic)."
					>
						<FormTextField 
							{...register("response_content_path")}
							placeholder="choices.0.message.content"
						/>
					</FormItemField>

					<FormItemField 
						label="Ścieżka do błędu" 
						error={errors.response_error_path?.message}
						hint="Skąd Axon ma pobrać opis błędu w przypadku niepowodzenia (np. 'error.message')."
					>
						<FormTextField 
							{...register("response_error_path")}
							placeholder="error.message"
						/>
					</FormItemField>
				</div>
			</div>
		</FormSection>
	);
};
