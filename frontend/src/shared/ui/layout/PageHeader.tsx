"use client";

import React from "react";
import type { PageHeaderProps } from "@/shared/lib/types/page-header";

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};
