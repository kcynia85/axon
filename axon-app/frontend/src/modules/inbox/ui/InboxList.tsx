"use client";

import * as React from "react";
import { useResolveInboxItem } from "../application/useInbox";
import {
    Check,
    AlertCircle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { InboxItem } from "@/shared/domain/inbox";
import { InboxEmptyState } from "./InboxEmptyState";
import { is } from "date-fns/locale/is";

type InboxItemProps = {
    readonly item: InboxItem;
    readonly onResolve: (itemId: string) => void;
}

/**
 * InboxItemComponent: Single notification row.
 * Standard: Pure View pattern, Zero manual memoization.
 */
const InboxItemComponent = ({ 
    item, 
    onResolve 
}: InboxItemProps) => {
    // Zero manual optimization - React Compiler handles it
    const timeString = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const isNew = item.item_status === "NEW";
    const isError = item.item_type === "ERROR_ALERT";

    // Simplified informative labels
    const getSourceLabel = (source: string, type: string) => {
        if (source === "System Awareness") return "System";
        if (source === "Knowledge Engine") return "Knowledge";
        if (type === "ARTIFACT_READY") return "Artefact";
        return source;
    };

    return (
        <div
            className={cn(
                "group relative flex py-5 px-6 gap-5 border-b border-zinc-50 dark:border-zinc-900/50 hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors cursor-default",
                !isNew && "opacity-40",
                isError && isNew && "bg-red-500/5"
            )}
        >
            {/* Status Indicator (Icon or Dot) */}
            <div className="w-4 shrink-0 flex items-start justify-center pt-1.5">
                {isNew && (
                    isError ? (
                        <AlertCircle size={16} className="text-red-500" />
                    ) : (
                        <div className={cn(
                            "w-2 h-2 rounded-full transition-all duration-500",
                            "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        )} />
                    )
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline gap-4">
                    <span className={cn(
                        "text-[14px] leading-tight tracking-tight truncate transition-colors font-semibold",
                        isError 
                            ? "text-red-500" 
                            : (isNew ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 font-medium")
                    )}>
                        {item.item_title}
                    </span>
                    <span className="text-[12px] text-zinc-400 font-medium tracking-tight">
                        {isError ? null : timeString} 
                    </span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                    {!isError ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] font-bold transition-colors text-zinc-400 dark:text-zinc-500">
                                {getSourceLabel(item.item_source, item.item_type)}
                            </span>
                        </div>
                    ) : (
                        isNew && (
                            <p className="text-[12px] text-red-500/70 font-medium line-clamp-1 ">
                                {item.item_content}
                            </p>
                        )
                    )}
                </div>
            </div>

            {/* Resolve Action */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-start pt-0.5 shrink-0 ml-2 animate-in fade-in zoom-in">
                {isNew && (
                    <button
                        onClick={(mouseEvent) => {
                            mouseEvent.stopPropagation();
                            onResolve(item.id);
                        }}
                        className={cn(
                            "flex items-center justify-center w-8 h-8 transition-colors outline-none",
                            isError ? "text-red-400 hover:text-red-600" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                        )}
                    >
                        <Check className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

type InboxListProps = {
    readonly items: readonly InboxItem[];
    readonly isLoading: boolean;
}

/**
 * InboxList: List container for notifications.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const InboxList = ({ 
    items, 
    isLoading 
}: InboxListProps) => {
    const { mutate: resolveItem } = useResolveInboxItem();

    const handleResolve = (itemId: string) => {
        resolveItem(itemId);
    };

    if (isLoading) {
        return (
            <div className="space-y-0 px-0 py-2">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="flex gap-4 py-5 px-6 border-b border-zinc-50 dark:border-zinc-900/50">
                        <div className="w-2 h-2 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-full mt-1.5" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
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
            {items.map((inboxItem) => (
                <InboxItemComponent 
                    key={inboxItem.id} 
                    item={inboxItem} 
                    onResolve={handleResolve} 
                />
            ))}
        </div>
    );
};
