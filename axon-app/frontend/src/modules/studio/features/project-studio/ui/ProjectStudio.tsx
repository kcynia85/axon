"use client";

import React from "react";
import { useProjectStudioView } from "../application/hooks/useProjectStudioView";
import { ProjectStudioView } from "./ProjectStudioView";
import { CreateProjectFormData } from "@/modules/projects/application/schemas";

interface ProjectStudioProps {
    readonly initialData?: Partial<CreateProjectFormData>;
    readonly projectId?: string;
}

export const ProjectStudio = ({ initialData, projectId }: ProjectStudioProps = {}) => {
    const {
        form,
        handleExit,
        handleSubmit,
        syncDraft,
        handleKeyDown,
        setCanvasRef,
        activeSection,
        scrollToSection,
        sections,
        linkFields,
        appendLink,
        removeLink,
        projectName,
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
        spaceIds,
        usedSpaceIds,
        generateNewSpace,
    } = useProjectStudioView(initialData, projectId);

    const handleSave = form.handleSubmit(
        (data) => {
            console.log("Form valid, submitting...", data);
            handleSubmit(data);
        },
        (errors) => {
            console.error("Form invalid, errors:", errors);
        }
    );

    return (
        <ProjectStudioView 
            form={form}
            step="design"
            onExit={handleExit}
            onSave={handleSave}
            onSyncDraft={syncDraft}
            onKeyDown={handleKeyDown}
            activeSectionIdentifier={activeSection as any}
            onSectionClick={scrollToSection}
            sections={sections}
            setCanvasContainerReference={setCanvasRef}
            isEditing={!!projectId}
            linkFields={linkFields}
            appendLink={appendLink}
            removeLink={removeLink}
            projectName={projectName}
            currentKeywords={currentKeywords}
            keywordInput={keywordInput}
            handleKeywordChange={handleKeywordChange}
            handleKeywordKeyDown={handleKeywordKeyDown}
            removeKeyword={removeKeyword}
            isSpaceModalOpen={isSpaceModalOpen}
            onOpenSpaceModal={() => setIsSpaceModalOpen(true)}
            onCloseSpaceModal={() => setIsSpaceModalOpen(false)}
            onSelectSpace={handleSelectSpace}
            onCreateNewSpace={handleCreateNewSpace}
            onRemoveSpace={handleRemoveSpace}
            spaceIds={spaceIds}
            usedSpaceIds={usedSpaceIds}
            generateNewSpace={generateNewSpace}
            projectId={projectId}
        />
    );
};
