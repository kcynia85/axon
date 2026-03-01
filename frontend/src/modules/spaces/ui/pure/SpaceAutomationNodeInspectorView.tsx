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
    Tooltip,
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
    Link as LinkIcon,
    Archive
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
    const [selectedTab, setSelectedTab] = useState<string>("workflow");
    const [nodeSearch, setNodeSearch] = useState("");

    const artefacts = data.artefacts || [];

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
                <Tab key="workflow" title={<div className="flex items-center gap-2"><Webhook size={12}/> Workflow</div>}>
                    <ScrollShadow className="h-[calc(100vh-192px)] p-8">
                        <div className="space-y-10 pb-40">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Automation Target</h4>
                                    <div className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-black text-zinc-500 uppercase tracking-widest">n8n Instance</div>
                                </div>
                                <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                            <Webhook size={20} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white">{data.label}</p>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Active Trigger</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-zinc-900 flex justify-between items-center">
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Status:</span>
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase">{data.state}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Trigger Logic</h4>
                                    <Button size="sm" variant="light" className="text-[9px] font-black text-blue-400 h-6 min-w-0 px-2" startContent={<ExternalLink size={10}/>}>Open n8n</Button>
                                </div>
                                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                                    <p className="text-[11px] text-zinc-400 font-mono leading-relaxed italic">
                                        This automation is triggered via webhook when all required context links are provided.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-zinc-900 space-y-6">
                                <Button 
                                    className={cn(
                                        "w-full h-14 font-black uppercase tracking-[0.2em] text-xs transition-all border shadow-xl",
                                        isContextDone ? "bg-white text-black border-white hover:bg-zinc-100" : "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-50"
                                    )}
                                    isDisabled={!isContextDone || isTriggering}
                                    onPress={onTriggerWorkflow}
                                >
                                    {isTriggering ? <Spinner size="sm" color="current" /> : "Run Workflow"}
                                </Button>

                                {validationError && (
                                    <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-red-400">
                                        <AlertTriangle size={14} />
                                        <p className="text-[10px] font-bold uppercase tracking-tight">{validationError}</p>
                                    </div>
                                )}

                                {hasTimeoutError && (
                                    <div className="flex items-center gap-2 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg text-orange-400">
                                        <AlertTriangle size={14} />
                                        <p className="text-[10px] font-bold uppercase tracking-tight italic">Backend processing... check back in a few seconds.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollShadow>
                </Tab>

                <Tab 
                    key="context" 
                    title={
                        <div className="flex items-center gap-2">
                            <Layers size={12}/> 
                            Context
                            {isContextDone && <CheckCircle2 size={10} className="text-white"/>}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)] pb-40">
                        <SpaceCrewContextTab 
                            isContextComplete={isContextDone}
                            contextRequirements={data.contexts || []}
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
                            <FileText size={12}/> 
                            Artefacts
                            {isArtefactsDone && artefacts.length > 0 && <CheckCircle2 size={10} className="text-white"/>}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-192px)] p-8">
                        <div className="space-y-10 pb-40">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Workflow Outputs</h4>
                                <Button 
                                    size="sm" 
                                    variant="flat" 
                                    className="bg-zinc-900 border border-zinc-800 text-[10px] font-black text-zinc-400 rounded-md h-8"
                                    onPress={onAddArtefact}
                                    startContent={<Plus size={12} />}
                                >
                                    Add Manual
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {artefacts.map((art) => {
                                    const isFilled = (art.link || "").trim().length > 0;
                                    return (
                                        <div key={art.id} className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-5 group relative transition-all hover:border-zinc-600">
                                            <button 
                                                onClick={() => onDeleteArtefact(art.id)}
                                                className="absolute top-4 right-4 p-1.5 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-black text-white pr-6 tracking-tight">{art.label}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full flex gap-2 items-center">
                                                        <Input 
                                                            size="sm" 
                                                            variant="bordered"
                                                            placeholder="Paste Result URL"
                                                            value={art.link || ""}
                                                            onValueChange={(val) => onArtefactLinkChange(art.id, val)}
                                                            startContent={<LinkIcon size={12} className={cn(isFilled ? "text-white" : "text-zinc-500")} />}
                                                            endContent={isFilled && <CheckCircle2 size={14} className="text-white" />}
                                                            classNames={{ 
                                                                input: "text-[10px] font-bold text-zinc-200", 
                                                                inputWrapper: cn(
                                                                    "h-11 rounded-xl transition-all shadow-none border",
                                                                    isFilled ? "bg-zinc-950/50 border-white border-2" : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                                                                )
                                                            }} 
                                                        />
                                                        <Button 
                                                            isIconOnly 
                                                            as="a" 
                                                            href={art.link || '#'} 
                                                            target="_blank" 
                                                            size="sm" 
                                                            isDisabled={!art.link}
                                                            className="w-11 h-11 min-w-11 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white shrink-0 disabled:opacity-30 rounded-xl"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                                                <div className="flex items-center gap-2">
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button 
                                                                size="sm" 
                                                                variant="bordered" 
                                                                className="h-10 border-zinc-800 bg-zinc-900/80 text-[9px] font-black uppercase tracking-widest min-w-32 justify-between rounded-lg"
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
                                                                base: "bg-zinc-950 border border-zinc-800 p-1"
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

                                                    <Tooltip 
                                                        content={art.isOutput ? "Unmark as Workflow Output" : "Mark as Workflow Output"}
                                                        placement="top"
                                                        classNames={{
                                                            content: "py-1 px-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950 border border-zinc-800 shadow-md"
                                                        }}
                                                        closeDelay={0}
                                                    >
                                                        <div className="inline-block relative">
                                                            <Button 
                                                                isIconOnly 
                                                                size="sm" 
                                                                variant="bordered" 
                                                                className={cn(
                                                                    "h-10 w-10 border-zinc-800 transition-all rounded-lg",
                                                                    art.isOutput ? "bg-orange-500/20 border-orange-500/50 text-orange-500" : "bg-zinc-900/30 text-zinc-600 hover:text-zinc-400"
                                                                )}
                                                                onPress={() => onArtefactOutputToggle(art.id)}
                                                            >
                                                                <ArrowUpRight size={14} />
                                                            </Button>
                                                        </div>
                                                    </Tooltip>
                                                </div>

                                                {art.isOutput && (
                                                    <div className="shrink-0 flex items-center">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20">
                                                            Active Output
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {(!artefacts || artefacts.length === 0) && (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                        <Archive size={40} className="text-zinc-700 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">No artefacts generated</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>

            <SpaceInspectorFooter>
                <div className="space-y-3">
                    <Button 
                        variant="bordered" 
                        className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 h-10 text-[10px] font-black uppercase tracking-widest rounded-md"
                        startContent={<Plus size={14} />}
                        onPress={onAddArtefact}
                    >
                        Dodaj Artefakt
                    </Button>
                    <Button 
                        className="w-full font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all h-10 shadow-lg"
                        startContent={<ExternalLink size={14} />}
                    >
                        Open {data.label}
                    </Button>
                </div>
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
