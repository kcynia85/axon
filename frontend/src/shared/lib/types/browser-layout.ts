import React from "react";

export type BrowserLayoutProps = {
  readonly searchQuery?: string;
  readonly onSearchChange?: (query: string) => void;
  readonly searchPlaceholder?: string;
  readonly activeFilters?: React.ReactNode;
  readonly actionBar?: React.ReactNode;
  readonly topContent?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly className?: string;
};
