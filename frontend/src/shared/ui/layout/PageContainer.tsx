import React from "react";
import { cn } from "@/shared/lib/utils";

type PageContainerProps = {
  readonly children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const PageContainer = ({
  children,
  className,
  ...props
}: PageContainerProps) => {
  return (
    <div className={cn("container mx-auto py-10 px-4", className)} {...props}>
      {children}
    </div>
  );
}
