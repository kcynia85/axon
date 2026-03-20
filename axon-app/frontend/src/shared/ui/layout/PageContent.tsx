import React from "react";
import { cn } from "@/shared/lib/utils";

type PageContentProps = {
  readonly children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const PageContent = ({
  children,
  className,
  ...props
}: PageContentProps) => {
  return (
    <main className={cn("", className)} {...props}>
      {children}
    </main>
  );
}
