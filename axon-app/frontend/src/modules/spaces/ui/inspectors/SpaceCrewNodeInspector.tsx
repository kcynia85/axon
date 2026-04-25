// frontend/src/modules/spaces/ui/inspectors/SpaceCrewNodeInspector.tsx

import React from "react";
import { SpaceCrewInspectorProperties } from "../types";
import { SpaceCrewSequentialNodeInspector } from "./crews/SpaceCrewSequentialNodeInspector";
import { SpaceCrewHierarchicalNodeInspector } from "./crews/SpaceCrewHierarchicalNodeInspector";
import { SpaceCrewParallelNodeInspector } from "./crews/SpaceCrewParallelNodeInspector";

export const SpaceCrewNodeInspector = (props: SpaceCrewInspectorProperties) => {
    const rawProcessType = (props.crewData.process_type || (props.crewData as any).crew_process_type || 'sequential') as string;
    const processType = rawProcessType.toLowerCase();

    if (processType === 'hierarchical') {
        return (
            <SpaceCrewHierarchicalNodeInspector 
                {...props}
            />
        );
    }

    if (processType === 'parallel') {
        return (
            <SpaceCrewParallelNodeInspector 
                {...props}
            />
        );
    }

    return (
        <SpaceCrewSequentialNodeInspector 
            {...props}
        />
    );
};
