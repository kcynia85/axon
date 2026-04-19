"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/shared/ui/ui/Form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormTagInput } from "@/shared/ui/form/FormTagInput";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { ProjectStatus } from "@/modules/projects/domain";

export const IdentitySection = ({ syncDraft }: { syncDraft: () => void }) => {
    const { control } = useFormContext();

    const statusOptions = [
        { id: ProjectStatus.IDEA, name: "Idea", variant: "info" as const },
        { id: ProjectStatus.IN_PROGRESS, name: "In Progress", variant: "warning" as const },
        { id: ProjectStatus.COMPLETED, name: "Completed", variant: "success" as const },
    ];

    return (
        <FormSection id="IDENTITY" number={1} title="Identity" variant="island">
            <div className="space-y-12 w-full">
                <FormField
                    control={control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <FormItemField label="Project Name" error={fieldState.error?.message}>
                            <FormTextField
                                {...field}
                                placeholder="Wprowadź nazwę projektu..."
                                onBlur={syncDraft}
                            />
                        </FormItemField>
                    )}
                />
<FormField
    control={control}
    name="status"
    render={({ field }) => (
        <FormItemField label="Project Status">
            <FormSelect
                options={statusOptions}
                value={field.value}
                onChange={(value) => {
                    field.onChange(value);
                    syncDraft();
                }}
                placeholder="Wybierz status projektu..."
                hideRecent={true}
            />
        </FormItemField>
    )}
/>
                <FormField
                    control={control}
                    name="keywords"
                    render={({ field }) => (
                        <FormItemField label="Keywords">
                            <FormTagInput
                                value={field.value || []}
                                onChange={(value) => {
                                    field.onChange(value);
                                    syncDraft();
                                }}
                                onBlur={syncDraft}
                            />
                        </FormItemField>
                    )}
                />
            </div>
        </FormSection>
    );
};
