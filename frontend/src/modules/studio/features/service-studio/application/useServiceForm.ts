import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { ServiceStudioSchema, type ServiceStudioFormData } from "../types/service-schema";

export const useServiceForm = (initialData?: Partial<ServiceStudioFormData>) => {
	const form = useForm<ServiceStudioFormData>({
		resolver: zodResolver(ServiceStudioSchema),
		defaultValues: {
			name: initialData?.name ?? "",
			url: initialData?.url ?? "",
			business_context: initialData?.business_context ?? "",
			keywords: initialData?.keywords ?? [],
			categories: initialData?.categories ?? [],
			capabilities: initialData?.capabilities ?? [],
			availability: initialData?.availability ?? ["Global Availability"],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "capabilities",
	});

	return {
		form,
		capabilities: fields,
		addCapability: append,
		removeCapability: remove,
	};
};
