import React from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Layout } from "lucide-react";
import Link from "next/link";
import { 
    MainListItem, 
    MainListItemInfo, 
    MainListItemContent, 
    MainListItemActions 
} from "@/shared/ui/complex/MainListItem";
import type { SpaceListItemProps } from "./types";

export const SpaceListItem = ({ space }: SpaceListItemProps) => {
    return (
        <MainListItem href={`/spaces/${space.id}`}>
            <MainListItemInfo 
                title={space.name} 
                status={space.lastEdited} 
                icon={Layout} 
            />
            
            <MainListItemContent>
                <p className="text-xs text-zinc-500 line-clamp-1 font-medium">{space.description}</p>
            </MainListItemContent>

            <MainListItemActions>
                <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-[10px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <Link href={`/spaces/${space.id}`}>Open Canvas</Link>
                </Button>
            </MainListItemActions>
        </MainListItem>
    );
};
