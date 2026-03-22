import { FormKeyValueItem } from "@/shared/types/form/FormKeyValueTable.types";

export interface KnowledgeResourceData {
    fileName: string | null;
    fileSize: string | null;
    metadata: FormKeyValueItem[];
    model: string;
    chunkType: string;
    hubs: string[];
}

export interface KnowledgeStudioViewProps {
    data: KnowledgeResourceData;
    onDataChange: (data: Partial<KnowledgeResourceData>) => void;
    onSave: () => void;
    onCancel: () => void;
    onAutoTag: () => void;
    onSelectFile: (file: File) => void;
}
