// frontend/src/modules/spaces/application/hooks/useSpaceTemplateInspectorLogic.ts

import { useCallback, useMemo } from "react";
import { SpaceTemplateDomainData, TemplateAction, TemplateArtefact } from "../../domain/types";

export const useSpaceTemplateInspectorLogic = (
    data: SpaceTemplateDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const handleActionToggle = useCallback((actionId: string) => {
        const updatedActions = data.actions.map((action) => 
            action.id === actionId ? { ...action, isCompleted: !action.isCompleted } : action
        );
        
        const allCompleted = updatedActions.length > 0 && updatedActions.every((action) => action.isCompleted);
        const newStatus = allCompleted ? 'done' : 'working';

        onPropertyChange({
            actions: updatedActions,
            status: newStatus
        });
    }, [data.actions, onPropertyChange]);

    const handleCustomActionsChange = useCallback((content: string) => {
        onPropertyChange('customActionsContent', content);
    }, [onPropertyChange]);

    const handleContextLinkChange = useCallback((contextId: string, link: string) => {
        const updatedContexts = data.contexts.map((context) => 
            context.id === contextId ? { ...context, link } : context
        );
        onPropertyChange('contexts', updatedContexts);
    }, [data.contexts, onPropertyChange]);

    const handleArtefactLinkChange = useCallback((artefactId: string, link: string) => {
        const updatedArtefacts = data.artefacts.map((art) => 
            art.id === artefactId ? { ...art, link } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleArtefactStatusChange = useCallback((artefactId: string, status: TemplateArtefact['status']) => {
        const updatedArtefacts = data.artefacts.map((art) => 
            art.id === artefactId 
                ? { ...art, status, isOutput: status !== 'approved' ? false : art.isOutput } 
                : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleArtefactOutputToggle = useCallback((artefactId: string) => {
        const updatedArtefacts = data.artefacts.map((art) => 
            art.id === artefactId ? { ...art, isOutput: !art.isOutput } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const groupedActions = useMemo(() => {
        return data.actions.reduce<Record<string, TemplateAction[]>>((accumulator, action) => {
            const sectionName = action.section || 'General';
            if (!accumulator[sectionName]) {
                accumulator[sectionName] = [];
            }
            accumulator[sectionName].push(action);
            return accumulator;
        }, {});
    }, [data.actions]);

    const isAllDone = data.status === 'done';

    // Logic for tab completion indicators
    const isContextDone = useMemo(() => {
        if (!data.contexts || data.contexts.length === 0) return false;
        return data.contexts.every(ctx => !!ctx.link && ctx.link.trim() !== "");
    }, [data.contexts]);

    const isArtefactsDone = useMemo(() => {
        if (!data.artefacts || data.artefacts.length === 0) return false;
        return data.artefacts.every(art => 
            !!art.link && art.link.trim() !== "" && art.status === 'approved'
        );
    }, [data.artefacts]);

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
