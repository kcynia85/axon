"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { SystemAwarenessList } from "@/modules/system/ui/SystemAwarenessList";
import { SystemAwarenessSettingsForm } from "@/modules/system/ui/SystemAwarenessSettingsForm";
import { Tabs, Tab } from "@heroui/react";
import { Settings, Database } from "lucide-react";

const SystemAwarenessPage = () => {
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
                </Tabs>
            </div>
        </PageLayout>
    );
};

export default SystemAwarenessPage;
