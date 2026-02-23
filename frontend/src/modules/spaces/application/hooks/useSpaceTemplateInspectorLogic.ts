// frontend/src/modules/spaces/application/hooks/useSpaceTemplateInspectorLogic.ts

import { useCallback, useMemo } from "react";
import { SpaceTemplateDomainData, TemplateAction } from "../../domain/types";

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

    return {
        handleActionToggle,
        handleCustomActionsChange,
        groupedActions,
        isAllDone,
    };
};
