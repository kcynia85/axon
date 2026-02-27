// frontend/src/modules/spaces/ui/pure/SpaceAutomationNodeInspectorView.tsx

import React, { useState } from "react";
import {
    Button,
    Tabs,
    Tab,
    Spinner,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    ScrollShadow,
} from "@heroui/react";
import { 
    ExternalLink, 
    Webhook, 
    CheckCircle2, 
    Layers, 
    FileText,
    AlertTriangle,
    Plus,
    ChevronDown,
    Clock,
    CheckCircle,
    ArrowUpRight,
    Trash2,
    Link as LinkIcon
} from "lucide-react";
import { SpaceAutomationDomainData, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";
import { SpaceInspectorFooter } from "../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../inspectors/components/SpaceInspectorPanel";
import { SpaceCrewContextTab } from "../inspectors/crews/shared/SpaceCrewContextTab";

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

const ARTEFACT_STATUS_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
} as const;

export const SpaceAutomationNodeInspectorView = ({
    data,
    isTriggering,
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
    const [selectedTab, setSelectedTab] = useState<string>("context");
    const [nodeSearch, setNodeSearch] = useState("");

    const artefacts = data.artefacts || [];
    const hasInReview = artefacts.some(a => a.status === 'in_review');
    const allApproved = artefacts.length > 0 && artefacts.every(a => a.status === 'approved');

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Automation Inspector" 
                size="sm" 
                variant="underlined"
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors p-0"
                }}
            >
                <Tab 
                    key="context" 
                    title={
                        <div className="flex items-center gap-2">
                            <Layers size={12} /> 
                            Context
                            {isContextDone && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewContextTab 
                            isContextComplete={isContextDone} 
                            contextRequirements={data.contexts || data.context_requirements || []} 
                            nodeSearch={nodeSearch} 
                            setNodeSearch={setNodeSearch} 
                            handleContextLinkChange={onContextLinkChange} 
                            handleLinkContextFromNode={onLinkContextFromNode} 
                        />
                    </div>
                </Tab>

                <Tab 
                    key="artefacts" 
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} /> 
                            Artefacts
                            {hasInReview ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            ) : allApproved ? (
                                <CheckCircle2 size={10} className="text-white" />
                            ) : null}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <ScrollShadow className="p-8 h-full pb-48">
                            <div className="space-y-10">
                                {artefacts.map((art) => {
                                    const isFilled = (art.link || "").trim().length > 0;
                                    return (
                                        <div key={art.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3.5 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-xs font-black text-white tracking-tight">{art.label}</h4>
                                                    {art.isOutput && (
                                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[8px] font-black text-orange-500 uppercase tracking-widest">
                                                            Output <ArrowUpRight size={8} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {art.link && (
                                                        <a
                                                            href={art.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                                                        >
                                                            Open <ExternalLink size={10} />
                                                        </a>
                                                    )}
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="w-6 h-6 min-w-6 text-zinc-600 hover:text-red-500 transition-colors"
                                                        onPress={() => onDeleteArtefact(art.id)}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2.5">
                                                <Input
                                                    size="sm"
                                                    variant="bordered"
                                                    placeholder="Wklej link..."
                                                    value={art.link || ""}
                                                    onValueChange={(value) => onArtefactLinkChange(art.id, value)}
                                                    startContent={<LinkIcon size={12} className={cn(isFilled ? "text-white" : "text-zinc-500")} />}
                                                    endContent={isFilled && <CheckCircle2 size={14} className="text-white" />}
                                                    classNames={{
                                                        base: "w-full",
                                                        input: "text-[10px] font-bold text-zinc-200",
                                                        inputWrapper: cn(
                                                            "h-11 rounded-xl transition-all shadow-none border",
                                                            isFilled ? "bg-zinc-950/50 border-white border-2" : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                                                        ),
                                                    }}
                                                />

                                                <div className="flex justify-start gap-1">
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button
                                                                size="sm"
                                                                variant="bordered"
                                                                className="h-10 border-zinc-800 bg-zinc-900/30 text-[9px] font-black uppercase tracking-widest min-w-32 justify-between rounded-lg"
                                                                endContent={<ChevronDown size={12} />}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className={cn("w-1.5 h-1.5 rounded-full", ARTEFACT_STATUS_CONFIG[art.status]?.dot || "bg-blue-400")} />
                                                                    {ARTEFACT_STATUS_CONFIG[art.status]?.label || "In Review"}
                                                                </div>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu
                                                            aria-label="Artefact Status"
                                                            onAction={(key) => onArtefactStatusChange(art.id, key as TemplateArtefact['status'])}
                                                            classNames={{
                                                                base: "bg-zinc-950 border border-zinc-800 p-1",
                                                            }}
                                                        >
                                                            {(['in_review', 'approved'] as const).map((key) => (
                                                                <DropdownItem
                                                                    key={key}
                                                                    startContent={React.createElement(ARTEFACT_STATUS_CONFIG[key].icon, { size: 12, className: ARTEFACT_STATUS_CONFIG[key].color })}
                                                                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                                                                >
                                                                    {ARTEFACT_STATUS_CONFIG[key].label}
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>

                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="bordered"
                                                        className={cn(
                                                            "h-10 w-10 border-zinc-800 transition-all rounded-lg",
                                                            art.isOutput ? "bg-orange-500/20 border-orange-500/50 text-orange-500" : "bg-zinc-900/30 text-zinc-600 hover:text-zinc-400"
                                                        )}
                                                        onPress={() => onArtefactOutputToggle(art.id)}
                                                        title="Mark as Workflow Output"
                                                    >
                                                        <ArrowUpRight size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {(!artefacts || artefacts.length === 0) && !isTriggering && (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                        <FileText size={40} className="text-zinc-700 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">No results yet</p>
                                    </div>
                                )}

                                {isTriggering && (
                                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                                        <Spinner size="md" color="white" />
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest animate-pulse">Executing workflow...</p>
                                    </div>
                                )}
                            </div>
                        </ScrollShadow>
                    </div>
                </Tab>
            </Tabs>

            <SpaceInspectorFooter>
                <div className="space-y-3">
                    <Button
                        className={cn(
                            "w-full font-black uppercase text-[10px] rounded-md transition-all h-10 shadow-lg",
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
                            variant="bordered"
                            className="flex-1 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 h-10 text-[10px] font-black uppercase tracking-widest rounded-md"
                            startContent={<Plus size={14} />}
                            onPress={onAddArtefact}
                        >
                            Add Manual
                        </Button>
                        <Button
                            size="sm"
                            variant="flat"
                            className="flex-1 h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-zinc-800 border border-zinc-800 transition-colors"
                            startContent={<ExternalLink size={14} />}
                        >
                            Open n8n
                        </Button>
                    </div>
                </div>
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
