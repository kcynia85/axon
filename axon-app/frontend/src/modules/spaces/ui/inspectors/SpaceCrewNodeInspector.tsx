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
    onPropertyChange
}: SpaceCrewInspectorProperties) => {
    const processType = crewData.process_type || 'sequential';

    switch (processType) {
        case 'hierarchical':
            return (
                <SpaceCrewHierarchicalNodeInspector 
                    data={crewData} 
                    nodeId={nodeId} 
                    onStatusChange={onStatusChange} 
                    onPropertyChange={onPropertyChange} 
                />
            );
        case 'parallel':
            return (
                <SpaceCrewParallelNodeInspector 
                    data={crewData} 
                    nodeId={nodeId} 
                    onStatusChange={onStatusChange} 
                    onPropertyChange={onPropertyChange} 
                />
            );
        case 'sequential':
        default:
            return (
                <SpaceCrewSequentialNodeInspector 
                    data={crewData} 
                    nodeId={nodeId} 
                    onStatusChange={onStatusChange} 
                    onPropertyChange={onPropertyChange} 
                />
            );
    }
};
