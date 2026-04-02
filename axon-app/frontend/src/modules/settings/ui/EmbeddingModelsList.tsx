"use client";

import * as React from "react";
import { useEmbeddingModels, useDeleteEmbeddingModel } from "../application/useSettings";
import { Card, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Search, ArrowUpDown, Cpu } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { EmbeddingModelSidePeek } from "./EmbeddingModelSidePeek";
import { useRouter } from "next/navigation";

const SORT_OPTIONS = [
    { id: "name_asc", label: "Identifier (A-Z)" },
    { id: "name_desc", label: "Identifier (Z-A)" },
    { id: "provider", label: "Provider" },
];

export const EmbeddingModelsList = () => {
    const { data: models, isLoading } = useEmbeddingModels();
    const { mutateAsync: deleteModel } = useDeleteEmbeddingModel();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [selectedModel, setSelectedModel] = React.useState<any | null>(null);

    const filteredModels = React.useMemo(() => {
        if (!models) return [];

        const filtered = models
            .filter(model => !pendingIds.has(model.id))
            .filter(model => 
                model.model_id.toLowerCase().includes(search.toLowerCase()) ||
                model.model_provider_name.toLowerCase().includes(search.toLowerCase())
            );

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name_asc":
                    return a.model_id.localeCompare(b.model_id);
                case "name_desc":
                    return b.model_id.localeCompare(a.model_id);
                case "provider":
                    return a.model_provider_name.localeCompare(b.model_provider_name);
                default:
                    return 0;
            }
        });
    }, [models, search, sortBy, pendingIds]);

    const handleDelete = (id: string, name: string) => {
        deleteWithUndo(id, name, () => deleteModel(id));
        setSelectedModel(null);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-[52px] flex-1 max-w-sm rounded-md" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full rounded-xl" />)}
                </div>
            </div>
        );
    }

    const displayModels = filteredModels.length > 0 ? filteredModels : [
        {
            id: "mock-1",
            model_provider_name: "OpenAI",
            model_id: "text-embedding-3-small",
            model_vector_dimensions: 1536,
            model_max_context_tokens: 8191,
            model_cost_per_1m_tokens: 0.02,
        },
        {
            id: "mock-2",
            model_provider_name: "Google",
            model_id: "gemini-embedding-001",
            model_vector_dimensions: 768,
            model_max_context_tokens: 8191,
            model_cost_per_1m_tokens: 0.02,
        },
        {
            id: "mock-3",
            model_provider_name: "Google",
            model_id: "multimodalembedding@001",
            model_vector_dimensions: 1408,
            model_max_context_tokens: 8191,
            model_cost_per_1m_tokens: 0.05,
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-8 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <Input
                            placeholder="Search models..."
                            className="pl-10 h-[52px] text-xs border-zinc-200 dark:border-zinc-800"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-6 h-9">
                        <SortMenu 
                            options={SORT_OPTIONS}
                            activeOptionId={sortBy}
                            onSelect={(id) => setSortBy(id)}
                            trigger={
                                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-1.5 cursor-pointer group outline-none translate-y-[2px]">
                                    <ArrowUpDown size={14} className="group-hover:scale-110 transition-transform" />
                                    <span>Sort</span>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayModels.map((model) => {
                    const isMultimodal = model.model_id.toLowerCase().includes("multimodal") || model.model_id.toLowerCase().includes("vision");
                    
                    return (
                        <Card 
                            key={model.id} 
                            className="group hover:border-primary/50 transition-all flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md cursor-pointer h-full"
                            onClick={() => setSelectedModel(model)}
                        >
                            <CardContent className="p-5 flex items-start gap-4">
                                <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <h3 className="text-base font-bold tracking-tight truncate leading-none mt-0.5">{model.model_id}</h3>
                                    <div className="text-xs font-medium text-zinc-400">
                                        {model.model_provider_name} / Aktywny
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-xs font-medium text-zinc-500">
                                            {isMultimodal ? "Multimodal" : "Text"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {displayModels.length === 0 && (
                    <div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 space-y-2">
                        <Cpu className="w-8 h-8 opacity-20" />
                        <span className="text-xs font-medium">No embedding models found</span>
                    </div>
                )}
            </div>

            <EmbeddingModelSidePeek 
                model={selectedModel}
                isOpen={!!selectedModel}
                onClose={() => setSelectedModel(null)}
                onEdit={(model) => router.push(`/settings/knowledge-engine/embedding/${model.id}`)}
                onDelete={(id) => handleDelete(id, selectedModel?.model_id)}
            />
        </div>
    );
};
