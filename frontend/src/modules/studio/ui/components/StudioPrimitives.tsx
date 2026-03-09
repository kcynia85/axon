import * as React from "react";
import { cn } from "@/shared/lib/utils";

/**
 * BigHeading: The standard typography for Studio section titles.
 */
export const BigHeading = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h2 className={cn("text-2xl md:text-3xl font-bold font-display tracking-tighter mb-8", className)}>
    {children}
  </h2>
);

/**
 * NumericalIndex: Monospaced index for sections (e.g. [01]).
 */
export const NumericalIndex = ({ number, className }: { number: string | number, className?: string }) => (
  <div className={cn("font-mono text-sm font-bold text-zinc-500 mb-2", className)}>
    [{String(number).padStart(2, '0')}]
  </div>
);

/**
 * StudioSection: A large vertical segment of the Studio editor.
 */
export const StudioSection = ({ id, number, title, children, className }: { 
  id: string, 
  number: number, 
  title: string, 
  children: React.ReactNode,
  className?: string
}) => (
  <section id={id} className={cn("min-h-[60vh] py-24 border-b border-zinc-800 last:border-0 scroll-mt-24", className)}>
    <NumericalIndex number={number} />
    <BigHeading className="text-white">{title}</BigHeading>
    <div className="max-w-4xl">
      {children}
    </div>
  </section>
);

/**
 * BorderlessInput: High-impact input matching the Project Modal aesthetic.
 */
export const BorderlessInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 focus:ring-0 text-base font-bold p-6 rounded-xl placeholder:text-zinc-400 dark:placeholder:text-zinc-700 transition-all text-zinc-900 dark:text-white shadow-inner",
      className
    )}
    {...props}
  />
));
BorderlessInput.displayName = "BorderlessInput";

/**
 * BorderlessTextarea: High-impact textarea matching the Project Modal aesthetic.
 */
export const BorderlessTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 focus:ring-0 text-base leading-relaxed px-6 py-4 rounded-xl placeholder:text-zinc-400 dark:placeholder:text-zinc-700 resize-none transition-all text-zinc-900 dark:text-white shadow-inner",
      className
    )}
    {...props}
  />
));
BorderlessTextarea.displayName = "BorderlessTextarea";
