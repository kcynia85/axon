import { Workspace } from "@/shared/domain/workspaces";
import { ViewMode } from "@/shared/ui/complex/ResourceList";

export type WorkspacesListViewProps = {
  readonly workspaces: readonly Workspace[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly viewMode: ViewMode;
};
