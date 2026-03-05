import React from "react";

export type ModuleHeaderProps = {
  readonly title: string;
  readonly description?: string;
  readonly actions?: React.ReactNode;
};
