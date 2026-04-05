import { useForm } from "react-hook-form";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";

export const useVectorStudio = (
	initialData?: any,
	onSave?: (data: any) => void,
) => {
	const form = useForm({
		defaultValues: initialData || {
			vector_database_type: "Postgres_pgvector",
			vector_database_embedding_model_reference: "text-embedding-3-small",
			vector_database_connection_url: "aws-eu-central-1",
			vector_database_collection_name: "axon_knowledge_vectors_",
			index_type: "HNSW",
		},
	});

	const {
		activeSectionIdentifier: activeSection,
		setCanvasContainerReference,
		scrollToSectionIdentifier: scrollToSection,
	} = useStudioScrollSpy<string>(["type", "model", "connection", "indexing"], "type");

	const handleSave = form.handleSubmit((data) => {
		if (onSave) {
			onSave(data);
		}
	});

	return {
		form,
		activeSection,
		scrollToSection,
		setCanvasContainerReference,
		handleSave,
	};
};
