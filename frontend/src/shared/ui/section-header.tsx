import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
    title: string;
}

export const SectionHeader = ({ title, className, ...props }: SectionHeaderProps) => {
    return (
        <h2 className={cn("text-xl font-semibold mb-4", className)} {...props}>
            {title}
        </h2>
    );
};
