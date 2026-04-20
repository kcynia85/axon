"use client";

import React from "react";
import { ScrollShadow, Button } from "@heroui/react";
import { Sparkles, Database, X, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { FormSelect } from "@/shared/ui/form/FormSelect";

type SpaceCognitionTabProps = {
    readonly knowledgeHubIds: readonly string[];
    readonly onHubsChange: (hubIds: string[]) => void;
};

export const SpaceCognitionTab = ({ knowledgeHubIds, onHubsChange }: SpaceCognitionTabProps) => {
    const { data: allHubs, isLoading } = useQuery({
        queryKey: ["knowledge-hubs"],
        queryFn: resourcesApi.getKnowledgeHubs,
    });

    const hubOptions = (allHubs || []).map(hub => ({
        id: hub.id,
        name: hub.hub_name,
        subtitle: hub.hub_description || "Knowledge Hub",
    }));

    const selectedHubs = (allHubs || []).filter(hub => knowledgeHubIds.includes(hub.id));

    const handleRemoveHub = (hubId: string) => {
        onHubsChange(knowledgeHubIds.filter(id => id !== hubId));
    };

    const handleAddHubs = (newHubIds: string[]) => {
        onHubsChange(newHubIds);
    };

    return (
        <ScrollShadow className="h-full px-8 pt-10 pb-48">
            <div className="space-y-10">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-[13px] tracking-tight uppercase">Cognitive Memory</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Connect your private knowledge base</p>
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-950/30 border border-zinc-900 rounded-2xl">
                        <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                            Select Knowledge Hubs to ground this entity's responses. The AI will prioritize information from these sources.
                        </p>
                    </div>
                </div>

                {/* Hub Selection */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Select Sources</span>
                    </div>

                    <FormSelect
                        multiple
                        options={hubOptions}
                        value={[...knowledgeHubIds]}
                        onChange={handleAddHubs}
                        placeholder={isLoading ? "Loading Knowledge Hubs..." : "Select Hubs..."}
                        searchPlaceholder="Search hubs..."
                    />
                </div>

                {/* Active Hubs List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Active Hubs</span>
                        <span className="text-[10px] font-black text-zinc-500 px-2 py-0.5 bg-zinc-900 rounded-full border border-zinc-800">
                            {knowledgeHubIds.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {selectedHubs.length > 0 ? (
                            selectedHubs.map(hub => (
                                <div key={hub.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center gap-3 group hover:border-zinc-700 transition-colors">
                                    <div className="p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400">
                                        <Database size={16} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[11px] font-black text-white uppercase tracking-tight truncate">{hub.hub_name}</span>
                                        <span className="text-[10px] font-bold text-zinc-500 truncate">{hub.hub_description || "RAG Source"}</span>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="h-8 w-8 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        onPress={() => handleRemoveHub(hub.id)}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-zinc-900 rounded-2xl opacity-40">
                                <Database size={24} className="text-zinc-800 mb-3" />
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 italic">No hubs connected</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ScrollShadow>
    );
};
