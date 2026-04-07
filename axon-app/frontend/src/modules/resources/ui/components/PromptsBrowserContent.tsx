'use client';

import React from "react";
import { PromptArchetype } from "@/shared/domain/resources";
import { Card } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Sparkles, User } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { useRouter } from "next/navigation";

interface PromptsBrowserContentProps {
  readonly prompts: readonly (PromptArchetype & { isDraft?: boolean })[];
  readonly viewMode: "grid" | "list";
  readonly onViewDetails: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly isLoading: boolean;
  readonly isError: boolean;
}

/**
 * PromptsBrowserContent: Pure view component for the archetype gallery content.
 * Standard: Pure View pattern, 0% logic, 0% useEffect.
 */
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
      <div className="space-y-4">
        {prompts.map((archetype) => {
          const tags = Array.isArray(archetype.archetype_keywords) ? archetype.archetype_keywords : [];
          return (
            <ResourceCard 
              key={archetype.id}
              title={archetype.archetype_name || "Unnamed Archetype"}
              description={archetype.archetype_description}
              href="#"
              icon={User}
              badgeLabel={archetype.isDraft ? "DRAFT" : String(archetype.workspace_domain || "")}
              tags={tags}
              isDraft={archetype.isDraft}
              onClick={() => onViewDetails(archetype.id)}
              onEdit={(mouseEvent) => {
                mouseEvent.preventDefault();
                router.push(`/resources/archetypes/studio/${archetype.id}`);
              }}
              onDelete={onDelete ? (mouseEvent) => { mouseEvent.preventDefault(); onDelete(archetype.id); } : undefined}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((archetype) => {
        const tags = Array.isArray(archetype.archetype_keywords) ? archetype.archetype_keywords : [];
        return (
          <WorkspaceCardHorizontal 
            key={archetype.id}
            title={archetype.archetype_name || "Unnamed Archetype"}
            description={archetype.archetype_description}
            href="#"
            icon={User}
            badgeLabel={archetype.isDraft ? "DRAFT" : String(archetype.workspace_domain || "")}
            tags={tags}
            resourceId={archetype.id}
            isDraft={archetype.isDraft}
            onClick={() => onViewDetails(archetype.id)}
            onEdit={(mouseEvent) => {
              mouseEvent.preventDefault();
              router.push(`/resources/archetypes/studio/${archetype.id}`);
            }}
            onDelete={onDelete}
            colorName="default"
          />
        );
      })}
    </div>
  );
};
