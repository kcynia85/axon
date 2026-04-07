"use client";

import { useRouter } from "next/navigation";
import { KnowledgeStudioView } from "./KnowledgeStudioView";
import { useKnowledgeStudio } from "../application/useKnowledgeStudio";

/**
 * KnowledgeStudioContainer: Intelligent client container for the knowledge design experience.
 * Standard: Container pattern, orchestrates state and navigation.
 */
export const KnowledgeStudioContainer = () => {
    const router = useRouter();
    const studioState = useKnowledgeStudio();

    const handleCancel = () => {
        router.back();
    };

    return (
        <KnowledgeStudioView
            {...studioState}
            onDataChange={studioState.handleDataChange}
            onSave={studioState.handleSave}
            onAutoTag={studioState.handleAutoTag}
            onSelectFile={studioState.handleSelectFile}
            onCancel={handleCancel}
        />
    );
};
