import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RouterFormData, RouterFormSchema } from "../../types/router-schema";

export const useRouterForm = (initialData?: Partial<RouterFormData>) => {
	const form = useForm<RouterFormData>({
		resolver: zodResolver(RouterFormSchema),
		defaultValues: {
			name: "",
			strategy: "fallback",
			priority_chain: [],
		} as any,
		values: initialData as RouterFormData,
		mode: "onChange",
	});

	return form;
};
