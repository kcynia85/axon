// frontend/src/modules/spaces/ui/inspectors/SpaceTemplateNodeInspector.tsx

import React from "react";
import { SpaceTemplateDomainData } from "../../domain/types";
import { SpaceTemplateInspectorProperties } from "../types";
import { useSpaceTemplateInspectorLogic } from "../../application/hooks/useSpaceTemplateInspectorLogic";
import { SpaceTemplateNodeInspectorView } from "../pure/SpaceTemplateNodeInspectorView";

export const SpaceTemplateNodeInspector = ({ 
    data, 
    onPropertyChange 
}: SpaceTemplateInspectorProperties) => {
    const {
        handleActionToggle,
        handleCustomActionsChange,
        handleContextLinkChange,
        handleArtefactLinkChange,
        handleArtefactStatusChange,
        handleArtefactOutputToggle,
        groupedActions,
        isAllDone,
        isContextDone,
        isArtefactsDone,
    } = useSpaceTemplateInspectorLogic(data, onPropertyChange);

    return (
        <SpaceTemplateNodeInspectorView 
            data={data}
            isAllDone={isAllDone}
            isContextDone={isContextDone}
            isArtefactsDone={isArtefactsDone}
            groupedActions={groupedActions}
            onActionToggle={handleActionToggle}
            onCustomActionsChange={handleCustomActionsChange}
            onContextLinkChange={handleContextLinkChange}
            onArtefactLinkChange={handleArtefactLinkChange}
            onArtefactStatusChange={handleArtefactStatusChange}
            onArtefactOutputToggle={handleArtefactOutputToggle}
        />
    );
};
