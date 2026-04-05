// frontend/src/modules/spaces/application/hooks/useSpaceServiceInspectorLogic.ts

import { SpaceServiceDomainData, TemplateArtefact } from "../../domain/types";

export const useSpaceServiceInspectorLogic = (
    data: SpaceServiceDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const handleContextLinkChange = (contextId: string, link: string) => {
        const updatedContexts = data.contexts?.map((context) =>
            context.id === contextId ? { ...context, link, sourceNodeLabel: undefined, sourceArtifactLabel: undefined } : context
        ) || [];
        onPropertyChange('contexts', updatedContexts);
    };

    const handleLinkContextFromNode = (contextId: string, nodeLabel: string, artifactLabel: string) => {
        const updatedContexts = data.contexts?.map((context) =>
            context.id === contextId 
                ? { ...context, link: `node://${nodeLabel}/${artifactLabel}`, sourceNodeLabel: nodeLabel, sourceArtifactLabel: artifactLabel } 
                : context
        ) || [];
        onPropertyChange('contexts', updatedContexts);
    };

    const handleArtefactLinkChange = (artefactId: string, link: string) => {
        const updatedArtefacts = data.artefacts?.map((art) =>
            art.id === artefactId ? { ...art, link } : art
        ) || [];
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleArtefactStatusChange = (artefactId: string, status: TemplateArtefact['status']) => {
        const updatedArtefacts = data.artefacts?.map((art) =>
            art.id === artefactId
                ? { ...art, status, isOutput: status !== 'approved' ? false : art.isOutput }
                : art
        ) || [];
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleArtefactOutputToggle = (artefactId: string) => {
        const updatedArtefacts = data.artefacts?.map((art) =>
            art.id === artefactId ? { ...art, isOutput: !art.isOutput } : art
        ) || [];
        onPropertyChange('artefacts', updatedArtefacts);
    };

    // Derived state - React Compiler handles optimization
    const isContextDone = (!data.contexts || data.contexts.length === 0) 
        ? false 
        : data.contexts.every(ctx => !!ctx.link && ctx.link.trim() !== "");

    const isArtefactsDone = (!data.artefacts || data.artefacts.length === 0) 
        ? false 
        : data.artefacts.every(art => art.status === 'approved');

    const handleAddArtefact = () => {
        const newArtefact: TemplateArtefact = {
            id: `art-${Date.now()}`,
            label: 'New Artefact',
            status: 'in_review',
            isOutput: false,
        };
        const updatedArtefacts = [...(data.artefacts || []), newArtefact];
        onPropertyChange('artefacts', updatedArtefacts);
    };

    const handleCapabilityChange = (value: string) => {
        onPropertyChange('capabilities', [value]);
    };

    const handleAttachedLabelChange = (artefactId: string, value: string) => {
        const updatedArtefacts = data.artefacts?.map((art) =>
            art.id === artefactId ? { ...art, label: value } : art
        ) || [];
        onPropertyChange('artefacts', updatedArtefacts);
    };

    return {
        handleContextLinkChange,
        handleLinkContextFromNode,
        handleArtefactLinkChange,
        handleArtefactStatusChange,
        handleArtefactOutputToggle,
        handleAddArtefact,
        handleCapabilityChange,
        handleAttachedLabelChange,
        isContextDone,
        isArtefactsDone,
    };
};
