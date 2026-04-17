import React from "react";
import { X } from "lucide-react";

export type CreateSpaceFormLayoutProps = {
    readonly projectName: string;
    readonly onClose: () => void;
};

export const CreateSpaceFormLayout: React.FC<CreateSpaceFormLayoutProps> = ({ 
    projectName, 
    onClose 
}) => {
    return (
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-end bg-zinc-50 dark:bg-zinc-900/30">
            <button 
                type="button"
                onClick={onClose}
                className="p-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
                <X className="h-6 w-6" />
            </button>
        </div>
    );
};
