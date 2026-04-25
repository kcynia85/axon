"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/ui/Tabs";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { useTokenUsageQuery, useAvailableModelsQuery } from "@/modules/system/application/analyticsHooks";
import { Database, Sparkles, Brain, Cpu, Filter } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";

export const TokenUsageGraph = () => {
    const [activeTab, setActiveTab] = useState<string>("meta-agent");
    const [selectedModel, setSelectedModel] = useState<string>("all");
    
    const { data: usageData, isLoading } = useTokenUsageQuery(
        activeTab, 
        selectedModel === "all" ? undefined : selectedModel
    );
    
    const { data: models } = useAvailableModelsQuery();

    const tabs = [
        { id: "meta-agent", label: "Meta-Agent", icon: <Brain className="w-3 h-3" /> },
        { id: "knowledge", label: "Knowledge", icon: <Sparkles className="w-3 h-3" /> },
        { id: "awareness", label: "Awareness", icon: <Database className="w-3 h-3" /> },
    ];

    return (
        <Card className="col-span-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <CardTitle className="text-lg font-bold mb-1">Token Consumption</CardTitle>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-black">Usage statistics by context</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                            <TabsList className="bg-transparent gap-1 h-8">
                                {tabs.map(tab => (
                                    <TabsTrigger 
                                        key={tab.id} 
                                        value={tab.id}
                                        className={cn(
                                            "h-7 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                                            "data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 data-[state=active]:shadow-sm"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {tab.icon}
                                            {tab.label}
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger className="w-[140px] h-9 bg-white/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Cpu size={14} className="text-zinc-500" />
                                    <SelectValue placeholder="All Models" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <SelectItem value="all" className="text-xs font-bold uppercase">All Models</SelectItem>
                                {models?.map(model => (
                                    <SelectItem key={model} value={model} className="text-xs">{model}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full mt-4">
                {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-800 dark:border-t-white rounded-full animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Loading metrics...</span>
                        </div>
                    </div>
                ) : usageData && usageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={usageData}>
                            <defs>
                                <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#71717a" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.1} />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 'bold' }}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                                }}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fill: '#71717a', fontWeight: 'bold' }}
                                width={40}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#09090b', 
                                    borderColor: '#27272a',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'black' }}
                                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="tokens" 
                                stroke="#71717a" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorTokens)" 
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/10">
                        <Filter className="w-8 h-8 text-zinc-300 mb-3 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No usage data found for the selected filters</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
