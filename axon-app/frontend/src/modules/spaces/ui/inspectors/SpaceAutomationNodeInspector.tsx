// frontend/src/modules/spaces/ui/inspectors/SpaceAutomationNodeInspector.tsx

import React, { useState } from "react";
import { SpaceAutomationInspectorProperties } from "../types";
import { useSpaceAutomationInspectorLogic } from "../../application/hooks/useSpaceAutomationInspectorLogic";
import { SpaceAutomationNodeInspectorView } from "../pure/SpaceAutomationNodeInspectorView";

/**
 * SpaceAutomationNodeInspector - Container component for automation node details.
 * Manages state and logic, delegating presentation to the Pure View.
 */
export const SpaceAutomationNodeInspector = ({ 
    automationData, 
    nodeId,
    onPropertyChange,
    canvasNodes,
    onClose
}: SpaceAutomationInspectorProperties) => {
    const [selectedTabIdentifier, setSelectedTabIdentifier] = useState<string>("workflow");
    const [componentSearchQuery, setComponentSearchQuery] = useState("");

    const {
        handleContextLinkChange,
        handleLinkContextFromNode,
        handleArtefactLinkChange,
        handleArtefactStatusChange,
        handleArtefactOutputToggle,
        handleDeleteArtefact,
        handleTriggerWorkflow,
        handleAddArtefact,
        isTriggering,
        validationError,
        hasTimeoutError,
        isContextDone,
        isArtefactsDone,
    } = useSpaceAutomationInspectorLogic(automationData, onPropertyChange as any);

    return (
        <SpaceAutomationNodeInspectorView 
            automationData={automationData}
            isTriggering={isTriggering}
            validationError={validationError}
            hasTimeoutError={hasTimeoutError}
            isContextDone={isContextDone}
            isArtefactsDone={isArtefactsDone}
            selectedTabIdentifier={selectedTabIdentifier}
            componentSearchQuery={componentSearchQuery}
            onTabChange={setSelectedTabIdentifier}
            onSearchQueryChange={setComponentSearchQuery}
            onContextLinkChange={handleContextLinkChange}
            onLinkContextFromNode={handleLinkContextFromNode}
            onArtefactLinkChange={handleArtefactLinkChange}
            onArtefactStatusChange={handleArtefactStatusChange}
            onArtefactOutputToggle={handleArtefactOutputToggle}
            onDeleteArtefact={handleDeleteArtefact}
            onAddArtefact={handleAddArtefact}
            onTriggerWorkflow={handleTriggerWorkflow}
            canvasNodes={canvasNodes}
            onClose={onClose}
        />
    );
};
