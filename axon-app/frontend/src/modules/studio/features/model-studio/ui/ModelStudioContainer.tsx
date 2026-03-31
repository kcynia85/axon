"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { ModelStudio } from "./ModelStudio";
import type { ModelFormData } from "../types/model-schema";
import { useCreateLLMModel, useUpdateLLMModel } from "@/modules/settings/application/useSettings";

interface Props {
	modelId?: string;
	initialData?: Partial<ModelFormData>;
}

export const ModelStudioContainer = ({ 
	modelId, 
	initialData 
}: Props) => {
	const routerNav = useRouter();
	const [isSaving, setIsSaving] = useState(false);

	const { mutateAsync: createModel } = useCreateLLMModel();
	const { mutateAsync: updateModel } = useUpdateLLMModel();

	const handleSave = async (data: ModelFormData) => {
		setIsSaving(true);
		try {
			// Map to API schema format
			const isReasoning = data.model_id.includes("o1") || data.model_id.includes("r1") || data.model_id.includes("405b");
			
			const payload = {
				provider_id: data.provider_id,
				model_id: data.model_id,
				model_display_name: data.alias_name || data.model_id,
				model_tier: "Tier1" as const, // default
				model_status: "Active",
				model_pricing_config: {
					input: data.pricing_input,
					output: data.pricing_output,
				},
				model_context_window: data.max_completion_tokens,
				model_capabilities_flags: ["Text Generation", ...(isReasoning ? ["Reasoning"] : [])], 
				model_supports_thinking: isReasoning, 
				model_reasoning_effort: data.reasoning_effort,
				model_system_prompt: data.system_prompt,
				model_custom_params: data.custom_params,
				llm_provider_id: data.provider_id, 
			};

			if (modelId) {
				await updateModel({ id: modelId, data: payload as any });
				toast.success("Model zaktualizowany pomyślnie!");
			} else {
				await createModel(payload as any);
				toast.success("Model utworzony pomyślnie!");
			}
			
			// Give a small delay for the toast to be seen
			await new Promise(resolve => setTimeout(resolve, 500));
			routerNav.push(`/settings/llms/models`);
			routerNav.refresh();
		} catch (error: unknown) {
			console.error("handleSave error:", error);
			const errorMessage = error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd";
			toast.error(`Błąd zapisu: ${errorMessage}`);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		routerNav.back();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<ModelStudio
				modelId={modelId}
				onSave={handleSave}
				onCancel={handleCancel}
				initialData={initialData}
				isSaving={isSaving}
			/>
		</div>
	);
};