"use client";

import React from "react";
import { SpaceAgentNodeInspectorView } from "./SpaceAgentNodeInspectorView";
import { useSpaceAgentInspector } from "../../application/hooks/useSpaceAgentInspector";
import type { SpaceAgentInspectorProperties } from "../types";

/**
 * SpaceAgentNodeInspector - Container component for agent node details.
 * Orchestrates logic and state management, rendering the Pure View.
 */
export const SpaceAgentNodeInspector = ({ agentData, nodeId, onStatusChange, onPropertyChange }: SpaceAgentInspectorProperties) => {
    const { state: inspectorState, actions: inspectorActions } = useSpaceAgentInspector(agentData, nodeId, onPropertyChange);

    return (
        <SpaceAgentNodeInspectorView 
            state={inspectorState}
            actions={inspectorActions}
            agentData={agentData}
            nodeId={nodeId}
            onStatusChange={onStatusChange}
        />
    );
};
