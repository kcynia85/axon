"use client";

import { useState, useRef, useEffect } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "../../../infrastructure/ai-provider";
import { SessionMessageBubble } from "./session-message-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon } from "lucide-react";
import { AgentRole } from "../../../domain";

interface ChatSessionViewProps {
    projectId: string;
    agentRole: AgentRole;
}

export const ChatSessionView: React.FC<ChatSessionViewProps> = ({ projectId, agentRole }) => {
    const [messages, setMessages] = useUIState<typeof AI>();
    const { submitUserMessage } = useActions<typeof AI>();
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSubmission = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const value = inputValue;
        setInputValue("");

        // 1. Optimistic User Message
        setMessages((current) => [
            ...current,
            {
                id: Date.now(),
                display: (
                    <SessionMessageBubble 
                        message={{
                            role: "user",
                            content: value,
                            timestamp: new Date().toISOString()
                        }} 
                    />
                ),
            },
        ]);

        try {
            // 2. Server Action (StreamUI)
            const responseMessage = await submitUserMessage(value, projectId);
            
            // 3. Append Server Response (which is already a React Node)
            setMessages((current) => [...current, responseMessage]);
        } catch (error) {
            console.error("Error submitting message:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmission();
        }
    };

    return (
        <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-background shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{agentRole} Agent</h3>
                    <p className="text-xs text-muted-foreground">Generative UI Enabled</p>
                </div>
            </div>

            {/* Message History */}
            <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col gap-6">
                    {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 opacity-50">
                            Start a conversation with your {agentRole} Agent.
                            <br/>Try asking for &quot;weather&quot; or &quot;chart&quot;.
                        </div>
                    )}
                    
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.display}
                        </div>
                    ))}
                    
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSubmission} className="flex gap-2 relative">
                    <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask ${agentRole} anything...`}
                        className="min-h-[50px] max-h-[150px] resize-none pr-12"
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        disabled={!inputValue.trim()}
                        className="absolute right-2 bottom-2 h-8 w-8"
                    >
                        <SendIcon className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
