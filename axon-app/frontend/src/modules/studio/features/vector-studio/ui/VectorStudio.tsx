import { useVectorStudio } from "../application/hooks/useVectorStudio";
import { VectorStudioView } from "./VectorStudioView";
import { useEmbeddingModels, useSettingsEnums } from "@/modules/settings/application/useSettings";

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
	const { data: embeddingModels = [], isLoading: isLoadingModels } = useEmbeddingModels();
	const { data: enums } = useSettingsEnums();

	const {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		handleSave,
		handleTestConnection,
		isTesting: isTestingConnection,
		testResult
	} = useVectorStudio(initialData, onSave);

	return (
		<VectorStudioView
			form={form}
			activeSection={activeSection}
			isSaving={isSaving}
			onSectionClick={scrollToSection}
			onExit={onExit}
			onSave={handleSave}
			onTestConnection={handleTestConnection}
			isTestingConnection={isTestingConnection}
			testResult={testResult}
			embeddingModels={embeddingModels}
			isLoadingModels={isLoadingModels}
			dbTypeOptions={enums?.vector_db_types?.map((t: string) => ({ id: t, name: t })) || []}
			indexMethodOptions={enums?.index_methods?.map((m: string) => ({ id: m, name: m })) || []}
			setCanvasContainerReference={setCanvasContainerReference}
		/>
	);
};
