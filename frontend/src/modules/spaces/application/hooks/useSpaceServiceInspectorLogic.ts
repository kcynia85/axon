// frontend/src/modules/spaces/application/hooks/useSpaceServiceInspectorLogic.ts

import { useCallback, useMemo } from "react";
import { SpaceServiceDomainData, TemplateArtefact } from "../../domain/types";

export const useSpaceServiceInspectorLogic = (
    data: SpaceServiceDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const handleContextLinkChange = useCallback((contextId: string, link: string) => {
        const updatedContexts = data.contexts?.map((context) =>
            context.id === contextId ? { ...context, link } : context
        ) || [];
        onPropertyChange('contexts', updatedContexts);
    }, [data.contexts, onPropertyChange]);

    const handleArtefactLinkChange = useCallback((artefactId: string, link: string) => {
        const updatedArtefacts = data.artefacts?.map((art) =>
            art.id === artefactId ? { ...art, link } : art
        ) || [];
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleArtefactStatusChange = useCallback((artefactId: string, status: TemplateArtefact['status']) => {
        const updatedArtefacts = data.artefacts?.map((art) =>
            art.id === artefactId
                ? { ...art, status, isOutput: status !== 'approved' ? false : art.isOutput }
                : art
        ) || [];
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleArtefactOutputToggle = useCallback((artefactId: string) => {
        const updatedArtefacts = data.artefacts?.map((art) =>
            art.id === artefactId ? { ...art, isOutput: !art.isOutput } : art
        ) || [];
        onPropertyChange('artefacts', updatedArtefacts);
    }, [data.artefacts, onPropertyChange]);

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
        handleContextLinkChange,
        handleArtefactLinkChange,
        handleArtefactStatusChange,
        handleArtefactOutputToggle,
        isContextDone,
        isArtefactsDone,
    };
};
