"use client";

import React from "react";
import type { PageHeaderProps } from "@/shared/lib/types/page-header";

/**
 * PageHeader: Displays title, description, and actions.
 * Standard: Pure View, accepts actions via prop or children.
 */
export const PageHeader = ({ title, description, actions, children }: PageHeaderProps) => {
  const finalActions = actions || children;

  return (
    <div className="flex flex-col space-y-6 pt-6 pb-4">
      <div className="flex justify-between items-start w-full">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg max-w-2xl pb-3">
              {description}
            </p>
          )}
        </div>
        {finalActions && (
          <div className="shrink-0">
            {finalActions}
          </div>
        )}
      </div>
    </div>
  );
};
