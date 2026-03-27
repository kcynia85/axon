"use client";

import React, { useCallback, useRef, useState, useMemo } from "react";
import { ProviderStudioProps } from "../types/provider-studio.types";
import { ProviderStudioView } from "./ProviderStudioView";
import { useProviderForm } from "../application/hooks/useProviderForm";
import { PROVIDER_STUDIO_SECTIONS, ProviderStudioSectionId } from "../types/sections.constants";
import { useProviderStudioSectionNav } from "../application/hooks/useProviderStudioSectionNav";

export const ProviderStudio = ({
    initialData,
    onSave,
    onCancel,
    isSaving = false
}: ProviderStudioProps) => {
    const form = useProviderForm(initialData);
    const [activeSection, setActiveSection] = useState<ProviderStudioSectionId>("auth");
    const canvasContainerRef = useRef<HTMLElement | null>(null);

    const { items: navigationItems } = useProviderStudioSectionNav({
        sections: PROVIDER_STUDIO_SECTIONS,
        activeSection,
        form
    });

    const handleSectionClick = useCallback((sectionId: ProviderStudioSectionId) => {
        const element = document.getElementById(sectionId);
        if (element && canvasContainerRef.current) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(sectionId);
        }
    }, []);

    const setCanvasContainerReference = useCallback((node: HTMLElement | null) => {
        canvasContainerRef.current = node;
    }, []);

    const handleOnSave = form.handleSubmit((data) => {
        onSave(data);
    });

    return (
        <ProviderStudioView
            form={form}
            navigationItems={navigationItems}
            activeSectionIdentifier={activeSection}
            onSectionClick={handleSectionClick}
            onSave={handleOnSave}
            onCancel={onCancel}
            isSaving={isSaving}
            setCanvasContainerReference={setCanvasContainerReference}
        />
    );
};
