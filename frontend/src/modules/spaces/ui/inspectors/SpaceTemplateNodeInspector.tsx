"use client";

import React from "react";
import { useSpaceTemplateInspectorLogic } from "../../application/hooks/useSpaceTemplateInspectorLogic";
import { SpaceTemplateNodeInspectorView } from "../pure/SpaceTemplateNodeInspectorView";
import type { SpaceTemplateInspectorProperties } from "../types";

/**
 * SpaceTemplateNodeInspector - Pure view component for template node details.
 * Delegates logic to useSpaceTemplateInspectorLogic hook.
 */
export const SpaceTemplateNodeInspector = ({ 
    data, 
    onPropertyChange 
}: SpaceTemplateInspectorProperties) => {
    const logic = useSpaceTemplateInspectorLogic(data, onPropertyChange as any);

    return (
        <SpaceTemplateNodeInspectorView 
            data={data}
            isAllDone={logic.isAllDone}
            isContextDone={logic.isContextDone}
            isArtefactsDone={logic.isArtefactsDone}
            groupedActions={logic.groupedActions}
            onActionToggle={logic.handleActionToggle}
            onCustomActionsChange={logic.handleCustomActionsChange}
            onContextLinkChange={logic.handleContextLinkChange}
            onArtefactLinkChange={logic.handleArtefactLinkChange}
            onArtefactStatusChange={logic.handleArtefactStatusChange}
            onArtefactOutputToggle={logic.handleArtefactOutputToggle}
        />
    );
};
