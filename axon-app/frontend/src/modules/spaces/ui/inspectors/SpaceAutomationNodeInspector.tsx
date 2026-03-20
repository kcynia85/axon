// frontend/src/modules/spaces/ui/inspectors/SpaceAutomationNodeInspector.tsx

import React from "react";
import { SpaceAutomationDomainData } from "../../domain/types";
import { SpaceAutomationInspectorProperties } from "../types";
import { useSpaceAutomationInspectorLogic } from "../../application/hooks/useSpaceAutomationInspectorLogic";
import { SpaceAutomationNodeInspectorView } from "../pure/SpaceAutomationNodeInspectorView";

export const SpaceAutomationNodeInspector = ({ 
    data, 
    onPropertyChange 
}: SpaceAutomationInspectorProperties) => {
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
    } = useSpaceAutomationInspectorLogic(data, onPropertyChange as any);

    return (
        <SpaceAutomationNodeInspectorView 
            data={data}
            isTriggering={isTriggering}
            validationError={validationError}
            hasTimeoutError={hasTimeoutError}
            isContextDone={isContextDone}
            isArtefactsDone={isArtefactsDone}
            onContextLinkChange={handleContextLinkChange}
            onLinkContextFromNode={handleLinkContextFromNode}
            onArtefactLinkChange={handleArtefactLinkChange}
            onArtefactStatusChange={handleArtefactStatusChange}
            onArtefactOutputToggle={handleArtefactOutputToggle}
            onDeleteArtefact={handleDeleteArtefact}
            onAddArtefact={handleAddArtefact}
            onTriggerWorkflow={handleTriggerWorkflow}
        />
    );
};
