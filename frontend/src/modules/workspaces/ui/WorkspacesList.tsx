"use client";

import React from "react";
import { useWorkspaces } from "../application/useWorkspaces";
import { ResourceList, ViewMode } from "@/shared/ui/complex/ResourceList";
import { WorkspaceCard } from "./WorkspaceCard";
import { Workspace } from "@/shared/domain/workspaces";
import { Card, CardHeader } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

interface WorkspacesListProps {
  readonly workspaces?: Workspace[];
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly viewMode?: ViewMode;
}

export const WorkspacesList: React.FC<WorkspacesListProps> = ({ 
  workspaces: providedWorkspaces, 
  isLoading: providedIsLoading,
  isError: providedIsError,
  viewMode = "grid" 
}) => {
  // Use provided props or fetch if not provided
  const hookResult = useWorkspaces();
  const workspaces = providedWorkspaces ?? hookResult.data;
  const isLoading = providedIsLoading ?? hookResult.isLoading;
  const isError = providedIsError ?? hookResult.isError;

  return (
    <ResourceList
      items={workspaces}
      isLoading={isLoading}
      isError={isError}
      viewMode={viewMode}
      emptyTitle="No workspaces found"
      emptyDescription="Create one to get started."
      renderItem={(workspace) => <WorkspaceCard workspace={workspace} />}
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
  );
};
