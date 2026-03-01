import React from "react";
import { cn } from "@/shared/lib/utils";

/**
 * PURE ATOMS: Only these components are allowed to contain raw HTML tags.
 * They encapsulate the lowest level of layout and browser-native elements.
 */

export const BaseDiv: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
    <div {...props}>{children}</div>
);

export const UnstyledButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ children, ...props }, ref) => (
        <button {...props} ref={ref} className={cn("text-left w-full", props.className)}>
            {children}
        </button>
    )
);
UnstyledButton.displayName = "UnstyledButton";

export const BaseSpan: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ children, ...props }) => (
    <span {...props}>{children}</span>
);

export const BaseHeading3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, ...props }) => (
    <h3 {...props}>{children}</h3>
);

export const BaseParagraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => (
    <p {...props}>{children}</p>
);
