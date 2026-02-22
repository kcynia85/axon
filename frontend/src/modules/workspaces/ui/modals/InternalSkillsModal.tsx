"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/Dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useInternalTools } from "@/modules/resources/application/use-internal-tools";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { InternalTool } from "@/shared/domain/resources";
import { Wrench, Terminal, Database, Globe, Search, Sparkles } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";

export const InternalSkillsModal = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isOpen = searchParams.get("modal") === "internal-skills";
    const [search, setSearch] = React.useState("");

    const { data: tools, isLoading } = useInternalTools();

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const filteredTools = tools?.filter((t: InternalTool) =>
        t.tool_display_name.toLowerCase().includes(search.toLowerCase()) ||
        t.tool_function_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Internal Ecosystem</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">Native Agent Skills</DialogTitle>
                    <DialogDescription className="text-xs">
                        Browse tools and functions available for your agents to execute. These represent hard-coded capabilities or MCP integrations.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 border-b flex gap-4 bg-background">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search skills (e.g. search, python, github)..."
                            className="pl-9 text-xs h-8"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-muted/5 space-y-2">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                    ) : filteredTools?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground italic">No skills found.</p>
                        </div>
                    ) : (
                        filteredTools?.map((tool: InternalTool) => (
                            <div
                                key={tool.id}
                                className="p-3 border rounded-lg bg-background flex items-center justify-between hover:border-primary/50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded border",
                                        tool.tool_category === "Primeval" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                            tool.tool_category === "AI_Utils" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                "bg-muted text-muted-foreground border-muted-foreground/10"
                                    )}>
                                        {getIconForCategory(tool.tool_category)}
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold leading-none">{tool.tool_display_name}</h5>
                                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{tool.tool_description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[8px] h-4 py-0 font-mono">
                                        {tool.tool_category}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <DialogHeader className="p-4 border-t bg-background flex items-center justify-center">
                    <Button variant="outline" size="sm" className="text-[10px] h-7 gap-2" disabled>
                        Propose New Global Skill
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

const getIconForCategory = (cat: string) => {
    switch (cat) {
        case "Primeval": return <Terminal className="w-3 h-3" />;
        case "AI_Utils": return <Sparkles className="w-3 h-3" />;
        case "Systems": return <Database className="w-3 h-3" />;
        case "Local": return <Globe className="w-3 h-3" />;
        default: return <Wrench className="w-3 h-3" />;
    }
};
