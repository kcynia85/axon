import React from "react";
import { TableCell, TableRow } from "@/shared/ui/ui/Table";
import { StatusBadge } from "@/shared/ui/complex/StatusBadge";
import Link from "next/link";
import type { SpaceListItemProperties } from "./types";

/**
 * SpaceListItem component displays a single space in a list format.
 * Adheres to Pure View principles and full naming conventions.
 */
export const SpaceListItem = ({ space: spaceItem }: SpaceListItemProperties) => {
  return (
    <TableRow className="group hover:bg-zinc-50 dark:hover:bg-white/[0.02] border-zinc-100 dark:border-zinc-900 transition-colors">
      <TableCell className="py-5 px-6">
        <Link href={`/spaces/${spaceItem.id}`} className="flex items-center gap-4">
          <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{spaceItem.name}</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight" suppressHydrationWarning>
              Created {new Date(spaceItem.created_at).toLocaleDateString()}
            </span>
          </div>
        </Link>
      </TableCell>
      <TableCell className="py-5 px-6">
        <span className="text-xs font-medium text-zinc-500">{spaceItem.project_name || "No Project"}</span>
      </TableCell>
      <TableCell className="py-5 px-6">
        <StatusBadge status={spaceItem.status} />
      </TableCell>
      <TableCell className="py-5 px-6 text-right font-mono text-[10px] text-zinc-400">
        {spaceItem.nodes_count || 0} nodes
      </TableCell>
    </TableRow>
  );
};
