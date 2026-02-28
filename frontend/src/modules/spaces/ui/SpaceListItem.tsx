import React from "react";
import { Space } from "../domain";
import { Card } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { Layout } from "lucide-react";
import Link from "next/link";

interface SpaceListItemProps {
    readonly space: Space;
}

export const SpaceListItem: React.FC<SpaceListItemProps> = ({ space }) => {
    return (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-primary/10 transition-colors">
                <Layout className="h-5 w-5 text-zinc-500 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold group-hover:text-black dark:group-hover:text-white transition-colors">{space.name}</h3>
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">{space.lastEdited}</p>
              </div>
            </div>
            
            <div className="flex-1 px-12 hidden md:block">
              <p className="text-xs text-zinc-500 line-clamp-1">{space.description}</p>
            </div>

            <Button variant="ghost" size="sm" asChild className="h-8 px-3 text-[10px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900">
              <Link href={`/spaces/${space.id}`}>Open Canvas</Link>
            </Button>
          </div>
        </Card>
    );
};
