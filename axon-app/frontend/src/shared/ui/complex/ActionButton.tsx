"use client";

import React, { useCallback, useRef } from "react";
import { Button, ButtonProps } from "@/shared/ui/ui/Button";
import { Plus, LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useIsMutating } from "@tanstack/react-query";

type ActionButtonProps = {
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly className?: string;
  readonly debounceMs?: number;
} & Omit<ButtonProps, "children">;

/**
 * ActionButton - Reusable primary action button (e.g. "+ Nowy projekt").
 * Encapsulates the standard large, bold style with an icon.
 * Supports asChild for integration with Next.js Link.
 * Integrates with TanStack Query for debouncing and global mutation states.
 */
export const ActionButton = ({ 
  label, 
  icon: Icon = Plus, 
  className, 
  size = "lg",
  variant = "default",
  children,
  onClick,
  debounceMs = 400,
  ...props 
}: ActionButtonProps & { children?: React.ReactNode }) => {
  // Global mutation state check (e.g. if any 'create' mutation is in progress)
  const isAnyCreating = useIsMutating({
    predicate: (mutation) => mutation.options.mutationKey?.some(key => 
      typeof key === 'string' && key.startsWith('create-')
    ) ?? false
  }) > 0;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDebouncedClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (timerRef.current) return; // Ignore rapid clicks

    if (onClick) {
      onClick(e);
    }

    // Set a short cooling period to prevent accidental double clicks 
    // before the mutation state kicks in
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
    }, debounceMs);
  }, [onClick, debounceMs]);

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
      loading={props.loading || isAnyCreating}
      onClick={handleDebouncedClick}
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
