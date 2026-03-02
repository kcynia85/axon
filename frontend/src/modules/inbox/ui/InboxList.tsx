"use client";

import * as React from "react";
import { useInboxItems, useResolveInboxItem } from "../application/useInbox";
import {
    Check
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { InboxItem } from "@/shared/domain/inbox";
import { InboxEmptyState } from "./InboxEmptyState";

type InboxItemProps = {
    readonly item: InboxItem;
    readonly onResolve: (id: string) => void;
}

const InboxItemComponent = React.memo(({ 
    item, 
    onResolve 
}: InboxItemProps) => {
    const timeString = React.useMemo(() => 
        new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [item.created_at]);

    const isNew = item.item_status === "NEW";
    const isCritical = item.item_priority === "CRITICAL";

    return (
        <div
            className={cn(
                "group relative flex py-5 px-6 gap-5 border-b border-zinc-50 dark:border-zinc-900/50 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors cursor-default",
                !isNew && "opacity-40"
            )}
        >
            {/* Minimal Status Dot */}
            <div className="w-2 shrink-0 flex items-start justify-center pt-1.5">
                {isNew && (
                    <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-500",
                        isCritical 
                            ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                            : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    )} />
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline gap-4">
                    <span className={cn(
                        "text-[13px] leading-tight tracking-tight truncate transition-colors",
                        isNew ? "font-semibold text-zinc-900 dark:text-zinc-100" : "font-medium text-zinc-400"
                    )}>
                        {item.item_title}
                    </span>
                    <span className="text-[10px] tabular-nums text-zinc-400 font-medium tracking-tight">
                        {timeString}
                    </span>
                </div>
                
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest shrink-0">
                            {item.item_source}
                        </span>
                        {isCritical && (
                            <span className="text-[9px] font-black text-red-500/80 uppercase tracking-tighter">
                                • Priority
                            </span>
                        )}
                    </div>
                    <p className={cn(
                        "text-[12px] line-clamp-2 leading-relaxed font-medium transition-colors",
                        isNew ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"
                    )}>
                        {item.item_content}
                    </p>
                </div>
            </div>

            {/* Resolve Action - Matches New Project Modal "Done" style */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-start pt-0.5 shrink-0 ml-2 animate-in fade-in zoom-in">
                {isNew && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onResolve(item.id);
                        }}
                        className="flex items-center justify-center w-8 h-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none"
                    >
                        <Check className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
});

InboxItemComponent.displayName = "InboxItemComponent";

type InboxListProps = {
    readonly items: readonly InboxItem[];
    readonly isLoading: boolean;
}

export const InboxList = React.memo(({ 
    items, 
    isLoading 
}: InboxListProps) => {
    const { mutate: resolveItem } = useResolveInboxItem();

    const handleResolve = React.useCallback((id: string) => {
        resolveItem(id);
    }, [resolveItem]);

    if (isLoading) {
        return (
            <div className="space-y-0 px-0 py-2">
                {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex gap-4 py-5 px-6 border-b border-zinc-50 dark:border-zinc-900/50">
                        <div className="w-2 h-2 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-full mt-1.5" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                            <div className="h-3 w-full bg-zinc-50 dark:bg-zinc-900/50 animate-pulse rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return <InboxEmptyState />;
    }

    return (
        <div className="pb-20">
            {items.map((item) => (
                <InboxItemComponent 
                    key={item.id} 
                    item={item} 
                    onResolve={handleResolve} 
                />
            ))}
        </div>
    );
});

InboxList.displayName = "InboxList";
