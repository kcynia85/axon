import React from "react";
import { Plus, LucideIcon, Upload } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export type FormFileUploadProps = {
    readonly label?: string;
    readonly description?: string;
    readonly icon?: LucideIcon;
    readonly onClick?: () => void;
    readonly onDrop?: (files: FileList) => void;
    readonly className?: string;
};

/**
 * FormFileUpload: A reusable form component for triggering file uploads.
 * Stylized with a large dashed border and hover effects. Supports Drag & Drop.
 */
export const FormFileUpload = ({
    label = "Dodaj plik zasobu",
    description = "PDF, MARKDOWN, DOCX (MAX 50MB)",
    icon: Icon = Plus,
    onClick,
    onDrop,
    className,
}: FormFileUploadProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'file-uploader',
    });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop?.(e.dataTransfer.files);
        }
    };

    return (
        <button 
            ref={setNodeRef}
            type="button"
            onClick={onClick} 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={cn(
                "w-full h-48 border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-950/30 hover:bg-zinc-900/50 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 group outline-none",
                isOver && "border-primary bg-primary/5 shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.3)]",
                className
            )}
        >
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all">
                {isOver ? <Upload className="w-7 h-7 text-primary animate-bounce" /> : <Icon className="w-7 h-7 text-zinc-600 group-hover:text-primary transition-colors" />}
            </div>
            <span className="text-zinc-500 group-hover:text-zinc-300 font-mono uppercase tracking-[0.3em] text-[16px] font-bold">
                {isOver ? "Upuść tutaj" : label}
            </span>
            <span className="text-zinc-700 group-hover:text-zinc-500 font-mono text-[12px] uppercase tracking-wider">
                {description}
            </span>
        </button>
    );
};
