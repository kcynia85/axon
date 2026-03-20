// frontend/src/modules/spaces/ui/SpaceCanvasLeftSidebar.tsx

import React from "react";
import { SpaceCanvasLeftSidebarProperties } from "./types";
import { useSpaceCanvasSidebarManagement } from "../application/hooks/useSpaceCanvasSidebarManagement";
import { SpaceCanvasLeftSidebarView } from "./pure/SpaceCanvasLeftSidebarView";

export const SpaceCanvasLeftSidebar: React.FC<SpaceCanvasLeftSidebarProperties> = ({ onAddComponent }) => {
    const {
        currentlySelectedWorkspaceIdentifier,
        componentSearchQuery,
        setComponentSearchQuery,
        returnToWorkspaceSelection,
        workspaceUnitsForDisplay,
        activeWorkspaceDisplayName,
        activeWorkspaceHeaderClassName,
        filteredComponentCategoriesForDisplay,
    } = useSpaceCanvasSidebarManagement();

    return (
        <SpaceCanvasLeftSidebarView 
            currentlySelectedWorkspaceIdentifier={currentlySelectedWorkspaceIdentifier}
            componentSearchQuery={componentSearchQuery}
            setComponentSearchQuery={setComponentSearchQuery}
            returnToWorkspaceSelection={returnToWorkspaceSelection}
            workspaceUnitsForDisplay={workspaceUnitsForDisplay}
            activeWorkspaceDisplayName={activeWorkspaceDisplayName}
            activeWorkspaceHeaderClassName={activeWorkspaceHeaderClassName}
            filteredComponentCategoriesForDisplay={filteredComponentCategoriesForDisplay}
            onAddComponent={onAddComponent}
        />
    );
};
