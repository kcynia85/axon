"use client";

import { useVectorStudio } from "../application/hooks/useVectorStudio";
import { VectorStudioView } from "./VectorStudioView";

interface VectorStudioProps {
	readonly initialData?: any;
	readonly onSave: (data: any) => void;
	readonly onExit: () => void;
	readonly isSaving?: boolean;
}

export const VectorStudio = ({
	initialData,
	onSave,
	onExit,
	isSaving,
}: VectorStudioProps) => {
	const {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		handleSave,
	} = useVectorStudio(initialData, onSave);

	return (
		<VectorStudioView
			form={form}
			activeSection={activeSection}
			isSaving={isSaving}
			onSectionClick={scrollToSection}
			onExit={onExit}
			onSave={handleSave}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};
