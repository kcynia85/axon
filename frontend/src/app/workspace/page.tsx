"use client";

import React from "react";
import { ChatSessionView } from "@/modules/agents/components/chat-session-view";
import { AgentRole } from "@/modules/agents/types";

export default function WorkspacePage() {
    // For MVP, we mock the project ID. In real app, this comes from params/context.
    const MOCK_PROJECT_ID = "00000000-0000-0000-0000-000000000000";

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
                    <p className="text-muted-foreground mt-1">
                        Operations Center: Chat & Artifacts
                    </p>
                </div>
                {/* Future: Agent Selector here */}
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
                <div className="border rounded-xl p-4 bg-muted/10 h-full flex flex-col">
                     <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Communication</h2>
                     <div className="flex-1 overflow-hidden">
                        <ChatSessionView 
                            projectId={MOCK_PROJECT_ID} 
                            agentRole={AgentRole.MANAGER} 
                        />
                     </div>
                </div>
                <div className="border rounded-xl p-4 bg-muted/10 h-full hidden lg:flex flex-col items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <h2 className="text-lg font-medium mb-2">Artifact Split-View</h2>
                        <p className="text-sm">Generated content will appear here.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}