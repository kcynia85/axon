import React from "react";

export type PageHeaderProps = {
  readonly title: string;
  readonly description?: string;
  readonly actions?: React.ReactNode;
};
