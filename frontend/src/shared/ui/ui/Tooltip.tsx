"use client";

import * as React from "react";
import { Tooltip as HeroTooltip } from "@heroui/react";

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Tooltip = ({ children, content, ...props }: any) => {
  return (
    <HeroTooltip content={content} {...props}>
      {children}
    </HeroTooltip>
  );
};

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
