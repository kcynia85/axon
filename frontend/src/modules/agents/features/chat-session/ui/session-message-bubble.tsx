import React from "react";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "../../../domain";
import { User, Bot } from "lucide-react";

interface SessionMessageBubbleProps {
    message: Message;
}

export const SessionMessageBubble: React.FC<SessionMessageBubbleProps> = ({ message }) => {
    const isUser = message.role === "user";
    const isSystem = message.role === "system";

    return (
        <div className={cn(
            "flex w-full",
            isUser ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                isSystem && "bg-destructive/10 text-destructive border border-destructive/20"
            )}>
                <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                </div>
            </div>
        </div>
    );
};
