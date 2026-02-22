"use client";

import { X } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SidePeekProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
}

/**
 * SidePeek - A consistent side panel for detailed views.
 * Animates from the right.
 */
export const SidePeek = ({
  title,
  subtitle,
  children,
  onClose,
  footer
}: SidePeekProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (onClose) onClose();
      else router.back();
    }, 200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-card border-l z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t bg-muted/20">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};
