// frontend/src/modules/spaces/ui/inspectors/SpaceServiceNodeInspector.tsx

import React from "react";
import { SpaceServiceDomainData } from "../../domain/types";
import { SpaceServiceInspectorProperties } from "../types";
import { useSpaceServiceInspectorLogic } from "../../application/hooks/useSpaceServiceInspectorLogic";
import { SpaceServiceNodeInspectorView } from "../pure/SpaceServiceNodeInspectorView";

export const SpaceServiceNodeInspector = ({
    data,
    onPropertyChange
}: SpaceServiceInspectorProperties) => {
    const {
        handleContextLinkChange,
        handleLinkContextFromNode,
        handleArtefactLinkChange,
        handleArtefactStatusChange,
        handleArtefactOutputToggle,
        handleAddArtefact,
        handleCapabilityChange,
        handleAttachedLabelChange,
        isContextDone,
        isArtefactsDone,
    } = useSpaceServiceInspectorLogic(data, onPropertyChange);

    return (
        <SpaceServiceNodeInspectorView
            data={data}
            isContextDone={isContextDone}
            isArtefactsDone={isArtefactsDone}
            onContextLinkChange={handleContextLinkChange}
            onLinkContextFromNode={handleLinkContextFromNode}
            onArtefactLinkChange={handleArtefactLinkChange}
            onArtefactStatusChange={handleArtefactStatusChange}
            onArtefactOutputToggle={handleArtefactOutputToggle}
            onAddArtefact={handleAddArtefact}
            onCapabilityChange={handleCapabilityChange}
            onAttachedLabelChange={handleAttachedLabelChange}
        />
    );
};
