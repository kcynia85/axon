"use client";

import * as React from "react";
import { useInboxItems, useResolveInboxItem } from "../application/useInbox";
import { Card } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
    Inbox as InboxIcon,
    CheckCircle2,
    AlertCircle,
    Clock,
    MessageSquare,
    MoreVertical,
    Check
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import { InboxItem } from "@/shared/domain/inbox";
import { InboxEmptyState } from "./InboxEmptyState";

const InboxItemComponent = React.memo(({ 
    item, 
    onResolve 
}: { 
    item: InboxItem; 
    onResolve: (id: string) => void 
}) => {
    const timeString = React.useMemo(() => 
        new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [item.created_at]);

    return (
        <div
            className={cn(
                "group relative flex p-4 gap-4 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all",
                item.item_status === "Pending" ? "border-l-2 border-l-blue-500" : "opacity-60"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                item.item_priority === "Critical" 
                    ? "bg-red-500/10 text-red-500 border-red-500/20" 
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800"
            )}>
                {getIconForType(item.item_type)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold leading-none text-zinc-900 dark:text-zinc-100">{item.item_title}</span>
                        <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0 uppercase font-black tracking-tighter bg-zinc-100 dark:bg-zinc-900 border-none">
                            {item.item_source}
                        </Badge>
                    </div>
                    <span className="text-[9px] text-zinc-400 font-mono" suppressHydrationWarning>
                        {timeString}
                    </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.item_content}
                </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.item_status === "Pending" && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:bg-blue-500/10 hover:text-blue-600"
                        onClick={() => onResolve(item.id)}
                    >
                        <Check className="w-4 h-4" />
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-zinc-400" />
                </Button>
            </div>
        </div>
    );
});

InboxItemComponent.displayName = "InboxItemComponent";

export const InboxList = React.memo(({ 
    items, 
    isLoading 
}: { 
    items: readonly InboxItem[]; 
    isLoading: boolean 
}) => {
    const { mutate: resolveItem } = useResolveInboxItem();

    const handleResolve = React.useCallback((id: string) => {
        resolveItem(id);
    }, [resolveItem]);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="h-20 w-full bg-zinc-100/50 dark:bg-zinc-900/50 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return <InboxEmptyState />;
    }

    return (
        <div className="space-y-3">
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

const getIconForType = (type: string) => {
    switch (type) {
        case "Approval": return <CheckCircle2 className="w-5 h-5" />;
        case "Log": return <InboxIcon className="w-5 h-5" />;
        case "Alert": return <AlertCircle className="w-5 h-5" />;
        case "Task": return <Clock className="w-5 h-5" />;
        default: return <MessageSquare className="w-5 h-5" />;
    }
};
