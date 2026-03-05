import React from "react";
import { Clock, Layout } from "lucide-react";
import { Space } from "../domain";
import { cn } from "@/shared/lib/utils";
import { ResourceQuickCard } from "@/shared/ui/complex/ResourceQuickCard";
import { ResourceQuickGrid } from "@/shared/ui/complex/ResourceQuickGrid";

type RecentlyUsedProps = {
  readonly spaces: readonly Space[];
  readonly className?: string;
}

export const RecentlyUsed = ({ spaces, className }: RecentlyUsedProps) => {
  if (spaces.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} />
          Recently Used
        </h3>
      </div>
      
      <ResourceQuickGrid>
        {spaces.slice(0, 3).map((space) => (
          <ResourceQuickCard 
            key={space.id}
            title={space.name}
            status={space.lastEdited}
            icon={Layout}
            href={`/spaces/${space.id}`}
          />
        ))}
      </ResourceQuickGrid>
    </div>
  );
};
