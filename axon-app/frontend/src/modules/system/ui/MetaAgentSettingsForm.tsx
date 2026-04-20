"use client";

import React, { useState, useEffect } from "react";
import { useMetaAgent } from "../application/meta-agent.hooks";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "../../settings/infrastructure/api";
import { Card } from "@/shared/ui/ui/Card";
import { Input } from "@/shared/ui/ui/Input";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Button } from "@/shared/ui/ui/Button";
import { Slider } from "@/shared/ui/ui/Slider";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import { Label } from "@/shared/ui/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { toast } from "sonner";
import { Save, Sparkles, BrainCircuit, Activity } from "lucide-react";

export const MetaAgentSettingsForm = () => {
    const { metaAgent, isLoading, updateMetaAgent, isUpdating } = useMetaAgent();
    const { data: llmModels, isLoading: isLoadingModels } = useQuery({
        queryKey: ["llm-models"],
        queryFn: settingsApi.getLLMModels,
    });

    const [formData, setFormData] = useState({
        meta_agent_system_prompt: "",
        meta_agent_temperature: 0.7,
        meta_agent_rag_enabled: true,
        llm_model_id: "",
    });

    useEffect(() => {
        if (metaAgent) {
            setFormData({
                meta_agent_system_prompt: metaAgent.meta_agent_system_prompt || "",
                meta_agent_temperature: metaAgent.meta_agent_temperature || 0.7,
                meta_agent_rag_enabled: metaAgent.meta_agent_rag_enabled ?? true,
                llm_model_id: metaAgent.llm_model_id || "",
            });
        }
    }, [metaAgent]);

    const handleSave = async () => {
        try {
            await updateMetaAgent(formData);
            toast.success("Meta Agent settings updated successfully");
        } catch (error) {
            toast.error("Failed to update Meta Agent settings");
        }
    };

    if (isLoading || isLoadingModels) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-40 w-full rounded-2xl bg-white/5" />
                <Skeleton className="h-60 w-full rounded-2xl bg-white/5" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Core Configuration */}
            <Card className="p-6 bg-zinc-950/40 border-white/10 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <BrainCircuit className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-zinc-100 font-bold">Core Identity</h3>
                        <p className="text-zinc-500 text-xs">Define how the Meta-Agent behaves and thinks.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">System Prompt</Label>
                    <Textarea 
                        value={formData.meta_agent_system_prompt}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_agent_system_prompt: e.target.value }))}
                        placeholder="You are Axon, a highly intelligent orchestrator..."
                        className="min-h-[200px] bg-white/5 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus:border-purple-500/50 transition-colors text-sm leading-relaxed"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider text-zinc-500">Creativity (Temperature)</Label>
                            <span className="text-purple-400 font-mono text-sm font-bold bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">{formData.meta_agent_temperature.toFixed(1)}</span>
                        </div>
                        <Slider 
                            value={[formData.meta_agent_temperature]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={([val]) => setFormData(prev => ({ ...prev, meta_agent_temperature: val }))}
                            className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase">
                            <span>Focused</span>
                            <span>Creative</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Primary Reasoning Model</Label>
                        <Select 
                            value={formData.llm_model_id} 
                            onValueChange={(val) => setFormData(prev => ({ ...prev, llm_model_id: val }))}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10 text-zinc-100">
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-white/10 text-zinc-100">
                                {llmModels?.map(model => (
                                    <SelectItem key={model.id} value={model.id}>
                                        {model.model_display_name} ({model.model_id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Cognitive Features */}
            <Card className="p-6 bg-zinc-950/40 border-white/10 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-zinc-100 font-bold">Cognitive Capabilities</h3>
                        <p className="text-zinc-500 text-xs">Configure how the Meta-Agent interacts with system data.</p>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-colors">
                    <div className="flex flex-col gap-1">
                        <span className="text-zinc-100 font-bold text-sm">System Awareness (RAG#2)</span>
                        <span className="text-zinc-500 text-xs">Allow Meta-Agent to search and understand current agents, crews, and tools.</span>
                    </div>
                    <Checkbox 
                        className="h-6 w-6 rounded-md border-zinc-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        checked={formData.meta_agent_rag_enabled}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, meta_agent_rag_enabled: checked as boolean }))}
                    />
                </div>
            </Card>

            {/* Action Bar */}
            <div className="flex justify-end pt-4 border-t border-white/5">
                <Button 
                    onClick={handleSave} 
                    disabled={isUpdating}
                    className="h-11 px-8 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-white font-bold gap-2 transition-all shadow-lg hover:shadow-white/10 active:scale-95"
                >
                    {isUpdating ? (
                        <div className="h-4 w-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Configuration
                </Button>
            </div>
        </div>
    );
};
