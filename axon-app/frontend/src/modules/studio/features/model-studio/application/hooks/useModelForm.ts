import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ModelFormData, ModelFormSchema } from "../../types/model-schema";

export const useModelForm = (initialData?: Partial<ModelFormData>) => {
	const form = useForm<ModelFormData>({
		resolver: zodResolver(ModelFormSchema),
		defaultValues: {
			provider_id: "",
			model_id: "",
			alias_name: "",
			reasoning_effort: "Medium",
			max_completion_tokens: 32000,
			temperature: 1,
			top_p: 1,
			custom_params: [],
			system_prompt: "",
			pricing_input: 0,
			pricing_output: 0,
		},
		values: initialData as ModelFormData,
		mode: "onChange",
	});

	return form;
};
