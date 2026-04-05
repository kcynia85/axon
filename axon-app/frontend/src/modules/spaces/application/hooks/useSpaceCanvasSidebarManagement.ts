// frontend/src/modules/spaces/application/hooks/useSpaceCanvasSidebarManagement.ts

import { useState } from "react";
import { 
    LIST_OF_AVAILABLE_WORKSPACES, 
    MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY,
    MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS
} from "../../domain/constants";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

type WorkspaceUnitDisplay = {
    readonly identifier: string;
    readonly displayName: string;
    readonly hoverClassName: string;
    readonly onClick: () => void;
    readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
};

type ComponentItemDisplay = {
    readonly identifier: string;
    readonly displayName: string;
    readonly type: string;
    readonly zoneColor: string;
    readonly hoverClassName: string;
    readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
};

export const useSpaceCanvasSidebarManagement = () => {
    const [currentlySelectedWorkspaceIdentifier, setCurrentlySelectedWorkspaceIdentifier] = useState<string | null>(null);
    const [componentSearchQuery, setComponentSearchQuery] = useState("");

    const selectWorkspaceUnit = (workspaceIdentifier: string) => {
        setCurrentlySelectedWorkspaceIdentifier(workspaceIdentifier);
        setComponentSearchQuery("");
    };

    const returnToWorkspaceSelection = () => {
        setCurrentlySelectedWorkspaceIdentifier(null);
        setComponentSearchQuery("");
    };

    const handleDragAndDropStart = (
        dragEvent: React.DragEvent<HTMLElement>, 
        nodeType: string, 
        transferData: unknown
    ) => {
        dragEvent.dataTransfer.setData('application/reactflow', nodeType);
        dragEvent.dataTransfer.setData('application/axon-data', JSON.stringify(transferData));
        dragEvent.dataTransfer.effectAllowed = 'move';
    };

    // Derived state - React Compiler handles optimization
    const workspaceUnitsForDisplay: readonly WorkspaceUnitDisplay[] = LIST_OF_AVAILABLE_WORKSPACES.map((workspaceUnit) => {
        const visualStyles = getVisualStylesForZoneColor(workspaceUnit.visualColor);
        return {
            identifier: workspaceUnit.identifier,
            displayName: workspaceUnit.displayName,
            hoverClassName: visualStyles.level1HoverBackgroundClassName,
            onClick: () => selectWorkspaceUnit(workspaceUnit.identifier),
            onDragStart: (dragEvent: React.DragEvent<HTMLElement>) => 
                handleDragAndDropStart(dragEvent, 'zone', {
                    label: workspaceUnit.displayName,
                    type: workspaceUnit.identifier,
                    color: workspaceUnit.visualColor
                })
        };
    });

    const activeWorkspaceDisplayName = LIST_OF_AVAILABLE_WORKSPACES.find(
        (workspace) => workspace.identifier === currentlySelectedWorkspaceIdentifier
    )?.displayName || "";

    const activeWorkspaceHeaderClassName = (() => {
        if (!currentlySelectedWorkspaceIdentifier) return "";
        const workspaceUnit = LIST_OF_AVAILABLE_WORKSPACES.find(
            (workspace) => workspace.identifier === currentlySelectedWorkspaceIdentifier
        );
        if (!workspaceUnit) return "bg-blue-600";
        
        const visualStyles = getVisualStylesForZoneColor(workspaceUnit.visualColor);
        return visualStyles.hoverBackgroundClassName || "bg-blue-600";
    })();

    const filteredComponentCategoriesForDisplay = (() => {
        const query = componentSearchQuery.trim().toLowerCase();
        const activeColor = currentlySelectedWorkspaceIdentifier ? MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[currentlySelectedWorkspaceIdentifier] : 'default';
        const visualStyles = getVisualStylesForZoneColor(activeColor);

        return Object.entries(MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY).reduce<Record<string, readonly ComponentItemDisplay[]>>((accumulator, [categoryKey, componentList]) => {
            const filteredList = componentList
                .filter((componentItem) => componentItem.componentName.toLowerCase().includes(query))
                .map((componentItem) => ({
                    identifier: componentItem.uniqueIdentifier,
                    displayName: componentItem.componentName,
                    type: componentItem.componentType,
                    zoneColor: activeColor,
                    hoverClassName: visualStyles.level1HoverBackgroundClassName,
                    onDragStart: (dragEvent: React.DragEvent<HTMLElement>) => 
                        handleDragAndDropStart(dragEvent, 'entity', {
                            label: componentItem.componentName,
                            type: componentItem.componentType,
                            zoneColor: activeColor
                        })
                }));
            
            accumulator[categoryKey] = filteredList;
            return accumulator;
        }, {});
    })();

    return {
        currentlySelectedWorkspaceIdentifier,
        componentSearchQuery,
        setComponentSearchQuery,
        returnToWorkspaceSelection,
        workspaceUnitsForDisplay,
        activeWorkspaceDisplayName,
        activeWorkspaceHeaderClassName,
        filteredComponentCategoriesForDisplay,
    };
};
