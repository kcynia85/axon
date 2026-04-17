// frontend/src/modules/spaces/ui/inspectors/SpaceCrewNodeInspector.tsx

import React from "react";
import { SpaceCrewInspectorProperties } from "../types";
import { SpaceCrewSequentialNodeInspector } from "./crews/SpaceCrewSequentialNodeInspector";
import { SpaceCrewHierarchicalNodeInspector } from "./crews/SpaceCrewHierarchicalNodeInspector";
import { SpaceCrewParallelNodeInspector } from "./crews/SpaceCrewParallelNodeInspector";

/**
 * SpaceCrewNodeInspector - Container component that routes to specific crew inspectors
 * based on the process type. Adheres to full naming conventions and project standards.
 */
export const SpaceCrewNodeInspector = ({ 
    crewData, 
    nodeId,
    onStatusChange,
    onPropertyChange,
    canvasNodes
}: SpaceCrewInspectorProperties) => {
    // We check multiple sources for the process type to be as robust as possible
    const rawProcessType = (crewData.process_type || (crewData as any).crew_process_type || 'sequential') as string;
    const processType = rawProcessType.toLowerCase();

    switch (processType) {
        case 'hierarchical':
            return (
                <SpaceCrewHierarchicalNodeInspector 
                    crewData={crewData} 
                    nodeId={nodeId} 
                    onStatusChange={onStatusChange} 
                    onPropertyChange={onPropertyChange} 
                    canvasNodes={canvasNodes}
                />
            );
        case 'parallel':
            return (
                <SpaceCrewParallelNodeInspector 
                    crewData={crewData} 
                    nodeId={nodeId} 
                    onStatusChange={onStatusChange} 
                    onPropertyChange={onPropertyChange} 
                    canvasNodes={canvasNodes}
                />
            );
        case 'sequential':
        default:
            return (
                <SpaceCrewSequentialNodeInspector 
                    crewData={crewData} 
                    nodeId={nodeId} 
                    onStatusChange={onStatusChange} 
                    onPropertyChange={onPropertyChange} 
                    canvasNodes={canvasNodes}
                />
            );
    }
};
