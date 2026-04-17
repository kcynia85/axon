// frontend/src/modules/spaces/ui/pure/SpaceAutomationNodeInspectorView.tsx

import React from "react";
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
    Archive,
    AlertCircle
} from "lucide-react";
import { SpaceAutomationDomainData, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";
import { SpaceInspectorFooter } from "../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../inspectors/components/SpaceInspectorPanel";
import { SpaceCrewContextTab } from "../inspectors/crews/shared/SpaceCrewContextTab";

export type SpaceAutomationNodeInspectorViewProps = {
    readonly automationData: SpaceAutomationDomainData;
    readonly isTriggering: boolean;
    readonly validationError: string | null;
    readonly hasTimeoutError: boolean;
    readonly isContextDone: boolean;
    readonly isArtefactsDone: boolean;
    readonly selectedTabIdentifier: string;
    readonly componentSearchQuery: string;
    readonly onTabChange: (tabIdentifier: string) => void;
    readonly onSearchQueryChange: (query: string) => void;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onLinkContextFromNode: (contextId: string, nodeLabel: string, artifactLabel: string) => void;
    readonly onArtefactLinkChange: (artefactId: string, link: string) => void;
    readonly onArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly onArtefactOutputToggle: (artefactId: string) => void;
    readonly onDeleteArtefact: (artefactId: string) => void;
    readonly onAddArtefact: () => void;
    readonly onTriggerWorkflow: () => void;
    readonly canvasNodes: Record<string, unknown>[];
};

const ARTEFACT_STATUS_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
} as const;

export const SpaceAutomationNodeInspectorView = ({
    automationData,
    isTriggering,
    validationError,
    hasTimeoutError,
    isContextDone,
    isArtefactsDone,
    selectedTabIdentifier,
    componentSearchQuery,
    onTabChange,
    onSearchQueryChange,
    onContextLinkChange,
    onLinkContextFromNode,
    onArtefactLinkChange,
    onArtefactStatusChange,
    onArtefactOutputToggle,
    onDeleteArtefact,
    onAddArtefact,
    onTriggerWorkflow,
    canvasNodes,
}: SpaceAutomationNodeInspectorViewProps) => {
    const artefacts = automationData.artefacts || [];

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Automation Inspector" 
                size="sm" 
                variant="underlined"
                selectedKey={selectedTabIdentifier === 'automation' ? 'context' : selectedTabIdentifier}
                onSelectionChange={(key) => onTabChange(key as string)}
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
                            <Layers size={12}/> 
                            Context
                            {isContextDone && <CheckCircle2 size={10} className="text-white"/>}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-280px)] text-left">
                        <SpaceCrewContextTab 
                            isContextComplete={isContextDone}
                            contextRequirements={automationData.contexts || []}
                            nodeSearchQuery={componentSearchQuery}
                            onSearchQueryChange={onSearchQueryChange}
                            onContextLinkChange={onContextLinkChange}
                            onLinkContextFromNode={onLinkContextFromNode}
                            canvasNodes={canvasNodes}
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
                    <ScrollShadow className="h-[calc(100vh-280px)] p-8 text-left">
                        <div className="space-y-10 pb-40">
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
                                                            onValueChange={(value) => onArtefactLinkChange(art.id, value)}
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

                                {(!artefacts || artefacts.length === 0) && !isTriggering && (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                                        <Archive size={40} className="text-zinc-700 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">No artefacts generated</p>
                                    </div>
                                )}

                                {isTriggering && (
                                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                                        <Spinner size="md" color="white" />
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest animate-pulse">Executing workflow...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>

            <SpaceInspectorFooter>
                <div className="flex flex-col gap-2">
                    <Button
                        className={cn(
                            "w-full font-black uppercase tracking-widest text-[10px] rounded-md transition-all h-10 shadow-lg",
                            isTriggering ? "bg-zinc-800 text-zinc-500" : (hasTimeoutError ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-white text-black hover:bg-zinc-100")
                        )}
                        startContent={isTriggering ? <Spinner size="sm" color="current" /> : (hasTimeoutError ? <AlertTriangle size={14} /> : <Webhook size={14} />)}
                        onPress={onTriggerWorkflow}
                        isDisabled={isTriggering}
                    >
                        {isTriggering ? "Executing Workflow..." : (hasTimeoutError ? "Retry Workflow" : "Trigger (Webhook)")}
                    </Button>
                    
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            className="flex-1 h-10 bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-zinc-800 border border-zinc-800 transition-colors"
                            startContent={<Plus size={14} />}
                            onPress={onAddArtefact}
                        >
                            Manual
                        </Button>
                        <Button
                            size="sm"
                            variant="flat"
                            className="flex-1 h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-zinc-800 border border-zinc-800 transition-colors"
                            startContent={<ExternalLink size={14} />}
                        >
                            Open {automationData.platform || 'n8n'}
                        </Button>
                    </div>

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
                                {`⚠️ Connection timed out (${automationData.platform || 'n8n'}) -> Retry or add artifact manually`}
                            </p>
                        </div>
                    )}
                </div>
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
