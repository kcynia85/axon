"use client";

import * as React from "react";
import { useVectorDatabases, useDeleteVectorDatabase } from "../application/useSettings";
import { Card, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { 
    Database, 
    Search,
    ArrowUpDown,
} from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { cn } from "@/shared/lib/utils";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { VectorDatabaseSidePeek } from "./VectorDatabaseSidePeek";
import { useRouter } from "next/navigation";

const SORT_OPTIONS = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "type", label: "Type" },
];

export const VectorDatabasesList = () => {
    const { data: dbs, isLoading } = useVectorDatabases();
    const { mutateAsync: deleteDb } = useDeleteVectorDatabase();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [selectedDb, setSelectedDb] = React.useState<any | null>(null);

    const filteredDbs = React.useMemo(() => {
        if (!dbs) return [];

        const filtered = dbs
            .filter(db => !pendingIds.has(db.id))
            .filter(db => 
                db.vector_database_name.toLowerCase().includes(search.toLowerCase()) ||
                db.vector_database_type.toLowerCase().includes(search.toLowerCase())
            );

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name_asc":
                    return a.vector_database_name.localeCompare(b.vector_database_name);
                case "name_desc":
                    return b.vector_database_name.localeCompare(a.vector_database_name);
                case "type":
                    return a.vector_database_type.localeCompare(b.vector_database_type);
                default:
                    return 0;
            }
        });
    }, [dbs, search, sortBy, pendingIds]);

    const handleDelete = (id: string, name: string) => {
        deleteWithUndo(id, name, () => deleteDb(id));
        setSelectedDb(null);
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

    const displayDbs = filteredDbs.length > 0 ? filteredDbs : [
        {
            id: "postgres-mock",
            vector_database_name: "Postgres (pgvector)",
            vector_database_type: "Postgres_pgvector",
            vector_database_connection_url: "aws-eu-central-1",
            vector_database_connection_status: "CONNECTED",
            vector_database_collection_name: "axon_knowledge_vectors_1536",
            vector_database_embedding_model_reference: "text-embedding-3-small",
            vector_database_expected_dimensions: 1536,
            vector_database_total_vectors: 450200,
            vector_database_size: 45,
            isMock: true
        },
        {
            id: "chroma-mock",
            vector_database_name: "ChromaDB",
            vector_database_type: "ChromaDB",
            vector_database_connection_url: "self-hosted",
            vector_database_connection_status: "CONNECTED",
            vector_database_collection_name: "local_cache",
            vector_database_embedding_model_reference: "all-MiniLM-L6-v2",
            vector_database_expected_dimensions: 768,
            vector_database_total_vectors: 520,
            vector_database_size: 2,
            isMock: true
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-8 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <Input
                            placeholder="Search databases..."
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
                {displayDbs.map((db) => {
                    const isConnected = db.vector_database_connection_status.toUpperCase() === "CONNECTED";
                    
                    return (
                        <Card 
                            key={db.id} 
                            className="group hover:border-primary/50 transition-all flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md cursor-pointer h-full"
                            onClick={() => setSelectedDb(db)}
                        >
                            <CardContent className="p-5 flex items-start gap-4">
                                <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary">
                                    <Database className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                    <h3 className="text-base font-bold tracking-tight truncate leading-none mt-0.5">{db.vector_database_name}</h3>
                                    <div className={cn(
                                        "text-xs font-medium",
                                        isConnected ? "text-zinc-400" : "text-zinc-500"
                                    )}>
                                        {isConnected ? "Połączony" : "Rozłączony"}
                                    </div>
                                    <div className="pt-2">
                                        <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-mono px-2 py-0.5 rounded-md border-none uppercase tracking-wider">
                                            {db.vector_database_connection_url || "internal"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {displayDbs.length === 0 && (
                    <div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 space-y-2">
                        <Database className="w-8 h-8 opacity-20" />
                        <span className="text-xs font-medium">No vector databases found</span>
                    </div>
                )}
            </div>

            <VectorDatabaseSidePeek 
                db={selectedDb}
                isOpen={!!selectedDb}
                onClose={() => setSelectedDb(null)}
                onEdit={(db) => router.push(`/settings/knowledge-engine/vectors/${db.id}`)}
                onDelete={(id) => handleDelete(id, selectedDb?.vector_database_name)}
            />
        </div>
    );
};
