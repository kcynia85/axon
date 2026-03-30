import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { ModelFormData } from "../../types/model-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSlider } from "@/shared/ui/form/FormSlider";
import { Activity } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { ModelSanityCheck } from "../components/ModelSanityCheck";

const REASONING_OPTIONS = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
];

interface ModelParametersSectionProps {
    modelId?: string;
    onToggleSanity?: () => void;
    isSanityOpen?: boolean;
}

export const ModelParametersSection = () => {
    const { control, formState: { errors } } = useFormContext<ModelFormData>();

    return (
        <FormSection 
            id="parameters" 
            number={2} 
            title="Parametry Dostawcy (Schema-Driven)"
            description="Konfiguracja parametrów wykonawczych modelu."
        >
            <div className="space-y-12 max-w-4xl">
                {/* Reasoning Effort */}
                <FormItemField 
                    label="Reasoning Effort" 
                    error={errors.reasoning_effort?.message}
                    hint="Poziom wysiłku obliczeniowego dla modeli typu 'Reasoning' (np. o1, r1)."
                >
                    <Controller
                        control={control}
                        name="reasoning_effort"
                        render={({ field }) => (
                            <div className="grid grid-cols-1 gap-4">
                                {REASONING_OPTIONS.map((opt) => (
                                    <FormRadio
                                        key={opt.value}
                                        title={opt.label}
                                        checked={field.value === opt.value}
                                        onChange={() => field.onChange(opt.value)}
                                    />
                                ))}
                            </div>
                        )}
                    />
                </FormItemField>

                <div className="space-y-12 pt-6 border-t border-zinc-900/50">
                    {/* Temperature */}
                    <FormItemField 
                        label="Temperature" 
                        error={errors.temperature?.message}
                        hint="Kontroluje losowość odpowiedzi. 0 = deterministyczna, 2 = bardzo kreatywna."
                    >
                        <Controller
                            control={control}
                            name="temperature"
                            render={({ field }) => (
                                <FormSlider
                                    value={field.value}
                                    onChange={field.onChange}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                    labelLeft="PRECISE"
                                    labelRight="CREATIVE"
                                />
                            )}
                        />
                    </FormItemField>

                    {/* Top P */}
                    <FormItemField 
                        label="Top P" 
                        error={errors.top_p?.message}
                        hint="Nucleus sampling. Wybiera tokeny stanowiące top P masy prawdopodobieństwa."
                    >
                        <Controller
                            control={control}
                            name="top_p"
                            render={({ field }) => (
                                <FormSlider
                                    value={field.value}
                                    onChange={field.onChange}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    labelLeft="FOCUSED"
                                    labelRight="DIVERSE"
                                />
                            )}
                        />
                    </FormItemField>
                </div>

                {/* Max Completion Tokens */}
                <div className="pt-6 border-t border-zinc-900/50">
                    <FormItemField 
                        label="Max Completion Tokens" 
                        error={errors.max_completion_tokens?.message}
                        hint="Limit tokenów dla wygenerowanej odpowiedzi (Output Limit)."
                    >
                        <Controller
                            control={control}
                            name="max_completion_tokens"
                            render={({ field }) => (
                                <FormTextField
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                                    className="h-14 px-4 bg-zinc-900/50 border-zinc-800 text-lg rounded-xl font-mono"
                                />
                            )}
                        />
                    </FormItemField>
                </div>
            </div>
        </FormSection>
    );
};