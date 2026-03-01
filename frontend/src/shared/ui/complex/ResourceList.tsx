import React from "react";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { EmptyState } from "@/shared/ui/ui/EmptyState";
import { LucideIcon, SearchX, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface ResourceListProps<T> {
  readonly items: readonly T[] | undefined;
  readonly isLoading: boolean;
  readonly isError?: boolean;
  readonly errorTitle?: string;
  readonly errorMessage?: string;
  readonly renderItem: (item: T) => React.ReactNode;
  readonly renderSkeleton?: () => React.ReactNode;
  readonly emptyIcon?: LucideIcon;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyAction?: React.ReactNode;
  readonly viewMode?: ViewMode;
  readonly gridClassName?: string;
  readonly listClassName?: string;
  readonly containerClassName?: string;
}

export function ResourceList<T>({
  items,
  isLoading,
  isError = false,
  errorTitle = "Something went wrong",
  errorMessage = "Failed to load resources. Please try again later.",
  renderItem,
  renderSkeleton,
  emptyIcon = SearchX,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters to find what you're looking for.",
  emptyAction,
  viewMode = "grid",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  listClassName = "flex flex-col gap-3",
  containerClassName,
}: ResourceListProps<T>) {
  if (isLoading) {
    if (renderSkeleton) {
      return <div className={containerClassName}>{renderSkeleton()}</div>;
    }
    
    // Default skeleton layout
    const skeletonLayout = viewMode === "grid" ? gridClassName : listClassName;
    return (
      <div className={cn(skeletonLayout, containerClassName)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className={cn("h-40 w-full rounded-xl", viewMode === "list" && "h-24")} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title={errorTitle}
        description={errorMessage}
      />
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  const layoutClassName = viewMode === "grid" ? gridClassName : listClassName;

  return (
    <div className={cn(layoutClassName, containerClassName)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item)}
        </React.Fragment>
      ))}
    </div>
  );
}
