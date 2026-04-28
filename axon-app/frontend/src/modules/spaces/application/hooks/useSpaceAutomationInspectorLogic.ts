import { useState } from "react";
import { useParams } from "next/navigation";
import { useTestAutomation, useAutomations } from "@/modules/workspaces/application/useAutomations";
import { toast } from "sonner";
import { SpaceAutomationDomainData, TemplateAction, TemplateArtefact } from "../../domain/types";

export const useSpaceAutomationInspectorLogic = (
    data: SpaceAutomationDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const params = useParams<{ id: string, workspace: string }>();

    // Priority: 1. data.workspaceId, 2. data.availability_workspace[0], 3. params.workspace, 4. fallback to global
    const contextWorkspaceId = data.workspaceId || 
                             (Array.isArray((data as any).availability_workspace) ? (data as any).availability_workspace[0] : null) || 
                             params.workspace || 
                             "global";

    console.log("Automation Context Workspace ID:", contextWorkspaceId);

    // Fallback: Fetch all automations in this context to hydrate potentially stale canvas nodes
    const { data: automations = [] } = useAutomations(contextWorkspaceId);

    console.log("Inspector: automations found:", automations.length, "in", contextWorkspaceId);
    if (automations.length > 0) {
        console.log("Inspector: looking for", { id: data.id, label: data.label });
        console.log("Inspector: sample from list:", automations[0]);
    }

    // Find the live data for this automation
    const liveAutomation = automations.find(a => 
        a.id === data.id || 
        a.automation_name.trim().toLowerCase() === (data.label || "").trim().toLowerCase()
    );

    if (liveAutomation) {
        console.log("Inspector: MATCH FOUND!", liveAutomation.automation_webhook_url);
    }

    const [isTriggering, setIsTriggering] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [hasTimeoutError, setHasTimeoutError] = useState(false);

    // We use the same context workspace for the test execution
    const { mutateAsync: executeTest } = useTestAutomation(contextWorkspaceId);

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
    const isContextDone = (!data.contexts || data.contexts.length === 0) 
        ? true 
        : data.contexts.every(ctx => (!!ctx.link && ctx.link.trim() !== "") || (!!ctx.sourceNodeLabel));

    const handleTriggerWorkflow = async () => {
        console.log("Inspector: handleTriggerWorkflow CALLED");
        if (!isContextDone) {
            console.log("Inspector: Context not done, returning");
            setValidationError("Proszę uzupełnić wszystkie linki w zakładce Context przed uruchomieniem.");
            return;
        }

        // Use live data if canvas node data is stale (e.g. from history)
        const targetUrl = data.webhook_url || liveAutomation?.automation_webhook_url;
        const targetMethod = data.http_method || liveAutomation?.automation_http_method || "POST";
        const targetProviderId = data.automation_provider_id || liveAutomation?.automation_provider_id || null;
        const targetAuth = data.auth_config || liveAutomation?.automation_auth_config || null;

        console.log("Inspector: Target config identified:", { targetUrl, targetMethod, targetProviderId });

        if (!targetUrl) {
            console.log("Inspector: No targetUrl, returning");
            setValidationError("Automatyzacja nie ma skonfigurowanego adresu URL (Webhook). Edytuj węzeł w Automation Studio.");
            return;
        }

        setValidationError(null);
        setHasTimeoutError(false);
        setIsTriggering(true);
        console.log("Inspector: isTriggering set to true");

        try {
            console.log("Inspector: Preparing inputs...");
            const inputs = (data.contexts || []).reduce((acc, ctx) => ({
                ...acc,
                [ctx.id]: ctx.link || ctx.sourceNodeLabel || "Empty"
            }), {});

            console.log("Inspector: Inputs prepared:", inputs);
            console.log("Inspector: Sending test request to backend...");
            
            const result = await executeTest({
                automation_webhook_url: targetUrl,
                automation_http_method: targetMethod,
                automation_provider_id: targetProviderId,
                automation_auth_config: targetProviderId ? null : targetAuth,
                test_inputs: inputs
            });

            console.log("Inspector: Test result received:", result);

            if (result.success) {
                const responseData = result.data;
                const formattedContent = typeof responseData === 'object' 
                    ? JSON.stringify(responseData, null, 2) 
                    : String(responseData || "Empty response body");

                const newArtefact: TemplateArtefact = {
                    id: crypto.randomUUID(),
                    label: `automation_output_${new Date().getTime()}.json`,
                    link: "Result available in Data Preview",
                    content: formattedContent,
                    status: 'in_review',
                    isOutput: true
                };

                const updatedArtefacts = [...(data.artefacts || []), newArtefact];

                onPropertyChange({
                    artefacts: updatedArtefacts,
                    state: 'completed'
                });
                
                toast.success("Automatyzacja wykonana pomyślnie.");
            } else {
                setHasTimeoutError(true);
                toast.error(`Błąd wykonania: ${result.message || result.statusText}`);
            }
        } catch (error: any) {
            console.error("Inspector: Test execution FAILED", error);
            setHasTimeoutError(true);
            toast.error("Błąd sieci podczas łączenia z automatyzacją.");
        } finally {
            setIsTriggering(false);
        }
    };

    const groupedActions = (data.actions || []).reduce<Record<string, TemplateAction[]>>((accumulator, action) => {
        const sectionName = action.section || 'General';
        if (!accumulator[sectionName]) {
            accumulator[sectionName] = [];
        }
        accumulator[sectionName].push(action);
        return accumulator;
    }, {});

    const isAllDone = data.state === 'completed' || data.state === 'done';
    const isArtefactsDone = (data.artefacts || []).some(art => art.isOutput);

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
