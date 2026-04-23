import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import type { MetaAgentStudioData } from "../../../types/meta-agent-schema";

export const CartesiaSettingsView = () => {
    const { control, formState: { errors } } = useFormContext<MetaAgentStudioData>();
    const configErrors = errors.provider_config as Record<string, any> | undefined;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FormItemField 
                label="Voice ID" 
                error={configErrors?.voice_id?.message}
                hint="The Cartesia Voice ID."
            >
                <Controller
                    control={control}
                    name="provider_config.voice_id"
                    render={({ field }) => (
                        <FormTextField
                            {...field}
                            value={field.value || ""}
                            placeholder="Enter Cartesia Voice ID"
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>

            <FormItemField 
                label="Model ID" 
                error={configErrors?.model_id?.message}
                hint="The model version to use (e.g. sonic-english)."
            >
                <Controller
                    control={control}
                    name="provider_config.model_id"
                    render={({ field }) => (
                        <FormTextField
                            {...field}
                            value={field.value || "sonic-english"}
                            placeholder="e.g. sonic-english"
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>
        </div>
    );
};
