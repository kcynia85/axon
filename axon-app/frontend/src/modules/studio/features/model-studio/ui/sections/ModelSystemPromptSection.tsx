import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { ModelFormData } from "../../types/model-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";
import { FormItemField } from "@/shared/ui/form/FormItemField";

export const ModelSystemPromptSection = () => {
    const { control } = useFormContext<ModelFormData>();

    return (
        <FormSection 
            id="system-prompt" 
            number={4} 
            title="Globalne Instrukcje (System Prompt)"
            description="Zdefiniuj bazowe zachowanie modelu dla wszystkich konwersacji."
        >
            <div className="space-y-12 max-w-4xl">
                <FormItemField 
                    label="Domyślny System Prompt"
                    hint="Instrukcje te zostaną dołączone do każdego zapytania wysyłanego do tego modelu."
                >
                    <Controller
                        control={control}
                        name="system_prompt"
                        render={({ field }) => (
                            <FormTextarea
                                {...field}
                                placeholder="Zawsze używaj formatowania Markdown..."
                                className="min-h-[200px] bg-zinc-900/50 border-zinc-800 rounded-2xl p-4 text-base resize-y"
                            />
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};