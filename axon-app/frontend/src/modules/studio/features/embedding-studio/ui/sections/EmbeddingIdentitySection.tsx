"use client";

import React, { useState } from "react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useLLMProviders, useAvailableModels } from "@/modules/settings/application/useLLMProviders";
import { ChevronDown, Loader2, Plus, AlertCircle, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { EmbeddingModelStudioValues } from "../../types/embedding-studio.types";
import { Badge } from "@/shared/ui/ui/Badge";
import { OpenRouterEmbeddingMarketplace } from "../components/OpenRouterEmbeddingMarketplace";

interface Props {
    onSyncDraft: () => void;
}

export const EmbeddingIdentitySection = ({ onSyncDraft }: Props) => {
    const { control, setValue, formState: { errors } } = useFormContext<EmbeddingModelStudioValues>();
    const { data: providers = [] } = useLLMProviders();
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

    // Watch provider_id to fetch available models
    const selectedProviderId = useWatch({ control, name: "provider_id" });
    const currentModelId = useWatch({ control, name: "model_id" });
    
    const { data: availableModels = [], isLoading: isLoadingModels } = useAvailableModels(selectedProviderId);

    const providerOptions = React.useMemo(() => {
        return providers.map(p => ({
            id: p.id,
            name: p.provider_name
        }));
    }, [providers]);

    const selectedProvider = providers.find(p => p.id === selectedProviderId);
    const selectedProviderName = selectedProvider?.provider_name?.toLowerCase() || "";
    const isOpenRouter = selectedProviderName.includes("openrouter");
    const isAnthropic = selectedProviderName.includes("anthropic");

    // Filter available models to show only embedding models (heuristic)
    const embeddingModels = React.useMemo(() => {
        return availableModels.filter(m => 
            m.id.toLowerCase().includes("embed") || 
            m.name.toLowerCase().includes("embed")
        );
    }, [availableModels]);

    const modelOptions = React.useMemo(() => {
        return embeddingModels.map(m => ({
            id: m.id,
            name: m.name
        }));
    }, [embeddingModels]);

    const handleProviderChange = (providerId: string) => {
        setValue("provider_id", providerId);
        const provider = providers.find(p => p.id === providerId);
        if (provider) {
            setValue("model_provider_name", provider.provider_name);
        }
        // Reset model selection when provider changes
        setValue("model_id", "");
        onSyncDraft();
    };

    const handleModelSelect = (modelData: any) => {
        const modelId = typeof modelData === 'string' ? modelData : modelData.id;
        const actualModelData = typeof modelData === 'string' 
            ? availableModels.find(m => m.id === modelId) 
            : modelData;

        setValue("model_id", modelId);
        
        if (actualModelData) {
            if (actualModelData.context_window) {
                setValue("model_max_context_tokens", actualModelData.context_window);
            }
            if (actualModelData.pricing_input) {
                setValue("model_cost_per_1m_tokens", actualModelData.pricing_input);
            }
            // Heuristics
            if (modelId.includes("text-embedding-3-small")) setValue("model_vector_dimensions", 1536);
            if (modelId.includes("text-embedding-3-large")) setValue("model_vector_dimensions", 3072);
            if (modelId.includes("text-embedding-ada-002")) setValue("model_vector_dimensions", 1536);
        }
        
        setIsMarketplaceOpen(false);
        onSyncDraft();
    };

    return (
        <FormSection 
            id="identity"
            number={1}
            title="Wybór Dostawcy" 
            description="Skonfiguruj providera dla Twojego modelu embeddingu."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                {/* Wybierz Dostawcę */}
                <FormItemField label="Dostawca" error={errors.provider_id?.message}>
                    <Controller
                        control={control}
                        name="provider_id"
                        render={({ field }) => (
                            <FormSelect
                                options={providerOptions}
                                value={field.value || ""}
                                onChange={handleProviderChange}
                                placeholder="Wybierz dostawcę..."
                                renderTrigger={(selected) => (
                                    <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                        <span className={cn(
                                            "text-lg font-bold transition-colors flex-1 text-left",
                                            selected.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                        )}>
                                            {selected.length > 0 ? selected[0].name : "Wybierz dostawcę..."}
                                        </span>
                                        <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />
                                    </div>
                                )}
                            />
                        )}
                    />
                </FormItemField>

                {/* OpenRouter Marketplace Logic */}
                {isOpenRouter && (
                    <div className="space-y-6 pt-6 border-t border-zinc-900">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500">Embedding Identifier</h4>
                            <Badge
                                variant="outline"
                                className="text-[10px] font-mono uppercase tracking-widest border-primary/20 text-primary bg-primary/5 shadow-none"
                            >
                                OpenRouter Marketplace
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {currentModelId ? (
                                <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white font-mono">{currentModelId}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Model wybrany z Marketplace</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setValue("model_id", "");
                                            onSyncDraft();
                                        }}
                                        className="text-zinc-500 hover:text-white transition-colors p-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
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
                                            Select embedding model from marketplace
                                        </span>
                                        <span className="text-sm text-zinc-400 font-mono uppercase tracking-widest mt-1 block">
                                            Katalog modeli embeddingu od OpenRouter
                                        </span>
                                    </div>
                                </button>
                            )}

                            <OpenRouterEmbeddingMarketplace 
                                isOpen={isMarketplaceOpen}
                                onOpenChange={setIsMarketplaceOpen}
                                onSelect={handleModelSelect}
                                installedModelId={currentModelId}
                                models={availableModels}
                                isLoading={isLoadingModels}
                            />
                        </div>
                    </div>
                )}

                {/* Anthropic Empty State */}
                {isAnthropic && (
                    <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-zinc-200">Brak modeli embeddingu</h4>
                            <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                                Anthropic obecnie nie udostępnia publicznie własnych modeli embeddingu przez API.
                            </p>
                        </div>
                    </div>
                )}

                {/* Normal Select Logic (for other providers) */}
                {selectedProviderId && !isOpenRouter && !isAnthropic && (
                    <FormItemField 
                        label="Identyfikator Modelu (Model ID)" 
                        error={errors.model_id?.message}
                    >
                        {embeddingModels.length > 0 ? (
                            <Controller
                                control={control}
                                name="model_id"
                                render={({ field }) => (
                                    <FormSelect
                                        options={modelOptions}
                                        value={field.value}
                                        onChange={(val) => handleModelSelect(val)}
                                        placeholder={isLoadingModels ? "Ładowanie modeli..." : "Wybierz model embeddingu..."}
                                        renderTrigger={(selected: any) => (
                                            <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                                <span className={cn(
                                                    "text-lg font-mono transition-colors flex-1 text-left",
                                                    selected.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                                )}>
                                                    {isLoadingModels ? "Ładowanie..." : (selected.length > 0 ? selected[0].name : "Wyszukaj lub wybierz model...")}
                                                </span>
                                                {isLoadingModels ? <Loader2 className="w-5 h-5 animate-spin text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600 group-hover/trigger:text-zinc-400" />}
                                            </div>
                                        )}
                                    />
                                )}
                            />
                        ) : (
                            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center gap-3 text-zinc-500 italic">
                                <AlertCircle className="w-5 h-5 opacity-50" />
                                <span>Ten dostawca nie zwrócił żadnych modeli rozpoznanych jako embeddingowe.</span>
                            </div>
                        )}
                    </FormItemField>
                )}

                {/* Manual fallback / Model ID display if no provider selected yet */}
                {!selectedProviderId && (
                    <FormItemField 
                        label="Identyfikator Modelu (Model ID)" 
                        error={errors.model_id?.message}
                        hint="Wpisz ręcznie identyfikator modelu (np. text-embedding-3-small)."
                    >
                        <Controller
                            control={control}
                            name="model_id"
                            render={({ field }) => (
                                <FormTextField
                                    {...field}
                                    onBlur={() => {
                                        field.onBlur();
                                        onSyncDraft();
                                    }}
                                    placeholder="np. text-embedding-3-small"
                                    className="h-14 px-4 bg-zinc-900/50 border-zinc-800 text-lg rounded-xl font-mono"
                                />
                            )}
                        />
                    </FormItemField>
                )}
            </div>
        </FormSection>
    );
};
