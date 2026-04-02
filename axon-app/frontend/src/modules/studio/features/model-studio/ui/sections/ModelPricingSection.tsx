import React, { useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { ModelFormData } from "../../types/model-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { Button } from "@/shared/ui/ui/Button";
import { Download, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAvailableModels } from "@/modules/settings/application/useLLMProviders";
import { toast } from "sonner";

export const ModelPricingSection = () => {
    const { control, setValue } = useFormContext<ModelFormData>();
    const providerId = useWatch({ control, name: "provider_id" });
    const modelId = useWatch({ control, name: "model_id" });
    const isOpenRouter = modelId?.includes("/");
    
    const [isSyncing, setIsSyncing] = useState(false);
    const { data: availableModels = [] } = useAvailableModels(providerId);

    const handleSyncPricing = () => {
        if (!modelId) {
            toast.error("Wybierz model przed synchronizacją kosztów.");
            return;
        }
        
        if (!providerId) {
            toast.error("Wybierz dostawcę przed synchronizacją kosztów.");
            return;
        }

        setIsSyncing(true);
        try {
            // Find model in available models fetched from Provider API
            const modelData = availableModels.find(m => m.id === modelId);
            
            if (modelData && (modelData.pricing_input !== undefined || modelData.pricing_output !== undefined)) {
                const priceIn = modelData.pricing_input || 0;
                const priceOut = modelData.pricing_output || 0;
                
                setValue("pricing_input", priceIn, { shouldValidate: true, shouldDirty: true });
                setValue("pricing_output", priceOut, { shouldValidate: true, shouldDirty: true });
                
                toast.success(`Zsynchronizowano cennik z API dla ${modelId}`);
            } else {
                toast.error(`Brak cennika w API dostawcy dla wybranego modelu (${modelId}).`);
            }
        } catch (error) {
            toast.error("Wystąpił błąd podczas pobierania cennika.");
            console.error("Error syncing prices:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <FormSection 
            id="pricing" 
            number={5} 
            title="Ekonomia (Pricing)"
            description="Skonfiguruj koszty modelu za 1M tokenów wejściowych i wyjściowych."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                <div className="flex items-center justify-between">
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="gap-2 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900 rounded-xl px-6 h-10"
                        onClick={handleSyncPricing}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} /> 
                        Pobierz z API
                    </Button>

                    {isOpenRouter && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-right-4 duration-500">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Price Sync Active</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Pricing */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Input: $ per 1M tokens</label>
                        <div className="relative group">
                            <span className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 font-mono transition-colors",
                                isOpenRouter ? "text-primary font-bold" : "text-zinc-500"
                            )}>$</span>
                            <Controller
                                control={control}
                                name="pricing_input"
                                render={({ field }) => (
                                    <FormTextField
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        className={cn(
                                            "h-14 pl-8 pr-4 bg-zinc-900/50 border-zinc-800 text-lg rounded-xl font-mono transition-all",
                                            isOpenRouter && "border-primary/30 text-primary ring-1 ring-primary/10"
                                        )}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Output Pricing */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-300">Output: $ per 1M tokens</label>
                        <div className="relative group">
                            <span className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 font-mono transition-colors",
                                isOpenRouter ? "text-primary font-bold" : "text-zinc-500"
                            )}>$</span>
                            <Controller
                                control={control}
                                name="pricing_output"
                                render={({ field }) => (
                                    <FormTextField
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        className={cn(
                                            "h-14 pl-8 pr-4 bg-zinc-900/50 border-zinc-800 text-lg rounded-xl font-mono transition-all",
                                            isOpenRouter && "border-primary/30 text-primary ring-1 ring-primary/10"
                                        )}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                
                {isOpenRouter && (
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] italic">
                        * Ceny są synchronizowane z katalogiem OpenRouter. Możesz je nadpisać ręcznie w razie potrzeby.
                    </p>
                )}
            </div>
        </FormSection>
    );
};