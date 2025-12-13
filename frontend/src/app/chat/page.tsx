"use client";

import React from "react";
import { ChatSessionView } from "@/modules/agents/components/chat-session-view";
import { AgentRole } from "@/modules/agents/types";

export default function ChatPage() {
    // For MVP, we mock the project ID. In real app, this comes from params/context.
    const MOCK_PROJECT_ID = "00000000-0000-0000-0000-000000000000";

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Agent Session</h1>
                <p className="text-muted-foreground mt-2">
                    Interact with your project agents.
                </p>
            </header>

            <main>
                <ChatSessionView 
                    projectId={MOCK_PROJECT_ID} 
                    agentRole={AgentRole.MANAGER} 
                />
            </main>
        </div>
    );
}
