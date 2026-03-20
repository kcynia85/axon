"use client";

import * as React from "react";
import { useEmbeddingModels } from "../application/useSettings";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/ui/Table";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";

/**
 * EmbeddingModelsList: Displays available embedding models in a table.
 * Standard: 0% useEffect, arrow function.
 */
export const EmbeddingModelsList = () => {
    const { data: models, isLoading } = useEmbeddingModels();
    const [search, setSearch] = React.useState("");

    if (isLoading) {
        return <Skeleton className="h-64 w-full" />;
    }

    const filteredModels = models?.filter(m =>
        m.model_id.toLowerCase().includes(search.toLowerCase()) ||
        m.model_provider_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search embedding models..."
                    className="pl-9 h-9 text-xs"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="border rounded-md bg-background">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Provider</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Model Identifier</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Dimensions</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Max Tokens</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Cost (1M)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredModels?.map((model) => (
                            <TableRow key={model.id} className="group hover:bg-muted/10">
                                <TableCell className="text-xs font-bold">{model.model_provider_name}</TableCell>
                                <TableCell className="text-[10px] font-mono opacity-60">{model.model_id}</TableCell>
                                <TableCell className="text-right text-[10px] font-mono">{model.model_vector_dimensions}</TableCell>
                                <TableCell className="text-right text-[10px] font-mono">{model.model_max_context_tokens.toLocaleString()}</TableCell>
                                <TableCell className="text-right text-[10px] font-mono">${model.model_cost_per_1m_tokens.toFixed(4)}</TableCell>
                            </TableRow>
                        ))}
                        {filteredModels?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic text-xs">
                                    No embedding models found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
