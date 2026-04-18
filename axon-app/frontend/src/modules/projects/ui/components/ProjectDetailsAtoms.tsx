import React from "react";
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import Link from "next/link";
import { BaseParagraph, BaseDiv } from "./ProjectBaseAtoms";

export const ProjectDetailsTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl font-bold">{children}</h2>
);

export const ProjectDetailsValue: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <BaseParagraph className={className || "text-sm font-bold"}>{children}</BaseParagraph>
);

export const ProjectDetailsSecondaryValue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseParagraph className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{children}</BaseParagraph>
);

export const ProjectDetailsActionGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="pt-4 flex flex-col space-y-2">{children}</BaseDiv>
);

export const ProjectDetailsEditButton: React.FC = () => (
    <Button variant="ghost" className="justify-start px-0 text-sm font-bold hover:bg-transparent group h-auto py-2">
        <Edit className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
        Edit project
    </Button>
);

export const ProjectDetailsOpenSpaceButton: React.FC<{ href: string }> = ({ href }) => (
    <Button asChild variant="ghost" className="justify-start px-0 text-sm font-bold hover:bg-transparent group h-auto py-2">
        <Link href={href}>
            <ExternalLink className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
            Open space
        </Link>
    </Button>
);

export const ProjectDetailsDeleteButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
    <Button 
        variant="ghost" 
        className="justify-start px-0 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-transparent group h-auto pt-4" 
        onClick={onClick}
        disabled={disabled}
    >
        <Trash2 className="mr-3 h-4 w-4 text-red-300 group-hover:text-red-500" />
        {disabled ? "Deleting..." : "Delete project"}
    </Button>
);

export const ProjectDetailsAddResourceButton: React.FC = () => (
    <Button variant="ghost" className="justify-start px-0 text-sm font-bold hover:bg-transparent group h-auto w-fit py-2">
        <Plus className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
        Add resource
    </Button>
);
