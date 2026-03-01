import React from "react";
import { Card } from "@/shared/ui/ui/Card";
import { ProjectCardProps } from "./types";
import { ProjectCardHeader } from "./components/ProjectCardHeader";
import { ProjectCardContent } from "./components/ProjectCardContent";
import { ProjectCardFooter } from "./components/ProjectCardFooter";

export const ProjectCard: React.FC<ProjectCardProps> = ({ viewModel, onViewDetails }) => {
    return (
        <button 
            className="text-left w-full h-full block group transition-transform active:scale-[0.98]"
            onClick={() => onViewDetails(viewModel.id)}
        >
            <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-md cursor-pointer">
                <ProjectCardHeader 
                    title={viewModel.title}
                    statusLabel={viewModel.statusLabel}
                    statusVariant={viewModel.statusVariant}
                />
                
                <ProjectCardContent 
                    tags={viewModel.displayTags}
                    artifactsCount={viewModel.artifactsCount}
                />

                <ProjectCardFooter />
            </Card>
        </button>
    );
};
