// frontend/src/modules/spaces/ui/inspectors/SpaceCrewNodeInspector.tsx

import React from "react";
import { SpaceCrewInspectorProperties } from "../../domain/types";
import { SpaceCrewSequentialNodeInspector } from "./crews/SpaceCrewSequentialNodeInspector";
import { SpaceCrewHierarchicalNodeInspector } from "./crews/SpaceCrewHierarchicalNodeInspector";
import { SpaceCrewParallelNodeInspector } from "./crews/SpaceCrewParallelNodeInspector";

export const SpaceCrewNodeInspector = ({ 
    data, 
    nodeId,
    onStatusChange,
    onPropertyChange
}: SpaceCrewInspectorProperties) => {
    const processType = data.process_type || 'sequential';

    if (processType === 'hierarchical') {
        return (
            <SpaceCrewHierarchicalNodeInspector 
                data={data} 
                nodeId={nodeId} 
                onStatusChange={onStatusChange} 
                onPropertyChange={onPropertyChange} 
            />
        );
    }

    if (processType === 'parallel') {
        return (
            <SpaceCrewParallelNodeInspector 
                data={data} 
                nodeId={nodeId} 
                onStatusChange={onStatusChange} 
                onPropertyChange={onPropertyChange} 
            />
        );
    }

    return (
        <SpaceCrewSequentialNodeInspector 
            data={data} 
            nodeId={nodeId} 
            onStatusChange={onStatusChange} 
            onPropertyChange={onPropertyChange} 
        />
    );
};
