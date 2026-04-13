import type { FormKeyValueItem } from "@/shared/types/form/FormKeyValueTable.types";
import type { UseFormReturn } from "react-hook-form";

export type KnowledgeStudioSectionId = "RESOURCE" | "METADATA" | "STRATEGY" | "VECTOR_STORE" | "HUBS";

export interface KnowledgeResourceData {
    id?: string;
    fileName: string | null;
    fileSize: string | null;
    metadata: FormKeyValueItem[];
    chunkTypeId: string;
    chunkType: string; // The display name
    vectorStoreId: string;
    hubs: string[];
    tags: string[];
    simulatedChunks: any[];
}

export interface KnowledgeStudioViewProps {
    data: KnowledgeResourceData;
    form: UseFormReturn<any>;
    activeSection: KnowledgeStudioSectionId;
    strategies: any[];
    isLoadingStrategies: boolean;
    vectorStores: any[];
    isLoadingVectorStores: boolean;
    hubs: any[];
    isLoadingHubs: boolean;
    isSimulating: boolean;
    onDataChange: (data: Partial<KnowledgeResourceData>) => void;
    onSave: () => void;
    onCancel: () => void;
    onAutoTag: () => void;
    onSelectFile: (file: File) => void;
    scrollToSection: (id: KnowledgeStudioSectionId) => void;
    setCanvasContainerReference: (node: HTMLDivElement | null) => void;
}
