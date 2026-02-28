import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { Layers, ChevronRight } from "lucide-react";
import { Project, ProjectStatus } from "../../../domain";

interface ProjectCardProps {
    readonly project: Project;
    readonly onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
    // Standardizing data access based on domain model
    const tags = project.project_keywords || [];
    const artifactsCount = project.artifacts?.length || 0;
    const status = project.project_status || project.status;
    const name = project.project_name || project.name;

    const getStatusLabel = (status: string | undefined) => {
        if (!status) return "Unknown";
        if (status === ProjectStatus.IN_PROGRESS || status === 'in_progress') return "In Progress";
        if (status === ProjectStatus.DONE || status === 'done' || status === 'completed') return "Completed";
        return status;
    };

    return (
        <button 
            className="text-left w-full h-full block group transition-transform active:scale-[0.98]"
            onClick={() => onViewDetails(project)}
        >
            <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-md cursor-pointer">
                <CardHeader className="pb-2">
                    <div className="flex flex-col space-y-1">
                        <CardTitle className="text-xl font-bold transition-colors group-hover:text-black dark:group-hover:text-white">
                            {name}
                        </CardTitle>
                        <span className="text-sm font-medium text-zinc-400">
                            {getStatusLabel(status)}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs text-zinc-500 font-medium">
                                {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                        ))}
                    </div>

                    {/* Artifacts Count */}
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                        <Layers size={16} />
                        Artifacts: {artifactsCount}
                    </div>
                </CardContent>
                <CardFooter className="pt-4 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 mt-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                        View Details
                    </span>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
                </CardFooter>
            </Card>
        </button>
    );
};
