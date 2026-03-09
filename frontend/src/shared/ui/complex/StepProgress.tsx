"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type Step = {
  id: string;
  label: string;
  number: number;
};

type StepProgressProps = {
  steps: Step[];
  currentStep: string; // id of current step
  completedSteps: string[]; // ids of completed steps
  onStepClick?: (stepId: string) => void;
  className?: string;
};

/**
 * 3-state Progress Indicator (Standard: Ukończone, Aktualny, Pozostałe)
 */
export const StepProgress = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className
}: StepProgressProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full px-6 py-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10", className)}>
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isCompleted = completedSteps.includes(step.id);
        const isPending = !isCurrent && !isCompleted;

        return (
          <React.Fragment key={step.id}>
            <div 
              className={cn(
                "flex items-center gap-3 transition-all duration-300",
                onStepClick && "cursor-pointer group"
              )}
              onClick={() => onStepClick?.(step.id)}
            >
              {/* Step Circle/Icon */}
              <div className={cn(
                "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                isCurrent && "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-110",
                isCompleted && "bg-primary/20 border-primary text-primary",
                isPending && "bg-muted/50 border-muted-foreground/30 text-muted-foreground border-dashed"
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold font-mono">{step.number}</span>
                )}
              </div>

              {/* Label */}
              <div className="flex flex-col">
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-widest transition-colors",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
                <span className="text-[8px] opacity-60 font-mono">
                  {isCurrent ? "In Progress" : isCompleted ? "Completed" : "Pending"}
                </span>
              </div>
            </div>

            {/* Separator Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-px bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
