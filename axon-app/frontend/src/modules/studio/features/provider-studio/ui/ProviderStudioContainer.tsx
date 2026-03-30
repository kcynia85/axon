"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ProviderStudio } from "./ProviderStudio";
import { ProviderFormData } from "../types/provider-schema";
import { useCreateLLMProvider, useUpdateLLMProvider } from "@/modules/settings/application/useLLMProviders";

interface Props {
	providerId?: string;
	initialData?: Partial<ProviderFormData>;
}

/**
 * ProviderStudioContainer: Intelligent client container that connects
 * form view with Server Actions and navigation.
 */
export const ProviderStudioContainer = ({ 
	providerId, 
	initialData 
}: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const { mutateAsync: createProvider } = useCreateLLMProvider();
	const { mutateAsync: updateProvider } = useUpdateLLMProvider();

	const handleSave = async (data: ProviderFormData) => {
		startTransition(async () => {
			try {
				console.log("Saving provider data:", data);

				const providerPayload: any = {
					provider_name: data.display_name,
					provider_technical_id: data.provider_id,
					provider_type: data.provider_type,
					provider_api_key: (data as any).api_key || null,
					provider_api_key_required: !!(data as any).api_key,
					provider_api_endpoint: data.base_url || null,

					// Core Agnostic Configuration
					protocol: data.protocol,
					custom_headers: data.custom_headers,

					// SSoT Fields (Discovery & Auth)
					auth_header_name: data.auth_header_name,
					auth_header_prefix: data.auth_header_prefix,
					api_key_placement: data.api_key_placement,
					discovery_json_path: data.discovery_json_path,
					discovery_id_key: data.discovery_id_key,
					discovery_name_key: data.discovery_name_key,
					discovery_context_key: data.discovery_context_key,

					// Response Mapping
					response_content_path: data.response_content_path,
					response_error_path: data.response_error_path,

					// Legacy/Custom Config
					provider_custom_config: {
						tokenization_strategy: (data as any).tokenization_strategy,
						tokenization_fallback: (data as any).tokenization_fallback,
						billing_model: (data as any).billing_model
					}
				};

				if (providerId) {					await updateProvider({ id: providerId, data: providerPayload });
				} else {
					await createProvider(providerPayload);
				}
				
				toast.success(providerId ? "Dostawca zaktualizowany!" : "Dostawca utworzony pomyślnie!");
				
				router.push(`/settings/llms/providers`);
				router.refresh();
			} catch (error: any) {
				const errorMessage = error.message || "Wystąpił nieoczekiwany błąd";
				toast.error(`Błąd zapisu: ${errorMessage}`);
			}
		});
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<ProviderStudio
				providerId={providerId}
				onSave={handleSave}
				onCancel={handleCancel}
				initialData={initialData}
				isSaving={isPending}
			/>
		</div>
	);
};
