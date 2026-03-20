"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { Card, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { ChartNoAxesColumn, TrendingUp, Users, Target } from "lucide-react";

const AnalyticsPage = () => {
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
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Total Projects</CardTitle>
                            <Target className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold tracking-tight">12</div>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">+2 from last month</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold tracking-tight">2,350</div>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">+180.1% from last month</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold tracking-tight">84%</div>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">+4% from last week</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-500">Insights Generated</CardTitle>
                            <ChartNoAxesColumn className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold tracking-tight">573</div>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">+201 since yesterday</p>
                        </CardHeader>
                    </Card>
                </div>

                {/* Main Charts area placeholders */}
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
        </PageLayout>
    );
};

export default AnalyticsPage;
