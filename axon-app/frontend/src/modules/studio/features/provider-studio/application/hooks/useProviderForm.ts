import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { ProviderFormData, ProviderFormSchema } from "../../types/provider-schema";
import { useEffect } from "react";

export const useProviderForm = (initialData?: Partial<ProviderFormData>) => {
	const form = useForm<ProviderFormData>({
		resolver: zodResolver(ProviderFormSchema),
		defaultValues: {
			provider_type: "cloud",
			display_name: "",
			provider_id: "",
			base_url: "",
			api_key: "",
			protocol: "openai",
			tokenization_strategy: "o200k_base",
			custom_headers: [],
			
			// Discovery & Auth Configuration Defaults (SSoT)
			auth_header_name: "Authorization",
			auth_header_prefix: "Bearer ",
			api_key_placement: "header",
			discovery_json_path: "data",
			discovery_id_key: "id",
			discovery_name_key: "name",
			discovery_context_key: "context_length",

			// Response Mapping
			response_content_path: "choices.0.message.content",
			response_error_path: "error.message",
			
			...initialData,
		} as any,
		mode: "onChange",
	});

	const providerType = useWatch({ control: form.control, name: "provider_type" });

	useEffect(() => {
		if (providerType === "meta") {
			form.setValue("tokenization_strategy" as any, "auto_detect");
			if (!form.getValues("tokenization_fallback" as any)) {
				form.setValue("tokenization_fallback" as any, "cl100k_base");
			}
		} else if (providerType === "local") {
			if (!form.getValues("billing_model" as any)) {
				form.setValue("billing_model" as any, "zero_hardware");
			}
		}
	}, [providerType, form]);

	return form;
};
