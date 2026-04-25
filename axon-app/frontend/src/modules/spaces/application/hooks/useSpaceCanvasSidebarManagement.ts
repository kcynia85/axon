// frontend/src/modules/spaces/application/hooks/useSpaceCanvasSidebarManagement.ts

import { useState } from "react";
import { 
    LIST_OF_AVAILABLE_WORKSPACES, 
    MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS,
    WorkspaceColor
} from "../../domain/constants";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCrews } from "@/modules/workspaces/application/useCrews";
import { useServices, useTemplates, useAutomations } from "@/modules/workspaces/application/useWorkspaces";

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
    readonly rawData: Record<string, unknown>;
    readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
};

export const useSpaceCanvasSidebarManagement = () => {
    const [currentlySelectedWorkspaceIdentifier, setCurrentlySelectedWorkspaceIdentifier] = useState<string | null>(null);
    const [componentSearchQuery, setComponentSearchQuery] = useState("");

    const { data: agents = [] } = useAgents(currentlySelectedWorkspaceIdentifier || "");
    const { data: crews = [] } = useCrews(currentlySelectedWorkspaceIdentifier || "");
    const { data: services = [] } = useServices(currentlySelectedWorkspaceIdentifier || "");
    const { data: templates = [] } = useTemplates(currentlySelectedWorkspaceIdentifier || "");
    const { data: automations = [] } = useAutomations(currentlySelectedWorkspaceIdentifier || "");

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

    const activeWorkspaceColor = LIST_OF_AVAILABLE_WORKSPACES.find(
        (workspace) => workspace.identifier === currentlySelectedWorkspaceIdentifier
    )?.visualColor || null;

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
        const activeColor = currentlySelectedWorkspaceIdentifier ? MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[currentlySelectedWorkspaceIdentifier] : 'blue' as WorkspaceColor;
        const visualStyles = getVisualStylesForZoneColor(activeColor);

        const categories = {
            patterns: { items: [] as any[] },
            crews: { items: crews },
            agents: { items: agents },
            automations: { items: automations },
            services: { items: services },
            templates: { items: templates },
        };

        return Object.entries(categories).reduce<Record<string, readonly ComponentItemDisplay[]>>((accumulator, [categoryKey, category]) => {
            const filteredList = (category.items as any[])
                .map(item => ({
                    id: item.id,
                    name: item.agent_role_text || item.crew_name || item.service_name || item.template_name || item.automation_name || "Unknown",
                    type: categoryKey === 'crews' ? 'crew' : 
                          categoryKey === 'agents' ? 'agent' : 
                          categoryKey === 'services' ? 'service' :
                          categoryKey === 'templates' ? 'template' :
                          categoryKey === 'automations' ? 'automation' :
                          categoryKey === 'patterns' ? 'pattern' : 'unknown',
                    rawData: item
                }))
                .filter((item) => item.name.toLowerCase().includes(query))
                .map((item) => ({
                    identifier: item.id,
                    displayName: item.name,
                    type: item.type,
                    zoneColor: activeColor,
                    hoverClassName: visualStyles.level1HoverBackgroundClassName,
                    rawData: item.rawData,
                    onDragStart: (dragEvent: React.DragEvent<HTMLElement>) => 
                        handleDragAndDropStart(dragEvent, item.type === 'pattern' ? 'pattern' : 'entity', {
                            ...item.rawData,
                            label: item.name,
                            type: item.type,
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
        activeWorkspaceColor,
        filteredComponentCategoriesForDisplay,
    };
};
