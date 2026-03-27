import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProviderFormData, ProviderFormSchema } from "../../types/provider-schema";

export const useProviderForm = (initialData?: Partial<ProviderFormData>) => {
	const form = useForm<ProviderFormData>({
		resolver: zodResolver(ProviderFormSchema),
		defaultValues: {
			provider_type: "cloud", // Domyślny typ
			display_name: "",
			provider_id: "",
			base_url: "",
			api_key: "",
			tokenization_strategy: "o200k_base",
			...initialData,
		} as any,
		mode: "onChange",
	});

	return form;
};
