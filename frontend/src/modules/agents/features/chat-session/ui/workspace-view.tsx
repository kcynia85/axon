"use client";

import { ChatSessionView, AgentRole } from "@/modules/agents";

interface WorkspaceViewProps {
    projectId: string;
}

export const WorkspaceView = ({ projectId }: WorkspaceViewProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
            <div className="border rounded-xl p-4 bg-muted/10 h-full flex flex-col">
                 <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Communication</h2>
                 <div className="flex-1 overflow-hidden">
                    <ChatSessionView 
                        projectId={projectId} 
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
        </div>
    );
};
