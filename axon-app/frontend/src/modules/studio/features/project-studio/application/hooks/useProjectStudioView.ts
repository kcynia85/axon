import { useState, useCallback, ChangeEvent, KeyboardEvent, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useProjectStudio } from "../useProjectStudio";
import { useStudioShortcuts } from "../../../agent-studio/application/hooks/useStudioShortcuts";
import { PROJECT_STUDIO_SECTIONS } from "../../types/sections.constants";
import { ProjectStudioSectionId } from "../../types/project-studio.types";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { CreateProjectFormData } from "@/modules/projects/application/schemas";
import { useProjectsQuery } from "@/modules/projects/application/hooks";

const PROJECT_STUDIO_SECTION_IDENTIFIERS: readonly ProjectStudioSectionId[] = [
    "IDENTITY",
    "RESOURCES",
    "SPACE",
    "ARTEFACTS"
];

export const useProjectStudioView = (initialData?: Partial<CreateProjectFormData>, projectId?: string) => {
    const { 
        form, 
        handleExit, 
        handleSubmit, 
        syncDraft,
        linkFields,
        appendLink,
        removeLink,
    } = useProjectStudio(initialData, projectId);

    const { data: allProjects = [] } = useProjectsQuery();

    const [keywordInput, setKeywordInput] = useState("");
    const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);

    const { handleKeyDown } = useStudioShortcuts({
        onSave: syncDraft,
        onEscape: handleExit,
        isActive: true,
    });

    const { 
        activeSectionIdentifier: activeSection, 
        setCanvasContainerReference: setCanvasRef, 
        scrollToSectionIdentifier: scrollToSection 
    } = useStudioScrollSpy<ProjectStudioSectionId>(
        PROJECT_STUDIO_SECTION_IDENTIFIERS,
        "IDENTITY"
    );

    const projectName = useWatch({ control: form.control, name: "name" }) || "";
    const spaceIds = useWatch({ control: form.control, name: "spaceIds" }) || [];
    const generateNewSpace = useWatch({ control: form.control, name: "generateNewSpace" }) || false;
    const currentKeywords = useWatch({ control: form.control, name: "keywords" }) || [];

    const addKeyword = (value: string) => {
        const trimmed = value.trim().replace(/,$/, "").toLowerCase();
        if (trimmed && !currentKeywords.includes(trimmed)) {
            form.setValue("keywords", [...currentKeywords, trimmed]);
            setKeywordInput("");
            return true;
        }
        return false;
    };

    const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.endsWith(" ") || value.endsWith(",")) {
            if (addKeyword(value)) {
                return;
            }
        }
        setKeywordInput(value);
    };

    const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword(keywordInput);
        } else if (e.key === 'Backspace' && !keywordInput && currentKeywords.length > 0) {
            removeKeyword(currentKeywords[currentKeywords.length - 1]);
        }
    };

    const removeKeyword = (keyword: string) => {
        form.setValue("keywords", currentKeywords.filter(k => k !== keyword));
    };

    const handleSelectSpace = (spaceId: string) => {
        const currentSpaceIds = form.getValues("spaceIds") || [];
        if (!currentSpaceIds.includes(spaceId)) {
            form.setValue("spaceIds", [...currentSpaceIds, spaceId], { shouldValidate: true });
            syncDraft();
        }
    };

    const handleCreateNewSpace = () => {
        const currentGenerate = form.getValues("generateNewSpace");
        form.setValue("generateNewSpace", !currentGenerate, { shouldValidate: true });
        syncDraft();
    };

    const handleRemoveSpace = (spaceId: string) => {
        const currentSpaceIds = form.getValues("spaceIds") || [];
        form.setValue("spaceIds", currentSpaceIds.filter(id => id !== spaceId), { shouldValidate: true });
        syncDraft();
    };

    const usedSpaceIds = useMemo(() => {
        return allProjects
            .filter(p => p.id !== projectId)
            .flatMap(p => p.space_ids || []);
    }, [allProjects, projectId]);

    return {
        form,
        handleExit,
        handleSubmit,
        syncDraft,
        handleKeyDown,
        sections: PROJECT_STUDIO_SECTIONS,
        setCanvasRef,
        activeSection,
        scrollToSection,
        linkFields,
        appendLink,
        removeLink,
        projectName,
        spaceIds,
        generateNewSpace,
        currentKeywords,
        keywordInput,
        handleKeywordChange,
        handleKeywordKeyDown,
        removeKeyword,
        isSpaceModalOpen,
        setIsSpaceModalOpen,
        handleSelectSpace,
        handleCreateNewSpace,
        handleRemoveSpace,
        usedSpaceIds,
    };
};
