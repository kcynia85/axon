"use client";

import * as React from "react";
import { useLLMModels, useDeleteLLMModel } from "../application/useSettings";
import { useLLMProviders } from "../application/useLLMProviders";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/ui/Table";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { LLMModelSidePeek } from "./LLMModelSidePeek";
import type { LLMModel } from "@/shared/domain/settings";
import { useRouter } from "next/navigation";

/**
 * LLMModelsList: Displays available LLM models in a table.
 * Standard: 0% useEffect, arrow function.
 */
export const LLMModelsList = () => {
    const router = useRouter();
    const { data: models, isLoading } = useLLMModels();
    const { data: providers } = useLLMProviders();
    const { mutateAsync: deleteModel } = useDeleteLLMModel();
    
    const [search, setSearch] = React.useState("");
    const [selectedModel, setSelectedModel] = React.useState<LLMModel | null>(null);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-9 w-64 rounded-md" />
                <div className="border rounded-md">
                    <div className="h-10 bg-muted/30 border-b flex items-center px-4 gap-4">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-14 border-b flex items-center px-4 gap-4">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 flex-1" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const filteredModels = models?.filter(m =>
        m.model_display_name.toLowerCase().includes(search.toLowerCase()) ||
        m.model_id.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteModel = async (id: string) => {
        if (confirm("Czy na pewno chcesz usunąć ten model z inwentarza?")) {
            try {
                await deleteModel(id);
                setSelectedModel(null);
            } catch (error) {
                console.error("Failed to delete model:", error);
            }
        }
    };

    const handleEditModel = (model: LLMModel) => {
        router.push(`/settings/llms/models/${model.id}/edit`);
    };

    const getProviderName = (providerId: string) => {
        return providers?.find(p => p.id === providerId)?.provider_name || "Unknown";
    };

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search models..."
                    className="pl-9 h-9 text-xs"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="border rounded-md bg-background overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Model Name</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Identifier</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Capabilities</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Context</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Pricing (1M)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredModels?.map((model) => (
                            <TableRow 
                                key={model.id} 
                                className="group hover:bg-muted/10 cursor-pointer"
                                onClick={() => setSelectedModel(model)}
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold">{model.model_display_name}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{getProviderName(model.llm_provider_id)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-base font-mono opacity-60">
                                    {model.model_id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {model.model_capabilities_flags.slice(0, 3).map((cap: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-[10px] h-4 px-1.5">{cap}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-base font-mono">
                                    <span suppressHydrationWarning>{model.model_context_window.toLocaleString()}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="text-base font-mono">
                                        In: ${((model.model_pricing_config.input as number) || 0).toFixed(2)}
                                    </div>
                                    <div className="text-xs font-mono opacity-60">
                                        Out: ${((model.model_pricing_config.output as number) || 0).toFixed(2)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredModels?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic text-xs">
                                    No models in inventory.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <LLMModelSidePeek 
                model={selectedModel}
                isOpen={!!selectedModel}
                onClose={() => setSelectedModel(null)}
                onDelete={handleDeleteModel}
                onEdit={handleEditModel}
                providerName={selectedModel ? getProviderName(selectedModel.llm_provider_id) : undefined}
            />
        </div>
    );
};
