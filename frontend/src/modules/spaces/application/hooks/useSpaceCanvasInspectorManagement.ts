// frontend/src/modules/spaces/application/hooks/useSpaceCanvasInspectorManagement.ts

import { useCallback, useMemo } from "react";
import { SpaceCanvasNodeInformation } from "../../domain/types";
import { getEffectiveNodeType, isNodeRepresentingAZone } from "@/modules/spaces/ui/utils/presentation_mappers";

export const useSpaceCanvasInspectorManagement = (
    currentlySelectedNodeInformation: SpaceCanvasNodeInformation | null,
    handleNodeDataPropertyChange: (nodeUniqueIdentifier: string, updatedProperties: Record<string, unknown>) => void
) => {
    const effectiveNodeType = useMemo(() => {
        if (!currentlySelectedNodeInformation) return null;
        return getEffectiveNodeType(currentlySelectedNodeInformation);
    }, [currentlySelectedNodeInformation]);

    const isNodeSelectedRepresentingAZone = useMemo(() => {
        if (!currentlySelectedNodeInformation) return false;
        return isNodeRepresentingAZone(currentlySelectedNodeInformation);
    }, [currentlySelectedNodeInformation]);

    const handleStatusChange = useCallback((selection: unknown) => {
        if (!currentlySelectedNodeInformation) return;
        // Selection is usually a Set from HeroUI/NextUI
        const newStatus = Array.from(selection as Iterable<string>)[0];
        handleNodeDataPropertyChange(currentlySelectedNodeInformation.id, { state: newStatus });
    }, [currentlySelectedNodeInformation, handleNodeDataPropertyChange]);

    const handleArtifactStatusChange = useCallback((selection: unknown) => {
        if (!currentlySelectedNodeInformation) return;
        const newStatus = Array.from(selection as Iterable<string>)[0];
        handleNodeDataPropertyChange(currentlySelectedNodeInformation.id, { artifactStatus: newStatus });
    }, [currentlySelectedNodeInformation, handleNodeDataPropertyChange]);

    const handlePropertyChange = useCallback((propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => {
        if (!currentlySelectedNodeInformation) return;
        
        const updates = typeof propertyNameOrObject === 'string' 
            ? { [propertyNameOrObject]: propertyValue }
            : propertyNameOrObject;
            
        handleNodeDataPropertyChange(currentlySelectedNodeInformation.id, updates);
    }, [currentlySelectedNodeInformation, handleNodeDataPropertyChange]);

    return {
        effectiveNodeType,
        isNodeSelectedRepresentingAZone,
        handleStatusChange,
        handleArtifactStatusChange,
        handlePropertyChange,
    };
};
