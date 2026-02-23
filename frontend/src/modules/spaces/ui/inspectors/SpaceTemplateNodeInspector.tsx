// frontend/src/modules/spaces/ui/inspectors/SpaceTemplateNodeInspector.tsx

import React from "react";
import { SpaceTemplateInspectorProperties } from "../../domain/types";
import { useSpaceTemplateInspectorLogic } from "../../application/hooks/useSpaceTemplateInspectorLogic";
import { SpaceTemplateNodeInspectorView } from "../pure/SpaceTemplateNodeInspectorView";

export const SpaceTemplateNodeInspector = ({ 
    data, 
    onPropertyChange 
}: SpaceTemplateInspectorProperties) => {
    const {
        handleActionToggle,
        handleCustomActionsChange,
        groupedActions,
        isAllDone,
    } = useSpaceTemplateInspectorLogic(data, onPropertyChange);

    return (
        <SpaceTemplateNodeInspectorView 
            data={data}
            isAllDone={isAllDone}
            groupedActions={groupedActions}
            onActionToggle={handleActionToggle}
            onCustomActionsChange={handleCustomActionsChange}
        />
    );
};
