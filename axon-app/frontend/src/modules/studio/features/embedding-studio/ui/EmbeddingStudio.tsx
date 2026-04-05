"use client";

import { useEmbeddingStudio } from "../application/hooks/useEmbeddingStudio";
import { EmbeddingStudioView } from "./EmbeddingStudioView";
import type { EmbeddingModelStudioValues } from "../types/embedding-studio.types";

interface EmbeddingStudioProps {
	readonly initialData?: any;
	readonly onSave: (data: EmbeddingModelStudioValues) => void;
	readonly onExit: () => void;
	readonly isSaving?: boolean;
	readonly modelId?: string | null;
}

export const EmbeddingStudio = ({
	initialData,
	onSave,
	onExit,
	isSaving,
	modelId,
}: EmbeddingStudioProps) => {
	const {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		syncDraft,
		handleSubmit,
	} = useEmbeddingStudio(modelId, initialData, onSave);

	return (
		<EmbeddingStudioView
			form={form}
			activeSection={activeSection}
			isSaving={isSaving}
			onSectionClick={scrollToSection}
			onExit={onExit}
			onSave={handleSubmit}
			onSyncDraft={syncDraft}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};
