import React from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { ModelFormData } from "../../types/model-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { Button } from "@/shared/ui/ui/Button";
import { Download, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const ModelPricingSection = () => {
    const { control } = useFormContext<ModelFormData>();
    const modelId = useWatch({ control, name: "model_id" });
    const isOpenRouter = modelId?.includes("/");

    return (
        <FormSection 
            id="pricing" 
            number={5} 
            title="Ekonomia (Pricing)"
            description="Skonfiguruj koszty modelu za 1M tokenów wejściowych i wyjściowych."
        >
            <div className="space-y-12 max-w-4xl">
                <div className="flex items-center justify-between">
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="gap-2 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900 rounded-xl px-6 h-10"
                        onClick={() => alert("Not implemented yet")}
                    >
                        <Download className="w-4 h-4" /> Importuj z URL
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