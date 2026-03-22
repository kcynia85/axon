import React from "react";
import { Plus, LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type FormFileUploadProps = {
    readonly label?: string;
    readonly description?: string;
    readonly icon?: LucideIcon;
    readonly onClick?: () => void;
    readonly className?: string;
};

/**
 * FormFileUpload: A reusable form component for triggering file uploads.
 * Stylized with a large dashed border and hover effects.
 */
export const FormFileUpload = ({
    label = "Dodaj plik zasobu",
    description = "PDF, MARKDOWN, DOCX (MAX 50MB)",
    icon: Icon = Plus,
    onClick,
    className,
}: FormFileUploadProps) => {
    return (
        <button 
            type="button"
            onClick={onClick} 
            className={cn(
                "w-full h-48 border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-950/30 hover:bg-zinc-900/50 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group outline-none",
                className
            )}
        >
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all">
                <Icon className="w-7 h-7 text-zinc-600 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-zinc-500 group-hover:text-zinc-300 font-mono uppercase tracking-[0.3em] text-[16px] font-bold">
                {label}
            </span>
            <span className="text-zinc-700 group-hover:text-zinc-500 font-mono text-[12px] uppercase tracking-wider">
                {description}
            </span>
        </button>
    );
};
