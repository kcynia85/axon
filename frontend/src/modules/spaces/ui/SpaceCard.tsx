import React from "react";
import { Space } from "../domain";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { ProjectCardTitle } from "@/modules/projects/features/browse-projects/ui/components/ProjectTypography";
import { BaseSpan } from "@/modules/projects/features/browse-projects/ui/components/ProjectBaseAtoms";
import { ChevronRight as ChevronIcon, Layout, Link as LinkIcon, Globe } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

type SpaceCardProps = {
    readonly space: Space;
}

export const SpaceCard = ({ space }: SpaceCardProps) => {
    const isLinkedToProject = !!space.projectId;

    return (
        <Link href={`/spaces/${space.id}`} className="text-left w-full h-full block group transition-transform active:scale-[0.98]">
            <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-md cursor-pointer">
                <CardHeader className="pb-4 pt-6 flex flex-col items-start gap-3">
                    {/* Title Block - Fixed height to ensure alignment across cards */}
                    <div className="min-h-[56px] w-full flex items-start">
                        <div className="flex items-start gap-2">
                            <Layout className="h-5 w-5 text-primary mt-1 shrink-0" />
                            <ProjectCardTitle>{space.name}</ProjectCardTitle>
                        </div>
                    </div>
                    
                    {/* Project Link Status Pill */}
                    <div className="flex items-center h-6">
                        <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors",
                            isLinkedToProject 
                                ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" 
                                : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                        )}>
                            {isLinkedToProject ? (
                                <>
                                    <LinkIcon size={10} className="shrink-0" />
                                    <span>Linked: {space.projectName || 'Project'}</span>
                                </>
                            ) : (
                                <>
                                    <Globe size={10} className="shrink-0" />
                                    <span>Standalone</span>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pt-2 pb-6">
                    {/* Description removed for cleaner look */}
                </CardContent>

                <CardFooter className="py-4 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 mt-auto px-4 relative">
                    {/* Dummy element to balance the chevron on the right and keep text centered */}
                    <div className="w-4 h-4" /> 
                    
                    <BaseSpan className="text-[16px] font-black tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                        Open Space
                    </BaseSpan>
                    
                    <ChevronIcon size={16} className="text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
                </CardFooter>
            </Card>
        </Link>
    );
};
