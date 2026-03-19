"use client";

import React from "react";
import { useTrash } from "@/modules/workspaces/application/useTrash";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Trash2, RotateCcw, Clock } from "lucide-react";
import { Card } from "@/shared/ui/ui/Card";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

const TrashPage = () => {
  const { data: trashItems, isLoading } = useTrash();

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
          <Trash2 className="w-8 h-8" /> Kosz
        </h1>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-zinc-900 dark:text-white">
          <Trash2 className="w-10 h-10 text-red-500" /> Kosz
        </h1>
        <p className="text-zinc-500 font-medium">
          Elementy w koszu zostaną trwale usunięte po 30 dniach.
        </p>
      </div>

      {!trashItems || trashItems.length === 0 ? (
        <Card className="border-dashed h-64 flex flex-col items-center justify-center text-muted-foreground gap-4 bg-muted/5 rounded-3xl">
          <Trash2 className="w-12 h-12 opacity-20" />
          <p className="text-lg font-bold italic">Twój kosz jest pusty</p>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {trashItems.map((item) => (
            <WorkspaceCardHorizontal
              key={item.id}
              title={item.name}
              description={`Typ: ${item.type}`}
              badgeLabel={item.type.toUpperCase()}
              href="#"
              resourceId={item.id}
              footerContent={
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <Clock className="w-3 h-3" />
                  Usunięto {formatDistanceToNow(new Date(item.deleted_at), { addSuffix: true, locale: pl })}
                </div>
              }
              // We'll add restore functionality later
              onEdit={() => {}} 
              className="opacity-80 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
