"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { ProjectResourcesField } from "@/modules/projects/ui/components/ProjectResourcesField";

export const ResourcesSection = ({ 
    syncDraft,
    linkFields,
    onAppend,
    onRemove
}: { 
    syncDraft: () => void;
    linkFields: any[];
    onAppend: (value: { url: string }) => void;
    onRemove: (index: number) => void;
}) => {
    const form = useFormContext();

    return (
        <FormSection id="RESOURCES" number={2} title="Key Resources" variant="island">
            <div className="w-full" onBlur={syncDraft}>
                <ProjectResourcesField 
                    form={form as any}
                    linkFields={linkFields}
                    onAppend={onAppend}
                    onRemove={onRemove}
                />
            </div>
        </FormSection>
    );
};
