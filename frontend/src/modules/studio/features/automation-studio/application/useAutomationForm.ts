import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	automationFormSchema,
	type AutomationFormData,
} from "../types/automation-schema";

/**
 * useAutomationForm: Encapsulates the automation studio form logic.
 * Adheres to "Zero useEffect" and DDD principles.
 */
export const useAutomationForm = (initialData?: Partial<AutomationFormData>) => {
	const form = useForm<AutomationFormData>({
		resolver: zodResolver(automationFormSchema) as any,
		defaultValues: {
			definition: {
				name: "",
				semanticDescription: "",
				keywords: [],
			},
			connection: {
				platform: "n8n",
				method: "POST",
				url: "",
				auth: {
					type: "header",
				},
			},
			dataInterface: {
				context: [],
				artefacts: [],
			},
			availability: [],
			...initialData,
		},
		mode: "onChange",
	});

	return { form };
};
