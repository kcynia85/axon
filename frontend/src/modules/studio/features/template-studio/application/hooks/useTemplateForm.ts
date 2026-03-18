import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	TemplateStudioSchema,
	type TemplateStudioFormData,
} from "../../types/template-studio.types";

export const useTemplateForm = (initialData?: Partial<TemplateStudioFormData>) => {
	const form = useForm<TemplateStudioFormData>({
		resolver: zodResolver(TemplateStudioSchema) as any,
		defaultValues: {
			name: initialData?.name ?? "",
			description: initialData?.description ?? "",
			keywords: initialData?.keywords ?? [],
			markdown: initialData?.markdown ?? "",
			checklist_items: initialData?.checklist_items ?? [],
			context_items: initialData?.context_items ?? [],
			artefact_items: initialData?.artefact_items ?? [],
			availability_workspace: initialData?.availability_workspace ?? ["ws-discovery"],
		},
	});

	return { form };
};
