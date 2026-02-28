import React from "react";
import { Space } from "../domain";
import { SpaceCard } from "./SpaceCard";
import { SpaceListItem } from "./SpaceListItem";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/shared/ui/ui/Card";

export type ViewMode = 'grid' | 'list';

interface SpaceListProps {
    readonly spaces: readonly Space[];
    readonly viewMode?: ViewMode;
}

export const SpaceList: React.FC<SpaceListProps> = ({ spaces, viewMode = 'grid' }) => {
    if (spaces.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <p className="text-muted-foreground">No spaces found. Create one to get started.</p>
            </div>
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="flex flex-col gap-3">
                {spaces.map((space) => (
                    <SpaceListItem key={space.id} space={space} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
            ))}
            
            {/* Create New Space Card (only in grid mode) */}
            <Card className="flex flex-col items-center justify-center border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer min-h-[220px] group" asChild>
                <Link href="/spaces/new" className="flex flex-col items-center justify-center h-full w-full">
                    <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="h-6 w-6 text-zinc-500 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">Create New Space</span>
                </Link>
            </Card>
        </div>
    );
};
