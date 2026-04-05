"use client";

import React from "react";
import { useSpaceTemplateInspectorLogic } from "../../application/hooks/useSpaceTemplateInspectorLogic";
import { SpaceTemplateNodeInspectorView } from "../pure/SpaceTemplateNodeInspectorView";
import type { SpaceTemplateInspectorProperties } from "../types";

/**
 * SpaceTemplateNodeInspector - Container component for template node details.
 * Manages state and logic, delegating presentation to the Pure View.
 */
export const SpaceTemplateNodeInspector = ({ 
    templateData, 
    nodeId,
    onPropertyChange 
}: SpaceTemplateInspectorProperties) => {
    const logic = useSpaceTemplateInspectorLogic(templateData, onPropertyChange as any);

    return (
        <SpaceTemplateNodeInspectorView 
            templateData={templateData}
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
