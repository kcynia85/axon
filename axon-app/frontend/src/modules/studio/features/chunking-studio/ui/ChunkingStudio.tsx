"use client";

import { useChunkingStudio } from "../application/hooks/useChunkingStudio";
import { ChunkingStudioView } from "./ChunkingStudioView";
import type { ChunkingStrategyStudioValues } from "../types/chunking-studio.types";

interface ChunkingStudioProps {
	readonly initialData?: any;
	readonly onSave: (data: ChunkingStrategyStudioValues) => void;
	readonly onExit: () => void;
	readonly isSaving?: boolean;
	readonly strategyId?: string | null;
}

export const ChunkingStudio = ({
	initialData,
	onSave,
	onExit,
	isSaving,
	strategyId,
}: ChunkingStudioProps) => {
	const {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		syncDraft,
		handleSubmit,
	} = useChunkingStudio(strategyId, initialData, onSave);

	return (
		<ChunkingStudioView
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
