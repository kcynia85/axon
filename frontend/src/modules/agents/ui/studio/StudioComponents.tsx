import * as React from "react";
import { cn } from "@/shared/lib/utils";

export const BigHeading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h2 className={cn("text-5xl md:text-7xl font-bold font-display tracking-tighter uppercase mb-12", className)}>
    {children}
  </h2>
);

export const NumericalIndex = ({ number, className }: { number: string | number, className?: string }) => (
  <div className={cn("font-mono text-sm font-bold opacity-30 mb-2", className)}>
    [{String(number).padStart(2, '0')}]
  </div>
);

export const StudioSection = ({ id, number, title, children, className }: { 
  id: string, 
  number: number, 
  title: string, 
  children: React.ReactNode,
  className?: string
}) => (
  <section id={id} className={cn("min-h-[60vh] py-24 border-b border-zinc-800 last:border-0", className)}>
    <NumericalIndex number={number} />
    <BigHeading>{title}</BigHeading>
    <div className="max-w-4xl">
      {children}
    </div>
  </section>
);

export const BorderlessInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-transparent border-none focus:ring-0 text-3xl font-bold p-0 placeholder:opacity-20 transition-all",
      className
    )}
    {...props}
  />
));
BorderlessInput.displayName = "BorderlessInput";

export const BorderlessTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full bg-transparent border-none focus:ring-0 text-xl leading-relaxed p-0 placeholder:opacity-20 resize-none transition-all",
      className
    )}
    {...props}
  />
));
BorderlessTextarea.displayName = "BorderlessTextarea";
