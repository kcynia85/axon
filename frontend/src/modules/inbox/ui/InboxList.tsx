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

export const InboxList = () => {
    const { data: items, isLoading } = useInboxItems();
    const { mutate: resolveItem } = useResolveInboxItem();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((index) => <Skeleton key={index} className="h-20 w-full" />)}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground italic gap-2 text-center border border-dashed rounded-lg">
                <InboxIcon className="w-10 h-10 opacity-10" />
                <p className="text-sm">Inbox Zero. All tactical signals cleared.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <Card
                    key={item.id}
                    className={cn(
                        "group hover:border-primary/50 transition-all border-l-4",
                        item.item_status === "Pending" ? "border-l-orange-500" : "border-l-muted opacity-60"
                    )}
                >
                    <div className="flex p-4 gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            item.item_priority === "Critical" ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"
                        )}>
                            {getIconForType(item.item_type)}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold leading-none">{item.item_title}</span>
                                    <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 uppercase font-mono tracking-tighter">
                                        {item.item_source}
                                    </Badge>
                                </div>
                                <span className="text-[9px] text-muted-foreground font-mono">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                                {item.item_content}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {item.item_status === "Pending" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-full hover:bg-green-500/10 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => resolveItem(item.id)}
                                >
                                    <Check className="w-4 h-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

const getIconForType = (type: string) => {
    switch (type) {
        case "Approval": return <CheckCircle2 className="w-5 h-5" />;
        case "Log": return <InboxIcon className="w-5 h-5" />;
        case "Alert": return <AlertCircle className="w-5 h-5" />;
        case "Task": return <Clock className="w-5 h-5" />;
        default: return <MessageSquare className="w-5 h-5" />;
    }
};
