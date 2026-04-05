// frontend/src/modules/spaces/application/hooks/useSpaceTemplateInspectorLogic.ts

import { SpaceTemplateDomainData, TemplateAction, TemplateArtefact } from "../../domain/types";

export const useSpaceTemplateInspectorLogic = (
    data: SpaceTemplateDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const handleActionToggle = (actionId: string) => {
        const updatedActions = data.actions.map((action) => 
            action.id === actionId ? { ...action, isCompleted: !action.isCompleted } : action
        );
        
        const allCompleted = updatedActions.length > 0 && updatedActions.every((action) => action.isCompleted);
        const newStatus = allCompleted ? 'done' : 'working';

        onPropertyChange({
            actions: updatedActions,
            status: newStatus
        });
    };

    const handleCustomActionsChange = (content: string) => {
        onPropertyChange('customActionsContent', content);
    };

    const handleContextLinkChange = (contextId: string, link: string) => {
        const updatedContexts = data.contexts.map((context) => 
            context.id === contextId ? { ...context, link } : context
        );
        onPropertyChange('contexts', updatedContexts);
    };

    const handleArtefactLinkChange = (artefactId: string, link: string) => {
        const updatedArtefacts = data.artefacts.map((art) => 
            art.id === artefactId ? { ...art, link } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleArtefactStatusChange = (artefactId: string, status: TemplateArtefact['status']) => {
        const updatedArtefacts = data.artefacts.map((art) => 
            art.id === artefactId 
                ? { ...art, status, isOutput: status !== 'approved' ? false : art.isOutput } 
                : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleArtefactOutputToggle = (artefactId: string) => {
        const updatedArtefacts = data.artefacts.map((art) => 
            art.id === artefactId ? { ...art, isOutput: !art.isOutput } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    };

    // Derived state - React Compiler handles optimization
    const groupedActions = data.actions.reduce<Record<string, TemplateAction[]>>((accumulator, action) => {
        const sectionName = action.section || 'General';
        if (!accumulator[sectionName]) {
            accumulator[sectionName] = [];
        }
        accumulator[sectionName].push(action);
        return accumulator;
    }, {});

    const isAllDone = data.status === 'done';

    const isContextDone = (!data.contexts || data.contexts.length === 0) 
        ? false 
        : data.contexts.every(ctx => !!ctx.link && ctx.link.trim() !== "");

    const isArtefactsDone = (!data.artefacts || data.artefacts.length === 0) 
        ? false 
        : data.artefacts.length > 0;

    return {
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
    };
};
