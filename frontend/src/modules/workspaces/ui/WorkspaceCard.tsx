import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import Link from "next/link";
import { Workspace } from "@/shared/domain/workspaces";

interface WorkspaceCardProps {
    readonly workspace: Workspace;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace }) => {
    const { id, name, description, updated_at } = workspace;
    
    return (
        <Link href={`/workspaces/${id}`} className="block h-full group">
            <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-md cursor-pointer">
                <CardHeader>
                    <CardTitle className="transition-colors group-hover:text-black dark:group-hover:text-white">
                        {name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400" suppressHydrationWarning>
                        Updated: {updated_at ? new Date(updated_at).toLocaleDateString() : "—"}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
};
