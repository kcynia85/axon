import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { ExternalLink, Info, Layers } from "lucide-react";
import { Project, ProjectStatus } from "../../../domain";

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    // Mock tags and artifacts count for demo/breadboard purposes if not present
    const tags = (project as any).project_keywords || ["#design", "#growth&market"];
    const artifactsCount = (project as any).artifacts?.length || 3;
    const status = project.status || (project as any).project_status;
    const name = project.name || (project as any).project_name;

    const getStatusLabel = (status: string) => {
        if (status === ProjectStatus.IN_PROGRESS || status === 'in_progress') return "In Progress";
        if (status === ProjectStatus.DONE || status === 'done' || status === 'completed') return "Completed";
        return status;
    };

    return (
        <Card className="hover:shadow-md transition-shadow h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex flex-col space-y-1">
                    <CardTitle className="text-xl font-bold">{name}</CardTitle>
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
            <CardFooter className="pt-2 flex flex-col space-y-2 border-t border-zinc-50 dark:border-zinc-900 mt-auto">
                <Button asChild variant="ghost" className="w-full justify-start text-sm font-bold h-9 hover:bg-zinc-100 dark:hover:bg-zinc-900 group">
                    <Link href={`/projects/${project.id}/space`} className="flex items-center gap-2">
                        <ExternalLink size={16} className="text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                        Open Space
                    </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-sm font-bold h-9 hover:bg-zinc-100 dark:hover:bg-zinc-900 group">
                    <Link href={`/projects/${project.id}`} className="flex items-center gap-2">
                        <Info size={16} className="text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};
