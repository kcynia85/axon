import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import type { MetaAgentStudioData } from "../../../types/meta-agent-schema";

export const InworldAISettingsView = () => {
    const { control, formState: { errors } } = useFormContext<MetaAgentStudioData>();
    const configErrors = errors.provider_config as Record<string, any> | undefined;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FormItemField 
                label="Character ID" 
                error={configErrors?.character_id?.message}
                hint="The unique ID of the Inworld AI character."
            >
                <Controller
                    control={control}
                    name="provider_config.character_id"
                    render={({ field }) => (
                        <FormTextField
                            {...field}
                            value={field.value || ""}
                            placeholder="Enter Character ID"
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>

            <FormItemField 
                label="Scene ID (Optional)" 
                error={configErrors?.scene_id?.message}
                hint="Optional scene configuration ID to place the character in."
            >
                <Controller
                    control={control}
                    name="provider_config.scene_id"
                    render={({ field }) => (
                        <FormTextField
                            {...field}
                            value={field.value || ""}
                            placeholder="Enter Scene ID (Optional)"
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>
        </div>
    );
};
