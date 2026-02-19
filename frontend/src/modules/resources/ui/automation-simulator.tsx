"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Box, Play, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/ui/button";
import { cn } from "@/shared/lib/utils";

export const AutomationSimulator = () => {
    const [status, setStatus] = React.useState<"idle" | "running" | "success" | "error">("idle");
    const [logs, setLogs] = React.useState<string[]>([]);

    const runTest = () => {
        setStatus("running");
        setLogs(["[SYSTEM] Initiating handshake with n8n instance...", "[NETWORK] Connection established.", "[DATA] Serializing payload: { user_id: '123', task: 'generate_report' }"]);

        setTimeout(() => {
            setLogs(prev => [...prev, "[TARGET] Webhook received. Processing..."]);
            setTimeout(() => {
                setLogs(prev => [...prev, "[SUCCESS] Automation instance #4235 completed in 840ms."]);
                setStatus("success");
            }, 1000);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Play className="w-4 h-4" /> Lab Execution
                </h3>
                <Button size="sm" className="h-8 gap-2" onClick={runTest} disabled={status === "running"}>
                    {status === "running" ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    Trigger Sequence
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardHeader className="p-4 border-b bg-muted/20">
                        <CardTitle className="text-xs font-bold font-mono">Real-time Telemetry</CardTitle>
                    </CardHeader>
                    <div className="p-4 h-64 bg-background font-mono text-[10px] space-y-2 overflow-y-auto">
                        {logs.map((log, i) => (
                            <div key={i} className={cn(
                                "flex gap-2",
                                log.includes("SUCCESS") ? "text-green-500" :
                                    log.includes("SYSTEM") ? "text-primary font-bold" : "text-muted-foreground"
                            )}>
                                <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span>
                                <span>{log}</span>
                            </div>
                        ))}
                        {logs.length === 0 && <span className="italic opacity-30">Await trigger command...</span>}
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader className="p-4 border-b bg-muted/20">
                        <CardTitle className="text-xs font-bold">Health Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-6">
                        <div className="space-y-1">
                            <span className="text-[8px] uppercase font-bold text-muted-foreground">Status</span>
                            <div className="flex items-center gap-2">
                                {status === "success" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                                    status === "running" ? <RefreshCw className="w-4 h-4 animate-spin text-primary" /> :
                                        <Box className="w-4 h-4 text-muted-foreground" />}
                                <span className="text-sm font-bold capitalize">{status}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] uppercase font-bold text-muted-foreground">Latency</span>
                            <p className="text-xs font-mono">0ms</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
