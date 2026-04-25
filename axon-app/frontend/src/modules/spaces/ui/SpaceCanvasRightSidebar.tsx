// frontend/src/modules/spaces/ui/SpaceCanvasRightSidebar.tsx

import React from "react";
import { 
    SpaceCanvasSidebarProperties, 
} from "./types";
import { useSpaceCanvasInspectorManagement } from "../application/hooks/useSpaceCanvasInspectorManagement";
import { SpaceCanvasRightSidebarView } from "./pure/SpaceCanvasRightSidebarView";

/**
 * SpaceCanvasRightSidebar - Container component for the right inspector sidebar.
 * Orchestrates node inspection logic and renders the Pure View.
 */
export const SpaceCanvasRightSidebar = ({ 
    currentlySelectedNodeInformation, 
    handleNodeDataPropertyChange,
    onRunNode,
    canvasNodes
}: SpaceCanvasSidebarProperties) => {
    const {
        effectiveNodeType,
        isNodeSelectedRepresentingAZone,
        handleStatusChange,
        handleArtifactStatusChange,
        handlePropertyChange,
    } = useSpaceCanvasInspectorManagement(currentlySelectedNodeInformation, handleNodeDataPropertyChange);

    return (
        <SpaceCanvasRightSidebarView 
            currentlySelectedNodeInformation={currentlySelectedNodeInformation}
            effectiveNodeType={effectiveNodeType || 'unknown'}
            isNodeSelectedRepresentingAZone={isNodeSelectedRepresentingAZone}
            handleStatusChange={handleStatusChange}
            handleArtifactStatusChange={handleArtifactStatusChange}
            handlePropertyChange={handlePropertyChange}
            onRunNode={onRunNode}
            canvasNodes={canvasNodes}
        />
    );
};
