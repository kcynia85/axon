import React from "react";
import { Clock } from "lucide-react";
import { QuickAccessCard } from "@/shared/ui/complex/QuickAccessCard";
import { QuickAccessGrid } from "@/shared/ui/complex/QuickAccessGrid";
import { cn } from "@/shared/lib/utils";
import type { RecentlyUsedProperties } from "./types";

export const RecentlyUsed = ({ spaces: recentlyUsedSpaces, className: containerClassName }: RecentlyUsedProperties) => {
  return (
    <div className={cn("space-y-6", containerClassName)}>
      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 dark:border-zinc-900 pb-2 w-full px-1">
        <Clock className="w-3.5 h-3.5" />
        Recently Used Spaces
      </div>

      <QuickAccessGrid>
        {recentlyUsedSpaces.map((spaceItem) => (
          <QuickAccessCard
            key={spaceItem.id}
            title={spaceItem.name}
            badge="Space"
            status={`Created ${new Date(spaceItem.created_at).toLocaleDateString()}`}
            href={`/spaces/${spaceItem.id}`}
          />
        ))}
      </QuickAccessGrid>
    </div>
  );
};
