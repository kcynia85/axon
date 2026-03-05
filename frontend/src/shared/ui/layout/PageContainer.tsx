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
    <div className={cn("max-w-6xl mx-auto w-full pt-8 pb-10 px-4 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
