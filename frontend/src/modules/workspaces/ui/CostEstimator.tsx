"use client";

import { Card, CardContent } from "@/shared/ui/ui/Card";
import { Coins, Zap, Database, MessageSquare } from "lucide-react";

interface CostEstimateProps {
    estimate: {
        staticCost: number;
        dynamicCost: number;
        totalEstimate: number;
        breakdown: {
            agentSetup: number;
            ragUsage: number;
            toolCalls: number;
            inputTokens: number;
            outputTokens: number;
        };
        suggestions?: string[];
    };
}

export const CostEstimator = ({ estimate }: CostEstimateProps) => {
    return (
        <Card className="bg-muted/50 border-none">
            <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estimated Turn Cost</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-primary">
                        ${estimate.totalEstimate.toFixed(3)}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <CostItem
                        icon={<Zap className="w-3 h-3" />}
                        label="Agent Logic"
                        value={estimate.breakdown.agentSetup}
                    />
                    <CostItem
                        icon={<Database className="w-3 h-3" />}
                        label="RAG Engine"
                        value={estimate.breakdown.ragUsage}
                    />
                    <CostItem
                        icon={<Coins className="w-3 h-3" />}
                        label="Tool Exec"
                        value={estimate.breakdown.toolCalls}
                    />
                    <CostItem
                        icon={<MessageSquare className="w-3 h-3" />}
                        label="Context IO"
                        value={estimate.breakdown.inputTokens + estimate.breakdown.outputTokens}
                    />
                </div>

                {estimate.suggestions && estimate.suggestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-muted-foreground/10">
                        <div className="text-[10px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                            <Zap className="w-2 h-2 text-yellow-500" /> OPTIMIZATION TIPS
                        </div>
                        <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-3">
                            {estimate.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const CostItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
    <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-muted-foreground/10">
        <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{icon}</span>
            <span className="text-[10px] uppercase font-medium">{label}</span>
        </div>
        <span className="text-[10px] font-mono leading-none">${value.toFixed(3)}</span>
    </div>
);
