import React from "react";
import { Space } from "../domain";
import { 
    MainCard, 
    MainCardHeader, 
    MainCardContent, 
    MainCardFooter 
} from "@/shared/ui/complex/MainCard";
import { Link as LinkIcon, Globe, Layout } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type SpaceCardProps = {
    readonly space: Space;
}

export const SpaceCard = ({ space }: SpaceCardProps) => {
    const isLinkedToProject = !!space.projectId;

    return (
        <MainCard href={`/spaces/${space.id}`}>
            <MainCardHeader title={space.name} icon={Layout}>
                {/* Project Link Status Pill */}
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
            </MainCardHeader>

            <MainCardContent>
                {/* Space content area (description removed as requested earlier) */}
            </MainCardContent>

            <MainCardFooter label="Open Space" />
        </MainCard>
    );
};
