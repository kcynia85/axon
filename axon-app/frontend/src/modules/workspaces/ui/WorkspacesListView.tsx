"use client";

import React from "react";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { WorkspaceCard } from "./WorkspaceCard";
import { Card, CardHeader } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { WorkspacesListViewProps } from "./WorkspacesListView.types";

/**
 * WorkspacesListView: Pure view component for displaying workspaces.
 * Standard: Pure View pattern, 0% logic, 0% useEffect.
 */
export const WorkspacesListView = ({ 
  workspaces, 
  isLoading,
  isError,
  viewMode 
}: WorkspacesListViewProps) => {
  return (
    <div className="space-y-6">
      <ResourceList
        items={workspaces}
        isLoading={isLoading}
        isError={isError}
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
