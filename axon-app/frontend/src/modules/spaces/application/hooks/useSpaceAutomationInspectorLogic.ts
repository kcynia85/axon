// frontend/src/modules/spaces/application/hooks/useSpaceAutomationInspectorLogic.ts

import { useState } from "react";
import { SpaceAutomationDomainData, TemplateAction, TemplateArtefact } from "../../domain/types";

export const useSpaceAutomationInspectorLogic = (
    data: SpaceAutomationDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const [isTriggering, setIsTriggering] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [hasTimeoutError, setHasTimeoutError] = useState(false);

    const handleActionToggle = (actionId: string) => {
        const updatedActions = (data.actions || []).map((action) =>
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
        setValidationError(null); // Clear error on change
        const updatedContexts = (data.contexts || []).map((context) =>
            context.id === contextId ? { ...context, link, sourceNodeLabel: undefined, sourceArtifactLabel: undefined } : context
        );
        onPropertyChange('contexts', updatedContexts);
    };

    const handleLinkContextFromNode = (contextId: string, nodeLabel: string, artifactLabel: string) => {
        setValidationError(null);
        const updatedContexts = (data.contexts || []).map((context) =>
            context.id === contextId
                ? { ...context, link: undefined, sourceNodeLabel: nodeLabel, sourceArtifactLabel: artifactLabel }
                : context
        );
        onPropertyChange('contexts', updatedContexts);
    };

    const handleArtefactLinkChange = (artefactId: string, link: string) => {
        const updatedArtefacts = (data.artefacts || []).map((art) =>
            art.id === artefactId ? { ...art, link } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleArtefactStatusChange = (artefactId: string, status: TemplateArtefact['status']) => {
        const updatedArtefacts = (data.artefacts || []).map((art) =>
            art.id === artefactId
                ? { ...art, status, isOutput: status !== 'approved' ? false : art.isOutput }
                : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleArtefactOutputToggle = (artefactId: string) => {
        const updatedArtefacts = (data.artefacts || []).map((art) =>
            art.id === artefactId ? { ...art, isOutput: !art.isOutput } : art
        );
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleDeleteArtefact = (artefactId: string) => {
        const updatedArtefacts = (data.artefacts || []).filter((art) => art.id !== artefactId);
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleAddArtefact = () => {
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
    };

    // Logic for tab completion indicators
    // Derived state - React Compiler handles optimization
    const isContextDone = (!data.contexts || data.contexts.length === 0) 
        ? true 
        : data.contexts.every(ctx => (!!ctx.link && ctx.link.trim() !== "") || (!!ctx.sourceNodeLabel));

    const handleTriggerWorkflow = () => {
        if (!isContextDone) {
            setValidationError("Proszę uzupełnić wszystkie linki w zakładce Context przed uruchomieniem.");
            return;
        }

        setValidationError(null);
        setHasTimeoutError(false);
        setIsTriggering(true);

        // Simulating n8n response delay
        setTimeout(() => {
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
    };

    const groupedActions = (data.actions || []).reduce<Record<string, TemplateAction[]>>((accumulator, action) => {
        const sectionName = action.section || 'General';
        if (!accumulator[sectionName]) {
            accumulator[sectionName] = [];
        }
        accumulator[sectionName].push(action);
        return accumulator;
    }, {});

    const isAllDone = data.state === 'done';

    const isArtefactsDone = (!data.artefacts || data.artefacts.length === 0) 
        ? false 
        : data.artefacts.every(art => !!art.link && art.link.trim() !== "" && art.status === 'approved');

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
