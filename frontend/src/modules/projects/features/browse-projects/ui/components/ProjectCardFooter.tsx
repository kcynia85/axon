import React from "react";
import { CardFooter } from "@/shared/ui/ui/Card";
import { ChevronRight as ChevronIcon } from "lucide-react";
import { ProjectCardFooterProps } from "../types";
import { ProjectCardViewDetailsLabel } from "./ProjectActionAtoms";

export const ProjectCardFooter: React.FC<ProjectCardFooterProps> = () => {
    return (
        <CardFooter className="py-4 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 mt-auto">
            <ProjectCardViewDetailsLabel />
            <ChevronIcon size={14} className="text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
        </CardFooter>
    );
};
