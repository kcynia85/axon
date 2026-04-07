"use client";

import React, { useRef } from "react";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { EmptyState } from "@/shared/ui/ui/EmptyState";
import { LucideIcon, SearchX, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";

export type ViewMode = "grid" | "list";

type ResourceListProps<T> = {
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
  readonly virtualize?: boolean;
  readonly itemHeight?: number; // Estimated height for virtualization
  readonly containerHeight?: string | number;
  readonly prependedItem?: React.ReactNode;
}

/**
 * ResourceList: Universal component for displaying lists of resources.
 * Supports grid/list modes, loading skeletons, error states, and virtualization.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const ResourceList = <T,>({
  items = [],
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
  virtualize = false,
  itemHeight = 150,
  containerHeight = "70vh",
  prependedItem,
}: ResourceListProps<T>) => {
  const parentReference = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items?.length ?? 0,
    getScrollElement: () => parentReference.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  if (isLoading) {
    if (renderSkeleton) {
      return <div className={containerClassName}>{renderSkeleton()}</div>;
    }
    
    const skeletonLayout = viewMode === "grid" ? gridClassName : listClassName;
    return (
      <div className={cn(skeletonLayout, containerClassName)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className={cn("h-40 w-full rounded-xl", viewMode === "list" && "h-24")} />
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

  if ((!items || items.length === 0) && !prependedItem) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  if (virtualize && viewMode === "list") {
    return (
      <div
        ref={parentReference}
        className={cn("overflow-auto", containerClassName)}
        style={{ height: containerHeight }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {prependedItem && (
            <div className="pb-3 w-full">
              {prependedItem}
            </div>
          )}
          {rowVirtualizer.getVirtualItems().map((virtualRowItem) => (
            <div
              key={virtualRowItem.index}
              style={{
                position: "absolute",
                top: prependedItem ? itemHeight : 0, // Simplified offset
                left: 0,
                width: "100%",
                height: `${virtualRowItem.size}px`,
                transform: `translateY(${virtualRowItem.start}px)`,
              }}
              className="pb-3" // Gap emulation
            >
              {renderItem(items[virtualRowItem.index])}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const layoutClassName = viewMode === "grid" ? gridClassName : listClassName;
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <div className={cn(layoutClassName, containerClassName)}>
      {prependedItem}
      {safeItems.map((resourceItem, index) => (
        <React.Fragment key={index}>
          {renderItem(resourceItem)}
        </React.Fragment>
      ))}
    </div>
  );
}
