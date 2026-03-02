import React from "react";
import { cn } from "@/shared/lib/utils";

type PageHeaderProps = {
  readonly title: string;
  readonly description?: string;
  readonly children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const PageHeader = ({
  title,
  description,
  className,
  children,
  ...props
}: PageHeaderProps) => {
  return (
    <header className={cn("mb-8 flex items-center justify-between", className)} {...props}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </header>
  );
}
