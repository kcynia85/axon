import React from "react";
import { Breadcrumb } from "./breadcrumbs";

export type PageLayoutProps = {
  readonly title: string;
  readonly description?: string;
  readonly breadcrumbs?: readonly Breadcrumb[];
  readonly actions?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly pagination?: React.ReactNode;
  readonly showPagination?: boolean;
  readonly className?: string;
};
