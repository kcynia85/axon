"use client";

import React, { useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { ModelFormData } from "../../types/model-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { useLLMProviders, useAvailableModels } from "@/modules/settings/application/useLLMProviders";
import { ChevronDown, Plus, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { OpenRouterMarketplace } from "../components/OpenRouterMarketplace";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { Badge } from "@/shared/ui/ui/Badge";

interface ModelIdentitySectionProps {
    readonly modelId?: string;
    readonly onToggleSanity?: () => void;
    readonly isSanityOpen?: boolean;
}

interface MarketModelData {
    readonly id: string;
    readonly name: string;
    readonly context_window?: number;
    readonly pricing_input?: number;
    readonly pricing_output?: number;
    readonly description?: string;
}

/**
 * ModelIdentitySection: Configuration for LLM provider and specific model identification.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const ModelIdentitySection = ({ modelId }: ModelIdentitySectionProps) => {
    const { control, setValue, formState: { errors } } = useFormContext<ModelFormData>();
    const { data: providers = [] } = useLLMProviders();
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

    // Use useWatch for reliable re-renders when provider_id changes
    const selectedProviderId = useWatch({ control, name: "provider_id" });
    const currentModelId = useWatch({ control, name: "model_id" });

    // Fetch available models for the selected provider
    const { data: availableModels = [], isLoading: isLoadingModels } = useAvailableModels(selectedProviderId);

    // Zero manual optimization - React Compiler handles it
    const providerOptions = providers.map(provider => ({
        id: provider.id,
        name: provider.provider_name
    }));
    
    const selectedProvider = providers.find(provider => provider.id === selectedProviderId);
    const selectedProviderName = selectedProvider?.provider_name?.toLowerCase() || "";
    const isOpenRouter = selectedProviderName.includes("openrouter");
    
    const modelOptions = availableModels.map(model => ({
        id: model.id,
        name: model.name
    }));

    const handleModelSelect = (modelData: MarketModelData) => {
        setValue("model_id", modelData.id);
        
        const isReasoning = modelData.id.includes("o1") || modelData.id.includes("r1") || modelData.id.includes("405b") || (modelData.description?.toLowerCase().includes("reasoning"));

        if (isOpenRouter) {
            const parts = modelData.id.split('/');
            const providerPrefix = parts.length > 1 ? parts[0] : "";
            setValue("alias_name", providerPrefix ? `${providerPrefix.charAt(0).toUpperCase() + providerPrefix.slice(1)} ${modelData.name}` : modelData.name);
        } else {
            setValue("alias_name", modelData.name);
        }

        setValue("max_completion_tokens", modelData.context_window || 0, { shouldValidate: true, shouldDirty: true });
        setValue("pricing_input", modelData.pricing_input || 0, { shouldValidate: true, shouldDirty: true });
        setValue("pricing_output", modelData.pricing_output || 0, { shouldValidate: true, shouldDirty: true });
        
        if (isReasoning) {
            setValue("reasoning_effort", "Medium");
        }
        
        setIsMarketplaceOpen(false);
    };

    return (
        <FormSection 
            id="identity" 
            number={1} 
            title="Tożsamość"
            description="Zdefiniuj podstawową tożsamość modelu oraz jego powiązanie z dostawcą."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                {/* Wybierz Dostawcę */}
                <FormItemField label="Wybierz Dostawcę" error={errors.provider_id?.message}>
                    <Controller
                        control={control}
                        name="provider_id"
                        render={({ field }) => (
                            <FormSelect
                                options={providerOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Wybierz dostawcę..."
                                renderTrigger={(selectedProviderItems) => (
                                    <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                        <span className={cn(
                                            "text-lg font-bold transition-colors flex-1 text-left",
                                            selectedProviderItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                        )}>
                                            {selectedProviderItems.length > 0 ? selectedProviderItems[0].name : "Wybierz dostawcę..."}
                                        </span>
                                        <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                    </div>
                                )}
                            />
                        )}
                    />
                </FormItemField>

                {/* Search Bar + Select (Model ID) OR OpenRouter Marketplace - Styled like Tools Section */}
                {isOpenRouter ? (
                    <div className="space-y-6 pt-6 border-t border-zinc-900">
                        <div className="flex justify-between items-center">
                            <FormSubheading>Model Identifier</FormSubheading>
                            <Badge
                                variant="outline"
                                className="text-[10px] font-mono uppercase tracking-widest border-primary/20 text-primary bg-primary/5 shadow-none"
                            >
                                OpenRouter Marketplace
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {currentModelId ? (
                                <FormCheckbox
                                    title={currentModelId}
                                    description="Model zainstalowany z OpenRouter Marketplace."
                                    checked={true}
                                    hideCheckbox={true}
                                    onChange={() => {
                                        setValue("model_id", "");
                                        setValue("alias_name", "");
                                    }}
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsMarketplaceOpen(true)}
                                    className="w-full text-left p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all flex flex-col items-center justify-center gap-3 group shadow-sm outline-none cursor-pointer"
                                >
                                    <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div className="text-center">
                                        <span className="font-bold text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors text-lg block">
                                            Select model from marketplace
                                        </span>
                                        <span className="text-sm text-zinc-400 font-mono uppercase tracking-widest mt-1 block">
                                            Katalog modeli od Meta-Dostawcy
                                        </span>
                                    </div>
                                </button>
                            )}

                            <OpenRouterMarketplace 
                                isOpen={isMarketplaceOpen}
                                onOpenChange={setIsMarketplaceOpen}
                                onSelect={handleModelSelect}
                                installedModelId={currentModelId}
                                models={availableModels}
                                isLoading={isLoadingModels}
                            />
                        </div>
                    </div>
                ) : (
                    <FormItemField 
                        label="Identifier" 
                        error={errors.model_id?.message}
                    >
                        <Controller
                            control={control}
                            name="model_id"
                            render={({ field }) => (
                                <FormSelect
                                    options={modelOptions}
                                    value={field.value}
                                    onChange={(selectedValue) => {
                                        field.onChange(selectedValue);
                                        const modelData = availableModels.find(model => model.id === selectedValue);
                                        if (modelData) {
                                            handleModelSelect(modelData as MarketModelData);
                                        }
                                    }}
                                    placeholder={isLoadingModels ? "Ładowanie modeli..." : "Szukaj np. turbo..."}
                                    renderTrigger={(selectedModelItems) => (
                                        <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                            <span className={cn(
                                                "text-lg font-mono transition-colors flex-1 text-left",
                                                selectedModelItems.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                            )}>
                                                {isLoadingModels ? "Ładowanie..." : (selectedModelItems.length > 0 ? selectedModelItems[0].name : "Szukaj np. turbo...")}
                                            </span>
                                            {isLoadingModels ? <Loader2 className="w-5 h-5 animate-spin text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />}
                                        </div>
                                    )}
                                />
                            )}
                        />
                    </FormItemField>
                )}

                {/* Alias Name */}
                <FormItemField label="Alias Name" error={errors.alias_name?.message}>
                    <Controller
                        control={control}
                        name="alias_name"
                        render={({ field }) => (
                            <FormTextField
                                {...field}
                                placeholder="e.g. Production GPT-4o"
                                className="h-14 px-4 bg-zinc-900/50 border-zinc-800 text-lg rounded-xl"
                            />
                        )}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
