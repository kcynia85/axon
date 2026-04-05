import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmbeddingModelStudioSchema, type EmbeddingModelStudioValues } from "../../types/embedding-studio.types";
import { useEmbeddingModelDraft } from "./useEmbeddingModelDraft";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";

export const useEmbeddingStudio = (
	modelId?: string | null,
	initialData?: Partial<EmbeddingModelStudioValues>,
	onSave?: (data: EmbeddingModelStudioValues) => void,
) => {
	const { draft, saveDraft, clearDraft } = useEmbeddingModelDraft(modelId);

	const defaultValues = {
		provider_id: "",
		model_provider_name: "",
		model_id: "",
		model_vector_dimensions: 1536,
		model_max_context_tokens: 8191,
		model_cost_per_1m_tokens: 0.02,
		is_draft: false,
	};

	const form = useForm<EmbeddingModelStudioValues>({
		resolver: zodResolver(EmbeddingModelStudioSchema),
		values: (initialData as EmbeddingModelStudioValues) || draft || defaultValues,
	});

	const {
		activeSectionIdentifier: activeSection,
		setCanvasContainerReference,
		scrollToSectionIdentifier: scrollToSection,
	} = useStudioScrollSpy<string>(["identity", "technical", "economy"], "identity");

	const syncDraft = () => {
		saveDraft(form.getValues());
	};

	const handleFinalSave = async (data: EmbeddingModelStudioValues) => {
		if (onSave) {
			await onSave({ ...data, is_draft: false });
		}
		clearDraft();
	};

	const handleSubmit = form.handleSubmit(handleFinalSave);

	return {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		syncDraft,
		handleSubmit,
	};
};
