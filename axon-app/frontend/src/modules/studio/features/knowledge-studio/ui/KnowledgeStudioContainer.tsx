"use client";

import { useRouter } from "next/navigation";
import { KnowledgeStudioView } from "./KnowledgeStudioView";
import { useKnowledgeStudio } from "../application/useKnowledgeStudio";

export const KnowledgeStudioContainer = () => {
    const router = useRouter();
    const { 
        handleDataChange, 
        handleSave, 
        handleAutoTag, 
        handleSelectFile, 
        ...studioState 
    } = useKnowledgeStudio();

    const handleCancel = () => {
        router.back();
    };

    return (
        <KnowledgeStudioView
            {...studioState}
            onDataChange={handleDataChange}
            onSave={handleSave}
            onAutoTag={handleAutoTag}
            onSelectFile={handleSelectFile}
            onCancel={handleCancel}
        />
    );
};
