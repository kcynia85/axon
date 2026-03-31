import React, { useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { ModelFormData } from "../../types/model-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormSelect } from "@/shared/ui/form/FormSelect";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { useLLMProviders, useAvailableModels } from "@/modules/settings/application/useLLMProviders";
import { ChevronDown, ShoppingBag, CheckCircle2, Plus, Loader2, Activity } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { OpenRouterMarketplace } from "../components/OpenRouterMarketplace";
import { Button } from "@/shared/ui/ui/Button";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";
import { Badge } from "@/shared/ui/ui/Badge";
import { ModelSanityCheck } from "../components/ModelSanityCheck";

interface ModelIdentitySectionProps {
    modelId?: string;
    onToggleSanity?: () => void;
    isSanityOpen?: boolean;
}

export const ModelIdentitySection = ({ modelId }: ModelIdentitySectionProps) => {
    const { control, setValue, formState: { errors } } = useFormContext<ModelFormData>();
    const { data: providers = [] } = useLLMProviders();
    const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

    // Use useWatch for reliable re-renders when provider_id changes
    const selectedProviderId = useWatch({ control, name: "provider_id" });
    const currentModelId = useWatch({ control, name: "model_id" });

    // Fetch available models for the selected provider
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
    
    const modelOptions = React.useMemo(() => {
        return availableModels.map(m => ({
            id: m.id,
            name: m.name
        }));
    }, [availableModels]);

    const handleModelSelect = (model: any) => {
        setValue("model_id", model.id);
        
        const isReasoning = model.id.includes("o1") || model.id.includes("r1") || model.id.includes("405b") || (model.description?.toLowerCase().includes("reasoning"));

        if (isOpenRouter) {
            const parts = model.id.split('/');
            const providerName = parts.length > 1 ? parts[0] : "";
            setValue("alias_name", providerName ? `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} ${model.name}` : model.name);
        } else {
            setValue("alias_name", model.name);
        }

        setValue("max_completion_tokens", model.context_window || 0);
        setValue("pricing_input", model.pricing_input || 0);
        setValue("pricing_output", model.pricing_output || 0);
        
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
                                    onChange={(val) => {
                                        field.onChange(val);
                                        const modelData = availableModels.find(m => m.id === val);
                                        if (modelData) {
                                            handleModelSelect(modelData);
                                        }
                                    }}
                                    placeholder={isLoadingModels ? "Ładowanie modeli..." : "Szukaj np. turbo..."}
                                    renderTrigger={(selected: any) => (
                                        <div className="flex items-center gap-3 cursor-pointer group/trigger w-full border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hover:border-zinc-700 transition-colors">
                                            <span className={cn(
                                                "text-lg font-mono transition-colors flex-1 text-left",
                                                selected.length > 0 ? "text-white" : "text-zinc-600 group-hover/trigger:text-zinc-400"
                                            )}>
                                                {isLoadingModels ? "Ładowanie..." : (selected.length > 0 ? selected[0].name : "Szukaj np. turbo...")}
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