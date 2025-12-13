import React, { useState, useRef, useEffect } from "react";
import { useAgentSession } from "../hooks/use-agent-session";
import { AgentRole } from "../types";
import { SessionMessageBubble } from "./session-message-bubble";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, Loader2 } from "lucide-react";

interface ChatSessionViewProps {
    projectId: string;
    agentRole: AgentRole;
}

export const ChatSessionView: React.FC<ChatSessionViewProps> = ({ projectId, agentRole }) => {
    const { sessionHistory, submitUserQuery, isAgentThinking } = useAgentSession({ projectId, agentRole });
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [sessionHistory, isAgentThinking]);

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isAgentThinking) return;

        const query = inputValue;
        setInputValue("");
        await submitUserQuery(query);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmission(e);
        }
    };

    return (
        <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-background shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{agentRole} Agent</h3>
                    <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
            </div>

            {/* Message History */}
            <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col gap-6">
                    {sessionHistory.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 opacity-50">
                            Start a conversation with your {agentRole} Agent.
                        </div>
                    )}
                    
                    {sessionHistory.map((msg, idx) => (
                        <SessionMessageBubble key={idx} message={msg} />
                    ))}
                    
                    {isAgentThinking && (
                        <div className="flex justify-start">
                            <div className="bg-muted px-4 py-2 rounded-lg flex items-center gap-2 text-xs text-muted-foreground">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Agent is thinking...
                            </div>
                        </div>
                    )}
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
                        disabled={isAgentThinking}
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        disabled={!inputValue.trim() || isAgentThinking}
                        className="absolute right-2 bottom-2 h-8 w-8"
                    >
                        <SendIcon className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
