"use client";

import React, { useMemo, useState } from "react";
import { useWorkspaces } from "../application/useWorkspaces";
import { ResourceList, ViewMode } from "@/shared/ui/complex/ResourceList";
import { WorkspaceCard } from "./WorkspaceCard";
import { Workspace } from "@/shared/domain/workspaces";
import { Card, CardHeader } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

type WorkspacesListProps = {
  readonly workspaces?: Workspace[];
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly viewMode?: ViewMode;
}

/**
 * WorkspacesList: Orchestrates the display of available workspaces.
 * Standard: 0% useEffect, Pure View.
 */
export const WorkspacesList = ({ 
  workspaces: providedWorkspaces, 
  isLoading: providedIsLoading,
  isError: providedIsError,
  viewMode: initialViewMode = "grid" 
}: WorkspacesListProps) => {
  const [viewMode] = useState<ViewMode>(initialViewMode);
  
  const { 
    data: fetchedWorkspaces, 
    isLoading, 
    isError 
  } = useWorkspaces();

  const workspaces = providedWorkspaces || fetchedWorkspaces || [];
  const actualIsLoading = providedIsLoading ?? isLoading;
  const actualIsError = providedIsError ?? isError;

  return (
    <div className="space-y-6">
      <ResourceList
        items={workspaces}
        isLoading={actualIsLoading}
        isError={actualIsError}
        viewMode={viewMode}
        virtualize={viewMode === "list"}
        emptyTitle="No workspaces found"
        emptyDescription="Create one to get started."
        renderItem={(workspace) => <WorkspaceCard workspace={workspace} key={workspace.id} />}
        renderSkeleton={() => (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="h-40 border-zinc-200 dark:border-zinc-800 opacity-50">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      />
    </div>
  );
};
