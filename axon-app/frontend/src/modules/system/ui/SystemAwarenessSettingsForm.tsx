"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/modules/settings/infrastructure/api";
import { Card, CardHeader, CardBody, Divider, Select, SelectItem, Switch, Button } from "@heroui/react";
import { Brain, Cpu, Database, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const SystemAwarenessSettingsForm = () => {
    const queryClient = useQueryClient();

    // 1. Fetch current settings
    const { data: settings, isLoading: settingsLoading } = useQuery({
        queryKey: ["system-awareness-settings"],
        queryFn: settingsApi.getSystemAwarenessSettings,
    });

    // 2. Fetch available embedding models
    const { data: embeddingModels = [], isLoading: modelsLoading } = useQuery({
        queryKey: ["embedding-models"],
        queryFn: settingsApi.getEmbeddingModels,
    });

    // 3. Mutation for updating settings
    const mutation = useMutation({
        mutationFn: settingsApi.updateSystemAwarenessSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-awareness-settings"] });
            toast.success("System Awareness settings updated");
        },
        onError: (err) => {
            toast.error(`Failed to update settings: ${err instanceof Error ? err.message : "Unknown error"}`);
        },
    });

    if (settingsLoading || modelsLoading) {
        return <div className="animate-pulse space-y-4">
            <div className="h-48 bg-white/5 rounded-3xl" />
        </div>;
    }

    const handleModelChange = (id: string) => {
        if (!settings) return;
        mutation.mutate({ embedding_model_id: id });
    };

    const handleToggleIndexing = (enabled: boolean) => {
        if (!settings) return;
        mutation.mutate({ indexing_enabled: enabled });
    };

    const handleToggleSync = (enabled: boolean) => {
        if (!settings) return;
        mutation.mutate({ realtime_sync_enabled: enabled });
    };

    return (
        <div className="space-y-6">
            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 rounded-3xl">
                <CardHeader className="flex gap-3 px-6 pt-6">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                        <Brain className="text-blue-400" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-md font-bold">Agnostic Awareness Engine (RAG#2)</p>
                        <p className="text-xs text-zinc-500">Configure global indexing parameters for system-wide awareness.</p>
                    </div>
                </CardHeader>
                <Divider className="my-4 opacity-50" />
                <CardBody className="px-6 pb-8 space-y-8">
                    {/* Embedding Model Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                            <Cpu size={14} /> Embedding Intelligence
                        </div>
                        <Select
                            label="System Embedding Model"
                            placeholder="Select a model for system indexing"
                            selectedKeys={settings?.embedding_model_id ? [settings.embedding_model_id] : []}
                            className="max-w-md"
                            variant="bordered"
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                if (selected) handleModelChange(selected);
                            }}
                        >
                            {embeddingModels.map((model) => (
                                <SelectItem 
                                    key={model.id} 
                                    value={model.id}
                                    description={`${model.model_provider_name} • ${model.model_vector_dimensions}d`}
                                >
                                    {model.model_id}
                                </SelectItem>
                            ))}
                        </Select>
                        <p className="text-xs text-zinc-500 italic max-w-xl">
                            Tip: Changing the embedding model will require a full system re-index via the "Re-index All" command to maintain semantic consistency.
                        </p>
                    </div>

                    {/* Operational Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Automatic Indexing</span>
                                <Switch 
                                    isSelected={settings?.indexing_enabled} 
                                    onValueChange={handleToggleIndexing}
                                    size="sm"
                                    color="primary"
                                />
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                Automatically trigger Inngest indexing when entities (Agents, Crews, Tools) are created or updated in Studios.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Real-time Synchronization</span>
                                <Switch 
                                    isSelected={settings?.realtime_sync_enabled} 
                                    onValueChange={handleToggleSync}
                                    size="sm"
                                    color="primary"
                                />
                            </div>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                                Broadcast "awareness_synchronized" events via WebSockets to update frontend indicators like the Meta-Agent MagicSphere.
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Actions Card */}
            <Card className="bg-blue-500/5 border-blue-500/20 rounded-3xl">
                <CardBody className="p-6 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-2xl">
                            <Sparkles className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Mass Re-index Required?</h3>
                            <p className="text-sm text-zinc-400">Synchronize all existing system entities with the current embedding configuration.</p>
                        </div>
                    </div>
                    <Button 
                        color="primary" 
                        variant="shadow"
                        className="rounded-xl font-bold px-8 h-12"
                        startContent={<Database size={18} />}
                        onPress={() => toast.info("Coming soon: Triggering global re-index...")}
                    >
                        Re-index System
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};
