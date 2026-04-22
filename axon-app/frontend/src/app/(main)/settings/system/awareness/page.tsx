"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { SystemAwarenessList } from "@/modules/system/ui/SystemAwarenessList";
import { SystemAwarenessSettingsForm } from "@/modules/system/ui/SystemAwarenessSettingsForm";
import { Tabs, Tab } from "@heroui/react";
import { Settings, Database, BrainCircuit, Activity } from "lucide-react";
import { Card, CardHeader, CardBody, Button, Divider } from "@heroui/react";
import { useRouter } from "next/navigation";

const SystemAwarenessPage = () => {
    const router = useRouter();

    return (
        <PageLayout
            title="System Awareness"
            description="Manage system embeddings and entity awareness. This is the internal RAG#2 database used by the Meta-Agent."
            breadcrumbs={[]}
        >
            <div className="space-y-8">
                <Tabs 
                    aria-label="Awareness Options" 
                    variant="underlined"
                    classNames={{
                        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-white/5",
                        cursor: "w-full bg-blue-500",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-blue-500 font-bold"
                    }}
                >
                    <Tab
                        key="settings"
                        title={
                            <div className="flex items-center space-x-2">
                                <Settings size={18} />
                                <span>Engine Configuration</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <SystemAwarenessSettingsForm />
                        </div>
                    </Tab>
                    <Tab
                        key="meta-agent"
                        title={
                            <div className="flex items-center space-x-2">
                                <BrainCircuit size={18} />
                                <span>Meta-Agent</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 rounded-3xl">
                                <CardHeader className="flex gap-3 px-6 pt-6">
                                    <div className="p-2 bg-purple-500/10 rounded-xl">
                                        <BrainCircuit className="text-purple-400" size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-md font-bold">Meta-Agent Settings</p>
                                        <p className="text-xs text-zinc-500">Configure the Meta-Agent prompts, behavior, and reasoning capabilities.</p>
                                    </div>
                                </CardHeader>
                                <Divider className="my-4 opacity-50" />
                                <CardBody className="px-6 pb-8 space-y-4">
                                    <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center border border-white/5 bg-white/5 rounded-2xl">
                                        <div className="p-4 bg-purple-500/10 rounded-2xl">
                                            <BrainCircuit size={32} className="text-purple-400" />
                                        </div>
                                        <div className="max-w-md space-y-2">
                                            <h3 className="text-lg font-bold text-white">Meta-Agent Configuration Moved</h3>
                                            <p className="text-sm text-zinc-400">
                                                Meta-Agent configuration is now managed via the dedicated Meta-Agent Studio, giving you full control over cognitive capabilities and parameters.
                                            </p>
                                        </div>
                                        <Button 
                                            color="primary"
                                            size="lg"
                                            className="font-bold mt-4"
                                            onPress={() => router.push('/settings/system/meta-agent/studio')}
                                        >
                                            Configure Meta-Agent
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Tab>
                    <Tab
                        key="data"
                        title={
                            <div className="flex items-center space-x-2">
                                <Database size={18} />
                                <span>Awareness Registry</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <SystemAwarenessList />
                        </div>
                    </Tab>
                    <Tab
                        key="logs"
                        title={
                            <div className="flex items-center space-x-2">
                                <Activity size={18} />
                                <span>Logs</span>
                            </div>
                        }
                    >
                        <div className="pt-6">
                            <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 rounded-3xl">
                                <CardBody className="px-6 py-12 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="p-4 bg-blue-500/10 rounded-full">
                                        <Activity className="text-blue-500" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">System Logs</h3>
                                        <p className="text-sm text-zinc-500 max-w-md mx-auto mt-2">
                                            A detailed stream of system awareness events, indexing operations, and Meta-Agent reasoning logs will appear here.
                                        </p>
                                    </div>
                                    <div className="px-4 py-1.5 mt-4 text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 rounded-full">
                                        Coming Soon
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </PageLayout>
    );
};

export default SystemAwarenessPage;
