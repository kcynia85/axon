"use client";

import React from "react";
import { Button, ButtonProps } from "@/shared/ui/ui/Button";
import { Plus, LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type ActionButtonProps = {
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly className?: string;
} & Omit<ButtonProps, "children">;

/**
 * ActionButton - Reusable primary action button (e.g. "+ Nowy projekt").
 * Encapsulates the standard large, bold style with an icon.
 * Supports asChild for integration with Next.js Link.
 */
export const ActionButton = ({ 
  label, 
  icon: Icon = Plus, 
  className, 
  size = "lg",
  variant = "default",
  children,
  ...props 
}: ActionButtonProps & { children?: React.ReactNode }) => {
  const innerContent = (
    <>
      <Icon className="h-4 w-4" />
      {label}
    </>
  );

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={cn("gap-2", className)} 
      {...props}
    >
      {props.asChild && React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement<any>, {}, innerContent)
      ) : (
        innerContent
      )}
    </Button>
  );
};
