import React from "react";
import { SpaceCanvasHeaderView } from "./pure/SpaceCanvasHeaderView";
import type { SpaceCanvasHeaderProperties } from "./types";
import { useUpdateSpaceMutation } from "../application/hooks";

/**
 * SpaceCanvasHeader - Container component for the canvas header.
 * Passes data to the Pure View and handles inline editing logic.
 */
export const SpaceCanvasHeader = (properties: SpaceCanvasHeaderProperties) => {
    const { mutate: updateSpace } = useUpdateSpaceMutation();

    const handleRename = (newName: string) => {
        if (!newName || newName === properties.activeSpaceDisplayName) return;
        updateSpace({ id: properties.spaceId, updates: { name: newName } });
    };

    return <SpaceCanvasHeaderView {...properties} onRenameSpace={handleRename} />;
};
