import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChunkingStrategyStudioSchema, type ChunkingStrategyStudioValues } from "../../types/chunking-studio.types";
import { useChunkingStrategyDraft } from "./useChunkingStrategyDraft";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { toast } from "sonner";

export const useChunkingStudio = (
	strategyId?: string | null,
	initialData?: Partial<ChunkingStrategyStudioValues>,
	onSave?: (data: ChunkingStrategyStudioValues) => void,
) => {
	const { draft, saveDraft, clearDraft } = useChunkingStrategyDraft(strategyId);

	const defaultValues = {
		strategy_name: "",
		strategy_chunking_method: "Recursive_Character",
		strategy_chunk_size: 1000,
		strategy_chunk_overlap: 200,
		strategy_chunk_boundaries: { separators: ["\\n\\n", "\\n", " "] },
		is_draft: false,
	};

	const form = useForm<ChunkingStrategyStudioValues>({
		resolver: zodResolver(ChunkingStrategyStudioSchema),
		values: (initialData as ChunkingStrategyStudioValues) || draft || defaultValues,
	});

	const {
		activeSectionIdentifier: activeSection,
		setCanvasContainerReference,
		scrollToSectionIdentifier: scrollToSection,
	} = useStudioScrollSpy<string>(["basic", "params", "separators"], "basic");

	const syncDraft = () => {
		saveDraft(form.getValues());
	};

	const handleFinalSave = async (data: ChunkingStrategyStudioValues) => {
		if (onSave) {
			await onSave({ ...data, is_draft: false });
		}
		clearDraft();
	};

	const handleInvalid = () => {
		toast.error("Formularz zawiera błędy. Sprawdź wymagane pola.");
	};

	const handleSubmit = form.handleSubmit(handleFinalSave, handleInvalid);

	return {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		syncDraft,
		handleSubmit,
	};
};
