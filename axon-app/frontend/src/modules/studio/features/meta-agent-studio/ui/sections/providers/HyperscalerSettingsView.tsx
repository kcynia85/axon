import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import type { MetaAgentStudioData } from "../../../types/meta-agent-schema";

export const HyperscalerSettingsView = () => {
    const { control, formState: { errors } } = useFormContext<MetaAgentStudioData>();
    const configErrors = errors.provider_config as Record<string, any> | undefined;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FormItemField 
                label="Voice Name / ID" 
                error={configErrors?.voice_id?.message}
                hint="The voice name from the provider (e.g. en-US-AriaNeural)."
            >
                <Controller
                    control={control}
                    name="provider_config.voice_id"
                    render={({ field }) => (
                        <FormTextField
                            {...field}
                            value={field.value || ""}
                            placeholder="Enter Voice Name"
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>

            <FormItemField 
                label="Language Code" 
                error={configErrors?.language_code?.message}
                hint="The standard BCP-47 language code (e.g. en-US)."
            >
                <Controller
                    control={control}
                    name="provider_config.language_code"
                    render={({ field }) => (
                        <FormTextField
                            {...field}
                            value={field.value || "en-US"}
                            placeholder="e.g. en-US"
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>
            
            {/* Amazon Polly specific engine setting - safe to include as a conditional pure view based on provider, but for simplicity we render it if they want to override engine */}
            <FormItemField 
                label="Engine (Amazon Polly Only)" 
                error={configErrors?.engine?.message}
                hint="The engine to use (neural, standard, generative)."
            >
                <Controller
                    control={control}
                    name="provider_config.engine"
                    render={({ field }) => (
                        <FormTextField
                            {...field}
                            value={field.value || ""}
                            placeholder="e.g. neural"
                            className="bg-zinc-900/50 border-zinc-800 text-lg rounded-xl h-12 px-4"
                        />
                    )}
                />
            </FormItemField>
        </div>
    );
};
