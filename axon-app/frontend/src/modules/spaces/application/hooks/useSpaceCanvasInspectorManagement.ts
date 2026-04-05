// frontend/src/modules/spaces/application/hooks/useSpaceCanvasInspectorManagement.ts

import { SpaceCanvasNodeInformation } from "../../domain/types";
import { getEffectiveNodeType, isNodeRepresentingAZone } from "@/modules/spaces/ui/utils/presentation_mappers";

export const useSpaceCanvasInspectorManagement = (
    currentlySelectedNodeInformation: SpaceCanvasNodeInformation | null,
    handleNodeDataPropertyChange: (nodeUniqueIdentifier: string, updatedProperties: Record<string, unknown>) => void
) => {
    // Derived state - React Compiler handles optimization
    const effectiveNodeType = currentlySelectedNodeInformation 
        ? getEffectiveNodeType(currentlySelectedNodeInformation) 
        : null;

    const isNodeSelectedRepresentingAZone = currentlySelectedNodeInformation 
        ? isNodeRepresentingAZone(currentlySelectedNodeInformation) 
        : false;

    const handleStatusChange = (selection: unknown) => {
        if (!currentlySelectedNodeInformation) return;
        const newStatus = Array.from(selection as Iterable<string>)[0];
        handleNodeDataPropertyChange(currentlySelectedNodeInformation.id, { state: newStatus });
    };

    const handleArtifactStatusChange = (selection: unknown) => {
        if (!currentlySelectedNodeInformation) return;
        const newStatus = Array.from(selection as Iterable<string>)[0];
        handleNodeDataPropertyChange(currentlySelectedNodeInformation.id, { artifactStatus: newStatus });
    };

    const handlePropertyChange = (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => {
        if (!currentlySelectedNodeInformation) return;
        
        const updates = typeof propertyNameOrObject === 'string' 
            ? { [propertyNameOrObject]: propertyValue }
            : propertyNameOrObject;
            
        handleNodeDataPropertyChange(currentlySelectedNodeInformation.id, updates);
    };

    return {
        effectiveNodeType,
        isNodeSelectedRepresentingAZone,
        handleStatusChange,
        handleArtifactStatusChange,
        handlePropertyChange,
    };
};
