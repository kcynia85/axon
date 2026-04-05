"use client";

import React, { useState } from "react";
import { useSpaceServiceInspectorLogic } from "../../application/hooks/useSpaceServiceInspectorLogic";
import { SpaceServiceNodeInspectorView } from "../pure/SpaceServiceNodeInspectorView";
import type { SpaceServiceInspectorProperties } from "../types";

/**
 * SpaceServiceNodeInspector - Container component for service node details.
 * Manages state and logic, delegating presentation to the Pure View.
 */
export const SpaceServiceNodeInspector = ({
    serviceData,
    nodeId,
    onArtifactStatusChange,
    onPropertyChange
}: SpaceServiceInspectorProperties) => {
    const [selectedTabIdentifier, setSelectedTabIdentifier] = useState<string>("context");
    const [componentSearchQuery, setComponentSearchQuery] = useState("");
    const [capabilitySearchQuery, setCapabilitySearchQuery] = useState("");

    const logic = useSpaceServiceInspectorLogic(serviceData, onPropertyChange as any);

    return (
        <SpaceServiceNodeInspectorView
            serviceData={serviceData}
            isContextDone={logic.isContextDone}
            isArtefactsDone={logic.isArtefactsDone}
            selectedTabIdentifier={selectedTabIdentifier}
            componentSearchQuery={componentSearchQuery}
            capabilitySearchQuery={capabilitySearchQuery}
            onTabChange={setSelectedTabIdentifier}
            onSearchQueryChange={setComponentSearchQuery}
            onCapabilitySearchChange={setCapabilitySearchQuery}
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
