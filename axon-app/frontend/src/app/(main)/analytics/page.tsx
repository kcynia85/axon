"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { Card, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { ChartNoAxesColumn, TrendingUp, Users, Target, Sparkles, Cpu, HelpCircle } from "lucide-react";
import { TokenUsageGraph } from "./TokenUsageGraph";
import { useProjectsQuery } from "@/modules/projects/application/hooks";
import { useSpaces } from "@/modules/spaces/application/hooks";
import { useKnowledgeResourcesQuery } from "@/modules/resources/application/useKnowledgeResources";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { useTokenSummaryQuery } from "@/modules/system/application/analyticsHooks";
import { Tooltip } from "@/shared/ui/ui/Tooltip";

const AnalyticsPage = () => {
    const { data: projects, isLoading: projectsLoading } = useProjectsQuery();
    const { data: spaces, isLoading: spacesLoading } = useSpaces();
    const { data: resources, isLoading: resourcesLoading } = useKnowledgeResourcesQuery();
    const { data: tokenSummary, isLoading: summaryLoading } = useTokenSummaryQuery();

    return (
        <PageLayout
            title="Analytics"
            description="Monitor performance, user engagement, and project progress."
            breadcrumbs={[
                { label: "Home", href: "/home" },
                { label: "Analytics" }
            ]}
            showPagination={false}
        >
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Token Budget Used (First) */}
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-start gap-2 space-y-0 pb-4 pt-6">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Token Budget Used</CardTitle>
                            <Tooltip content="Estimated global cost of token consumption converted to Polish Zloty (PLN).">
                                <div className="text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors">
                                    <HelpCircle size={12} />
                                </div>
                            </Tooltip>
                        </CardHeader>
                        <div className="px-6 pb-6 pt-0">
                            <div className="flex items-baseline gap-1">
                                {summaryLoading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <div className="text-2xl font-bold tracking-tight">
                                        {tokenSummary?.total_cost_pln?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                                    </div>
                                )}
                                <span className="text-xs text-zinc-500 font-bold uppercase">zł</span>
                            </div>
                        </div>
                    </Card>

                    {/* 2. Total Projects */}
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-start gap-2 space-y-0 pb-4 pt-6">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Total Projects</CardTitle>
                            <Tooltip content="Total number of projects created across all your workspaces.">
                                <div className="text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors">
                                    <HelpCircle size={12} />
                                </div>
                            </Tooltip>
                        </CardHeader>
                        <div className="px-6 pb-6 pt-0">
                            <div className="flex items-baseline gap-1">
                                {projectsLoading ? (
                                    <Skeleton className="h-8 w-12" />
                                ) : (
                                    <div className="text-2xl font-bold tracking-tight">{projects?.length || 0}</div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* 3. Total Spaces */}
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-start gap-2 space-y-0 pb-4 pt-6">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Total Spaces</CardTitle>
                            <Tooltip content="Active canvas environments where you design and orchestrate AI flows.">
                                <div className="text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors">
                                    <HelpCircle size={12} />
                                </div>
                            </Tooltip>
                        </CardHeader>
                        <div className="px-6 pb-6 pt-0">
                            <div className="flex items-baseline gap-1">
                                {spacesLoading ? (
                                    <Skeleton className="h-8 w-12" />
                                ) : (
                                    <div className="text-2xl font-bold tracking-tight">{spaces?.length || 0}</div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* 4. Knowledge Assets */}
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-start gap-2 space-y-0 pb-4 pt-6">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Knowledge Assets</CardTitle>
                            <Tooltip content="Indexed documents and external resources available to your agents in RAG#1.">
                                <div className="text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors">
                                    <HelpCircle size={12} />
                                </div>
                            </Tooltip>
                        </CardHeader>
                        <div className="px-6 pb-6 pt-0">
                            <div className="flex items-baseline gap-1">
                                {resourcesLoading ? (
                                    <Skeleton className="h-8 w-12" />
                                ) : (
                                    <div className="text-2xl font-bold tracking-tight">{resources?.length || 0}</div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Charts area */}
                <div className="grid grid-cols-1 gap-6">
                    <TokenUsageGraph />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="min-h-[400px] flex items-center justify-center border-dashed bg-zinc-50/30 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-400">
                                    <ChartNoAxesColumn className="w-8 h-8 opacity-40" />
                                </div>
                                <h3 className="text-base font-bold mb-2">Engagement Chart</h3>
                                <p className="text-sm text-zinc-500 max-w-[240px] mx-auto">Visualization of user activity and agent interactions over time.</p>
                            </div>
                        </Card>
                        <Card className="min-h-[400px] flex items-center justify-center border-dashed bg-zinc-50/30 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-400">
                                    <Target className="w-8 h-8 opacity-40" />
                                </div>
                                <h3 className="text-base font-bold mb-2">Project Progress</h3>
                                <p className="text-sm text-zinc-500 max-w-[240px] mx-auto">Detailed distribution of tasks across statuses and initiatives.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AnalyticsPage;
