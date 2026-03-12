'use client';

import React from "react";
import { PromptArchetype } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Sparkles, Edit2, Copy, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";

interface PromptsBrowserContentProps {
  prompts: readonly PromptArchetype[];
  viewMode: "grid" | "list";
  onViewDetails: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export const PromptsBrowserContent = ({
  prompts,
  viewMode,
  onViewDetails,
  isLoading,
  isError
}: PromptsBrowserContentProps) => {
  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Skeleton key={index} className={cn("w-full", viewMode === "grid" ? "h-48" : "h-20")} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-destructive bg-destructive/5 rounded-2xl border border-destructive/10">
        <p className="font-bold">Error loading archetypes</p>
        <Button variant="link" onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <Card className="border-dashed h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
        <Sparkles className="w-12 h-12 mb-4 opacity-10" />
        <p className="text-sm italic font-medium">No archetypes found matching your filters.</p>
        <Button variant="link" className="mt-2 text-primary font-bold">Clear all filters</Button>
      </Card>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {prompts.map((archetype) => (
          <Card 
            key={archetype.id} 
            className="group hover:border-primary/40 transition-all cursor-pointer bg-muted/5 hover:bg-muted/10 border-transparent"
            onClick={() => onViewDetails(archetype.id)}
          >
            <div className="flex items-center p-4 gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm truncate">{archetype.archetype_name}</h4>
                  <Badge variant="outline" className="text-[8px] uppercase font-bold bg-primary/5 border-primary/10">
                    {archetype.workspace_domain}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{archetype.archetype_description}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex gap-1">
                  {archetype.archetype_keywords?.slice(0, 2).map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-[8px] px-2 py-0 bg-zinc-800 text-zinc-400 border-none">
                      {kw}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((archetype) => (
        <Card 
          key={archetype.id} 
          className="group hover:border-primary/50 transition-all overflow-hidden cursor-pointer flex flex-col h-full bg-muted/5 hover:bg-muted/10"
          onClick={() => onViewDetails(archetype.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest bg-primary/5 text-primary border-primary/20">
                {archetype.workspace_domain}
              </Badge>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-sm font-bold mt-2 group-hover:text-primary transition-colors">
              {archetype.archetype_name}
            </CardTitle>
            <CardDescription className="text-[11px] line-clamp-2 leading-relaxed min-h-[2.75rem]">
              {archetype.archetype_description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-1.5 overflow-hidden">
                {archetype.archetype_keywords?.slice(0, 3).map((kw, i) => (
                  <div key={i} className="px-2 py-0.5 rounded-sm bg-zinc-800 text-[8px] font-mono border border-background text-zinc-400">
                    {kw}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
      ))}
    </div>
  );
};
