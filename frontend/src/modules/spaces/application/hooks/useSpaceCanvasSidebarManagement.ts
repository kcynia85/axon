// frontend/src/modules/spaces/application/hooks/useSpaceCanvasSidebarManagement.ts

import { useCallback, useMemo, useState } from "react";
import { 
    LIST_OF_AVAILABLE_WORKSPACES, 
    MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY,
    MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS
} from "../../domain/constants";
import { getVisualStylesForZoneColor } from "../../domain/presentation_mappers";

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
    readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
};

export const useSpaceCanvasSidebarManagement = () => {
    const [currentlySelectedWorkspaceIdentifier, setCurrentlySelectedWorkspaceIdentifier] = useState<string | null>(null);
    const [componentSearchQuery, setComponentSearchQuery] = useState("");

    const selectWorkspaceUnit = useCallback((workspaceIdentifier: string) => {
        setCurrentlySelectedWorkspaceIdentifier(workspaceIdentifier);
        setComponentSearchQuery("");
    }, []);

    const returnToWorkspaceSelection = useCallback(() => {
        setCurrentlySelectedWorkspaceIdentifier(null);
        setComponentSearchQuery("");
    }, []);

    const handleDragAndDropStart = useCallback((
        dragEvent: React.DragEvent<HTMLElement>, 
        nodeType: string, 
        transferData: unknown
    ) => {
        dragEvent.dataTransfer.setData('application/reactflow', nodeType);
        dragEvent.dataTransfer.setData('application/axon-data', JSON.stringify(transferData));
        dragEvent.dataTransfer.effectAllowed = 'move';
    }, []);

    const workspaceUnitsForDisplay = useMemo<readonly WorkspaceUnitDisplay[]>(() => {
        return LIST_OF_AVAILABLE_WORKSPACES.map((workspaceUnit) => {
            const visualStyles = getVisualStylesForZoneColor(workspaceUnit.identifier);
            return {
                identifier: workspaceUnit.identifier,
                displayName: workspaceUnit.displayName,
                // Cleanly prepare the hover class for the view
                hoverClassName: `hover:${visualStyles.backgroundClassName?.replace('/5', '')}`,
                onClick: () => selectWorkspaceUnit(workspaceUnit.identifier),
                onDragStart: (dragEvent: React.DragEvent<HTMLElement>) => 
                    handleDragAndDropStart(dragEvent, 'zone', {
                        label: workspaceUnit.displayName,
                        type: workspaceUnit.identifier,
                        color: workspaceUnit.visualColor
                    })
            };
        });
    }, [selectWorkspaceUnit, handleDragAndDropStart]);

    const activeWorkspaceDisplayName = useMemo(() => {
        return LIST_OF_AVAILABLE_WORKSPACES.find(
            (workspace) => workspace.identifier === currentlySelectedWorkspaceIdentifier
        )?.displayName || "";
    }, [currentlySelectedWorkspaceIdentifier]);

    const activeWorkspaceHeaderClassName = useMemo(() => {
        if (!currentlySelectedWorkspaceIdentifier) return "";
        const visualStyles = getVisualStylesForZoneColor(currentlySelectedWorkspaceIdentifier);
        return visualStyles.backgroundClassName?.replace('/5', '') || "bg-blue-600";
    }, [currentlySelectedWorkspaceIdentifier]);

    const filteredComponentCategoriesForDisplay = useMemo(() => {
        const query = componentSearchQuery.trim().toLowerCase();
        
        return Object.entries(MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY).reduce<Record<string, readonly ComponentItemDisplay[]>>((accumulator, [categoryKey, componentList]) => {
            const filteredList = componentList
                .filter((componentItem) => componentItem.componentName.toLowerCase().includes(query))
                .map((componentItem) => ({
                    identifier: componentItem.uniqueIdentifier,
                    displayName: componentItem.componentName,
                    type: componentItem.componentType,
                    onDragStart: (dragEvent: React.DragEvent<HTMLElement>) => 
                        handleDragAndDropStart(dragEvent, 'entity', {
                            label: componentItem.componentName,
                            type: componentItem.componentType,
                            zoneColor: MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[currentlySelectedWorkspaceIdentifier!]
                        })
                }));
            
            accumulator[categoryKey] = filteredList;
            return accumulator;
        }, {});
    }, [componentSearchQuery, currentlySelectedWorkspaceIdentifier, handleDragAndDropStart]);

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
