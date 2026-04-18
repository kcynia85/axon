import React from "react";
import { SpaceCanvasHeaderView } from "./pure/SpaceCanvasHeaderView";
import type { SpaceCanvasHeaderProperties } from "./types";
import { useUpdateSpaceMutation } from "../application/hooks";
import { useSpaceHeaderInteraction } from "../application/hooks/useSpaceHeaderInteraction";

/**
 * SpaceCanvasHeader - Container component for the canvas header.
 * Orchestrates business logic and interaction state for the Space Header.
 */
export const SpaceCanvasHeader = (properties: SpaceCanvasHeaderProperties) => {
    const { mutate: updateSpace } = useUpdateSpaceMutation();

    const handleRename = (newName: string) => {
        if (!newName || newName === properties.activeSpaceDisplayName) return;
        updateSpace({ id: properties.spaceIdentifier, updates: { name: newName } });
    };

    const {
        isEditing,
        temporarySpaceDisplayName,
        showSuccessFeedback,
        handleToggleEditing,
        handleCancelEditing,
        handleCommitRename,
        handleChangeTemporaryDisplayName,
        handleKeyDown
    } = useSpaceHeaderInteraction({
        activeSpaceDisplayName: properties.activeSpaceDisplayName,
        onRenameSpace: handleRename
    });

    return (
        <SpaceCanvasHeaderView 
            {...properties} 
            isEditing={isEditing}
            temporarySpaceDisplayName={temporarySpaceDisplayName}
            showSuccessFeedback={showSuccessFeedback}
            onToggleEditing={handleToggleEditing}
            onCancelEditing={handleCancelEditing}
            onChangeTemporaryDisplayName={handleChangeTemporaryDisplayName}
            onRenameSpace={handleCommitRename} 
            onKeyDown={handleKeyDown}
        />
    );
};
