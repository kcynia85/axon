// frontend/src/modules/spaces/ui/pure/SpaceAutomationNodeInspectorView.tsx

import React, { useState } from "react";
import {
    CardBody,
    Button,
    Tabs,
    Tab,
    Spinner,
} from "@heroui/react";
import {
    ExternalLink,
    Webhook,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Plus,
    Zap,
    Layers,
    FileText,
} from "lucide-react";
import { SpaceAutomationDomainData, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";
import { SpaceCrewOrchestrationLayout } from "../inspectors/crews/shared/SpaceCrewOrchestrationLayout";
import { SpaceCrewContextTab } from "../inspectors/crews/shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "../inspectors/crews/shared/SpaceCrewArtefactsTab";

type SpaceAutomationNodeInspectorViewProps = {
    readonly data: SpaceAutomationDomainData;
    readonly isTriggering: boolean;
    readonly validationError: string | null;
    readonly hasTimeoutError: boolean;
    readonly isContextDone: boolean;
    readonly isArtefactsDone: boolean;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onLinkContextFromNode: (contextId: string, nodeLabel: string, artifactLabel: string) => void;
    readonly onArtefactLinkChange: (artefactId: string, link: string) => void;
    readonly onArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly onArtefactOutputToggle: (artefactId: string) => void;
    readonly onDeleteArtefact: (artefactId: string) => void;
    readonly onAddArtefact: () => void;
    readonly onTriggerWorkflow: () => void;
};

export const SpaceAutomationNodeInspectorView = ({
    data,
    isTriggering,
    validationError,
    hasTimeoutError,
    isContextDone,
    isArtefactsDone,
    onContextLinkChange,
    onLinkContextFromNode,
    onArtefactLinkChange,
    onArtefactStatusChange,
    onArtefactOutputToggle,
    onDeleteArtefact,
    onAddArtefact,
    onTriggerWorkflow,
}: SpaceAutomationNodeInspectorViewProps) => {
    const [nodeSearch, setNodeSearch] = useState("");
    const [editingArtefactId, setEditingArtefactId] = useState<string | null>(null);
    const [expandedVersionHistory, setExpandedVersionHistory] = useState<Record<string, boolean>>({});

    const toggleVersionHistory = (id: string) => {
        setExpandedVersionHistory(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleRestoreVersion = (id: string, label: string) => {
        console.log(`Restoring version ${label} for artefact ${id}`);
    };

    const handleArtefactContentChange = (id: string, content: string) => {
        console.log(`Content change for artefact ${id}:`, content);
    };

    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <Tabs
                aria-label="Automation Sections"
                size="sm"
                variant="underlined"
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors"
                }}
            >
                <Tab 
                    key="automation" 
                    title={
                        <div className="flex items-center gap-2">
                            <Zap size={12}/> Automation
                        </div>
                    }
                >
                    <SpaceCrewOrchestrationLayout
                        footer={
                            <div className="space-y-3">
                                {validationError && (
                                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <AlertCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
                                        <p className="text-[10px] font-black text-red-400 leading-tight uppercase tracking-wider">
                                            {validationError}
                                        </p>
                                    </div>
                                )}

                                {hasTimeoutError && (
                                    <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <AlertTriangle size={12} className="text-orange-500 mt-0.5 shrink-0" />
                                        <p className="text-[10px] font-black text-orange-400 leading-tight uppercase tracking-wider">
                                            {"⚠️ Connection timed out (n8n) -> Retry or add artifact manually"}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    className={cn(
                                        "w-full font-black uppercase tracking-widest text-[10px] rounded-md transition-all h-12 shadow-xl",
                                        isTriggering ? "bg-zinc-800 text-zinc-500" : (hasTimeoutError ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-white text-black hover:bg-zinc-100")
                                    )}
                                    startContent={isTriggering ? <Spinner size="sm" color="current" /> : (hasTimeoutError ? <AlertTriangle size={14} /> : <Webhook size={14} />)}
                                    onPress={onTriggerWorkflow}
                                    isDisabled={isTriggering}
                                >
                                    {isTriggering ? "Executing Workflow..." : (hasTimeoutError ? "Retry Workflow" : "Trigger (Webhook)")}
                                </Button>

                                <div className="flex gap-3">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        className="flex-1 h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-zinc-800 border border-zinc-800 transition-colors"
                                        startContent={<ExternalLink size={14} />}
                                    >
                                        Open n8n
                                    </Button>
                                    {hasTimeoutError && (
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            className="flex-1 h-10 bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-zinc-800 border border-zinc-800 transition-colors"
                                            startContent={<Plus size={14} />}
                                            onPress={onAddArtefact}
                                        >
                                            Add Manual
                                        </Button>
                                    )}
                                </div>
                            </div>
                        }
                    >
                        <div className="flex flex-col justify-start space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Webhook size={12} className="text-blue-400" />
                                    n8n Webhook Status
                                </h3>
                                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-zinc-200">Workflow Target</span>
                                        <span className="text-[9px] font-mono text-zinc-500">n8n-production-v2</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-zinc-200">Execution Mode</span>
                                        <span className="text-[9px] font-mono text-zinc-500">Asynchronous</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SpaceCrewOrchestrationLayout>
                </Tab>

                <Tab
                    key="context"
                    title={
                        <div className="flex items-center gap-2">
                            <Layers size={12} />
                            Context
                            {isContextDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <SpaceCrewContextTab 
                        isContextComplete={isContextDone}
                        contextRequirements={data.contexts || []}
                        nodeSearch={nodeSearch}
                        setNodeSearch={setNodeSearch}
                        handleContextLinkChange={onContextLinkChange}
                        handleLinkContextFromNode={onLinkContextFromNode}
                    />
                </Tab>

                <Tab
                    key="artefacts"
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} />
                            Artefacts
                            {isArtefactsDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <SpaceCrewArtefactsTab 
                        isDone={isArtefactsDone}
                        artefacts={data.artefacts || []}
                        progressValue={isTriggering ? 45 : 0}
                        isWorking={isTriggering}
                        editingArtefactId={editingArtefactId}
                        setEditingArtefactId={setEditingArtefactId}
                        expandedVersionHistory={expandedVersionHistory}
                        toggleVersionHistory={toggleVersionHistory}
                        handleRestoreVersion={handleRestoreVersion}
                        handleArtefactStatusChange={onArtefactStatusChange}
                        handleArtefactOutputToggle={onArtefactOutputToggle}
                        handleArtefactContentChange={handleArtefactContentChange}
                    />
                </Tab>
            </Tabs>
        </CardBody>
    );
};
