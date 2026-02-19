"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { usePromptArchetypes } from "@/modules/resources/application/use-prompt-archetypes";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Search, Sparkles, Filter, Check } from "lucide-react";
import { Input } from "@/shared/ui/ui/input";
import { Button } from "@/shared/ui/ui/button";
import { PromptArchetype } from "@/shared/domain/resources";

export const ArchetypeLoaderModal = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isOpen = searchParams.get("modal") === "load-archetype";
    const [search, setSearch] = React.useState("");

    const { data: archetypes, isLoading } = usePromptArchetypes();

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleSelect = (archetype: PromptArchetype) => {
        // In a real app, this would populate the Agent form
        console.log("Selected archetype:", archetype);
        closeModal();
        // Redirect to new-agent modal with archetype data? 
        // For now just close.
    };

    const filteredArchetypes = archetypes?.filter(a =>
        a.archetype_name.toLowerCase().includes(search.toLowerCase()) ||
        a.archetype_role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Library</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold font-display">Prompt Archetypes</DialogTitle>
                    <DialogDescription className="text-xs">
                        Quick-start your agent creation by loading a pre-defined personality and skill set.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 border-b flex gap-4 bg-background">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search archetypes (e.g. Researcher, QA, Dev)..."
                            className="pl-9 text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-3 h-3" /> Filters
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                        </div>
                    ) : filteredArchetypes?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground italic">No archetypes found matching &quot;{search}&quot;</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredArchetypes?.map((archetype: PromptArchetype) => (
                                <Card
                                    key={archetype.id}
                                    className="hover:border-primary transition-all cursor-pointer group hover:shadow-lg relative overflow-hidden"
                                    onClick={() => handleSelect(archetype)}
                                >
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-sm font-bold truncate pr-6">{archetype.archetype_name}</CardTitle>
                                        <CardDescription className="text-[10px] line-clamp-2 mt-1">
                                            {archetype.archetype_description || "Specialized persona for advanced tasks."}
                                        </CardDescription>
                                        <div className="flex gap-2 mt-3 flex-wrap">
                                            <Badge variant="secondary" className="text-[8px] h-4 leading-none uppercase font-bold italic">
                                                {archetype.workspace_domain}
                                            </Badge>
                                        </div>
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary rounded-full p-1 text-primary-foreground">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <DialogHeader className="p-4 border-t bg-background text-center">
                    <p className="text-[10px] text-muted-foreground">
                        Loaded archetypes will pre-fill Step 1: Identity and Step 3: Engine of the Agent Creator.
                    </p>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
