// frontend/src/modules/spaces/application/hooks/useSpaceAutomationInspectorLogic.ts

import { useCallback, useMemo, useState } from "react";
import { SpaceAutomationDomainData, TemplateAction, TemplateArtefact } from "../../domain/types";

export const useSpaceAutomationInspectorLogic = (
    data: SpaceAutomationDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const [isTriggering, setIsTriggering] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [hasTimeoutError, setHasTimeoutError] = useState(false);

    const handleActionToggle = useCallback((actionId: string) => {
        const updatedActions = (data.actions || []).map((action) =>
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
        setValidationError(null); // Clear error on change
        const updatedContexts = (data.contexts || []).map((context) =>
            context.id === contextId ? { ...context, link, sourceNodeLabel: undefined, sourceArtifactLabel: undefined } : context
        );
        onPropertyChange('contexts', updatedContexts);
    }, [data.contexts, onPropertyChange]);

    const handleLinkContextFromNode = useCallback((contextId: string, nodeLabel: string, artifactLabel: string) => {
        setValidationError(null);
        const updatedContexts = (data.contexts || []).map((context) =>
            context.id === contextId
                ? { ...context, link: undefined, sourceNodeLabel: nodeLabel, sourceArtifactLabel: artifactLabel }
                : context
        );
        onPropertyChange('contexts', updatedContexts);
    }, [data.contexts, onPropertyChange]);

    const handleArtefactLinkChange = useCallback((artefactId: string, link: string) => {
        const updatedArtefacts = (data.artefacts || []).map((art) =>
            art.id === artefactId ? { ...art, link } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleArtefactStatusChange = useCallback((artefactId: string, status: TemplateArtefact['status']) => {
        const updatedArtefacts = (data.artefacts || []).map((art) =>
            art.id === artefactId
                ? { ...art, status, isOutput: status !== 'approved' ? false : art.isOutput }
                : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleArtefactOutputToggle = useCallback((artefactId: string) => {
        const updatedArtefacts = (data.artefacts || []).map((art) =>
            art.id === artefactId ? { ...art, isOutput: !art.isOutput } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleDeleteArtefact = useCallback((artefactId: string) => {
        const updatedArtefacts = (data.artefacts || []).filter((art) => art.id !== artefactId);
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleAddArtefact = useCallback(() => {
        const newArtefact: TemplateArtefact = {
            id: crypto.randomUUID(),
            label: "Manual Result.json",
            link: "",
            status: 'in_review',
            isOutput: false
        };
        const updatedArtefacts = [...(data.artefacts || []), newArtefact];
        onPropertyChange('artefacts', updatedArtefacts);
        setHasTimeoutError(false); // Clear error if user takes manual action
    }, [data.artefacts, onPropertyChange]);

    // Logic for tab completion indicators
    const isContextDone = useMemo(() => {
        if (!data.contexts || data.contexts.length === 0) return true; // No context needed
        return data.contexts.every(ctx =>
            (!!ctx.link && ctx.link.trim() !== "") || (!!ctx.sourceNodeLabel)
        );
    }, [data.contexts]);

    const handleTriggerWorkflow = useCallback(() => {
        if (!isContextDone) {
            setValidationError("Proszę uzupełnić wszystkie linki w zakładce Context przed uruchomieniem.");
            return;
        }

        setValidationError(null);
        setHasTimeoutError(false);
        setIsTriggering(true);

        // Simulating n8n response delay
        setTimeout(() => {
            // 50% chance to simulate timeout
            const isTimeout = Math.random() > 0.5;

            if (isTimeout) {
                setHasTimeoutError(true);
                setIsTriggering(false);
                return;
            }

            const newArtefact: TemplateArtefact = {
                id: crypto.randomUUID(),
                label: `automation_output_${new Date().getTime()}.json`,
                link: "https://n8n.io/workflows/demo",
                status: 'in_review',
                isOutput: false
            };

            const updatedArtefacts = [...(data.artefacts || []), newArtefact];

            onPropertyChange({
                artefacts: updatedArtefacts,
                state: 'completed'
            });

            setIsTriggering(false);
        }, 2000);
    }, [data.artefacts, isContextDone, onPropertyChange]);

    const groupedActions = useMemo(() => {
        return (data.actions || []).reduce<Record<string, TemplateAction[]>>((accumulator, action) => {
            const sectionName = action.section || 'General';
            if (!accumulator[sectionName]) {
                accumulator[sectionName] = [];
            }
            accumulator[sectionName].push(action);
            return accumulator;
        }, {});
    }, [data.actions]);

    const isAllDone = data.state === 'done';

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
        handleLinkContextFromNode,
        handleArtefactLinkChange,
        handleArtefactStatusChange,
        handleArtefactOutputToggle,
        handleDeleteArtefact,
        handleTriggerWorkflow,
        handleAddArtefact,
        isTriggering,
        validationError,
        hasTimeoutError,
        groupedActions,
        isAllDone,
        isContextDone,
        isArtefactsDone,
    };
};
