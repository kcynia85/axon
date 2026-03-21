'use client';

import React from "react";
import { PromptArchetype } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Sparkles, Edit2, Copy, MoreHorizontal, Trash2, Plus as PlusIcon } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";

interface PromptsBrowserContentProps {
  prompts: readonly (PromptArchetype & { isDraft?: boolean })[];
  viewMode: "grid" | "list";
  onViewDetails: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export const PromptsBrowserContent = ({
  prompts,
  viewMode,
  onViewDetails,
  onDelete,
  isLoading,
  isError
}: PromptsBrowserContentProps) => {
  const router = useRouter();
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
            className="group hover:border-primary/40 transition-all cursor-pointer bg-muted/5 hover:bg-muted/10 border-transparent relative"
            onClick={() => onViewDetails(archetype.id)}
          >
            <div className="flex items-center p-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm truncate">{archetype.archetype_name}</h4>
                  <Badge variant="outline" className="text-[8px] uppercase font-bold bg-primary/5 border-primary/10">
                    {archetype.workspace_domain}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{archetype.archetype_description}</p>
              </div>
              <div className="flex items-center gap-3 pr-10">
                <div className="hidden md:flex gap-1">
                  {archetype.archetype_keywords?.slice(0, 2).map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-[8px] px-2 py-0 bg-zinc-800 text-zinc-400 border-none">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {onDelete && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => { e.stopPropagation(); }}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                                variant="destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(archetype.id);
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Create New Card */}
      <Link href="/resources/archetypes/studio" className="group block h-full">
        <Card className="h-full min-h-[160px] flex flex-col items-center justify-center gap-3 border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer rounded-xl">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <PlusIcon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-primary transition-colors">
            Create New Archetype
          </span>
        </Card>
      </Link>

      {prompts.map((archetype) => (
        <WorkspaceCardHorizontal 
          key={archetype.id}
          title={archetype.archetype_name}
          description={archetype.archetype_description}
          href="#"
          badgeLabel={archetype.isDraft ? null : String(archetype.workspace_domain || "")}
          tags={Array.isArray(archetype.archetype_keywords) ? archetype.archetype_keywords : []}
          resourceId={archetype.id}
          isDraft={archetype.isDraft}
          onClick={() => onViewDetails(archetype.id)}
          onEdit={(e) => {
            e.preventDefault();
            router.push(`/resources/archetypes/studio/${archetype.id}`);
          }}
          onDelete={onDelete}
          colorName="default"
        />
      ))}
    </div>
  );
};
