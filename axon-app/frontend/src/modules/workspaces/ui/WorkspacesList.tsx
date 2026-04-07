"use client";

import React, { useState } from "react";
import { useWorkspaces } from "../application/useWorkspaces";
import { ViewMode } from "@/shared/ui/complex/ResourceList";
import { Workspace } from "@/shared/domain/workspaces";
import { WorkspacesListView } from "./WorkspacesListView";

type WorkspacesListProps = {
  readonly workspaces?: Workspace[];
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly viewMode?: ViewMode;
}

/**
 * WorkspacesList: Container component for the workspace list.
 * Standard: Container pattern, 0% UI declaration.
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
    isLoading: isWorkspaceLoading, 
    isError: hasWorkspaceError 
  } = useWorkspaces();

  const workspaces = providedWorkspaces || fetchedWorkspaces || [];
  const actualIsLoading = providedIsLoading ?? isWorkspaceLoading;
  const actualIsError = providedIsError ?? hasWorkspaceError;

  return (
    <WorkspacesListView
      workspaces={workspaces}
      isLoading={actualIsLoading}
      isError={actualIsError}
      viewMode={viewMode}
    />
  );
};
