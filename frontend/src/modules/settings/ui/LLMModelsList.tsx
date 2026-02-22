"use client";

import * as React from "react";
import { useLLMModels } from "../application/useSettings";
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

export const LLMModelsList = () => {
    const { data: models, isLoading } = useLLMModels();
    const [search, setSearch] = React.useState("");

    if (isLoading) {
        return <Skeleton className="h-64 w-full" />;
    }

    const filteredModels = models?.filter(m =>
        m.model_name.toLowerCase().includes(search.toLowerCase()) ||
        m.model_api_identifier.toLowerCase().includes(search.toLowerCase())
    );

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

            <div className="border rounded-md bg-background">
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
                            <TableRow key={model.id} className="group hover:bg-muted/10">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{model.model_name}</span>
                                        <span className="text-[10px] text-muted-foreground font-mono">{model.model_provider_id.slice(0, 8)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-[10px] font-mono opacity-60">
                                    {model.model_api_identifier}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {model.model_capabilities_flags.slice(0, 3).map((cap: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-[8px] h-3 px-1">{cap}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-[10px] font-mono">
                                    {model.model_context_window.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="text-[10px] font-mono">
                                        In: ${((model.model_pricing_config.input as number) || 0).toFixed(2)}
                                    </div>
                                    <div className="text-[10px] font-mono opacity-60">
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
        </div>
    );
};
