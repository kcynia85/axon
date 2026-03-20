// frontend/src/modules/spaces/ui/SpaceCanvasRightSidebar.tsx

import React from "react";
import { 
    SpaceCanvasSidebarProps, 
} from "./types";
import { useSpaceCanvasInspectorManagement } from "../application/hooks/useSpaceCanvasInspectorManagement";
import { SpaceCanvasRightSidebarView } from "./pure/SpaceCanvasRightSidebarView";

export const SpaceCanvasRightSidebar = ({ 
    currentlySelectedNodeInformation, 
    handleNodeDataPropertyChange,
    canvasNodes
}: SpaceCanvasSidebarProps) => {
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
            canvasNodes={canvasNodes}
        />
    );
};
