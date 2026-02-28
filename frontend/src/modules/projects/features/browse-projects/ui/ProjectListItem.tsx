import React from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/ui/Button";
import { ExternalLink, Info, Layers } from "lucide-react";
import { Project, ProjectStatus } from "../../../domain";

interface ProjectListItemProps {
    readonly project: Project;
    readonly onViewDetails: (project: Project) => void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, onViewDetails }) => {
    // Using domain model properties with fallback to legacy field names
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-sm transition-all gap-4 group">
            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h3 className="text-base font-bold truncate">{name}</h3>
                    <span className="text-xs font-medium text-zinc-400">
                        {getStatusLabel(status)}
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-1">
                    {tags.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] text-zinc-500 font-medium lowercase">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                    ))}
                    {tags.length > 3 && <span className="text-[10px] text-zinc-400">+{tags.length - 3}</span>}
                </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                    <Layers size={14} />
                    {artifactsCount}
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 group/btn">
                        <Link href={`/projects/${project.id}/space`} className="flex items-center gap-2">
                            <ExternalLink size={14} className="text-zinc-400 group-hover/btn:text-black dark:group-hover/btn:text-white" />
                            Open Space
                        </Link>
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-3 text-[10px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 group/btn"
                        onClick={() => onViewDetails(project)}
                    >
                        <span className="flex items-center gap-2">
                            <Info size={14} className="text-zinc-400 group-hover/btn:text-black dark:group-hover/btn:text-white" />
                            Details
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
