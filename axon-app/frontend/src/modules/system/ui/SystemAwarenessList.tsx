"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "../../settings/infrastructure/api";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/shared/ui/ui/Table";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";
import { Search, Database, HardDrive, Cpu, Layers, Box, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/ui/Tooltip";

const entityTypeIcons: Record<string, React.ReactNode> = {
    agent: <Cpu className="w-4 h-4 text-purple-400" />,
    crew: <Layers className="w-4 h-4 text-blue-400" />,
    space: <Box className="w-4 h-4 text-emerald-400" />,
    tool: <HardDrive className="w-4 h-4 text-amber-400" />,
    project: <Database className="w-4 h-4 text-zinc-400" />,
    prompt_archetype: <Layers className="w-4 h-4 text-pink-400" />,
};

export const SystemAwarenessList = () => {
    const { data: embeddings, isLoading, error } = useQuery({
        queryKey: ["system-awareness"],
        queryFn: settingsApi.getSystemEmbeddings,
        refetchInterval: 30000, // Refresh every 30s
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center border border-red-500/20 rounded-2xl bg-red-500/5">
                <p className="text-red-400 font-medium">Failed to load system awareness data.</p>
                <p className="text-zinc-500 text-sm mt-1">{(error as Error).message}</p>
            </div>
        );
    }

    if (!embeddings || embeddings.length === 0) {
        return (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                <Database className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 font-medium">No system embeddings found.</p>
                <p className="text-zinc-500 text-sm mt-1">
                    System awareness is built automatically as you create agents, crews, and tools.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-zinc-400 font-bold py-4 pl-6">Entity</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-4">Type</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-4">Payload Preview</TableHead>
                        <TableHead className="text-zinc-400 font-bold py-4 text-right pr-6">Last Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {embeddings.map((emb) => (
                        <TableRow key={emb.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <TableCell className="py-4 pl-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                                        {entityTypeIcons[emb.entity_type] || <HardDrive className="w-4 h-4 text-zinc-400" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-zinc-100 font-bold text-sm">
                                            {emb.payload.name || emb.payload.title || "Unnamed Entity"}
                                        </span>
                                        <span className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider">
                                            {emb.entity_id.split("-")[0]}...
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-400 capitalize font-medium text-[11px]">
                                    {emb.entity_type.replace("_", " ")}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-4 max-w-[300px]">
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-400 text-xs truncate italic">
                                        {emb.payload.description || emb.payload.role || "No description available"}
                                    </span>
                                    <TooltipProvider>
                                        <Tooltip 
                                            content={
                                                <pre className="text-[10px] text-zinc-400 font-mono whitespace-pre-wrap max-w-xs">
                                                    {JSON.stringify(emb.payload, null, 2)}
                                                </pre>
                                            }
                                        >
                                            <Info className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400" />
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableCell>
                            <TableCell className="py-4 text-right pr-6">
                                <span className="text-zinc-500 text-xs">
                                    {emb.updated_at ? formatDistanceToNow(new Date(emb.updated_at), { addSuffix: true }) : "Never"}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
