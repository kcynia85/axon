"use client";

import React from "react";
import { useSpaceServiceInspectorLogic } from "../../application/hooks/useSpaceServiceInspectorLogic";
import { SpaceServiceNodeInspectorView } from "../pure/SpaceServiceNodeInspectorView";
import type { SpaceServiceInspectorProperties } from "../types";

/**
 * SpaceServiceNodeInspector - Pure view component for service node details.
 * Delegates logic to useSpaceServiceInspectorLogic hook.
 */
export const SpaceServiceNodeInspector = ({
    data,
    onPropertyChange
}: SpaceServiceInspectorProperties) => {
    const logic = useSpaceServiceInspectorLogic(data, onPropertyChange as any);

    return (
        <SpaceServiceNodeInspectorView
            data={data}
            isContextDone={logic.isContextDone}
            isArtefactsDone={logic.isArtefactsDone}
            onContextLinkChange={logic.handleContextLinkChange}
            onLinkContextFromNode={logic.handleLinkContextFromNode}
            onArtefactLinkChange={logic.handleArtefactLinkChange}
            onArtefactStatusChange={logic.handleArtefactStatusChange}
            onArtefactOutputToggle={logic.handleArtefactOutputToggle}
            onAddArtefact={logic.handleAddArtefact}
            onCapabilityChange={logic.handleCapabilityChange}
            onAttachedLabelChange={logic.handleAttachedLabelChange}
        />
    );
};
