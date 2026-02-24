// frontend/src/modules/spaces/ui/pure/SpaceAutomationNodeInspectorView.tsx

import React from "react";
import {
    CardBody,
    Button,
    ScrollShadow,
    Tabs,
    Tab,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Spinner,
} from "@heroui/react";
import {
    Link as LinkIcon,
    Archive,
    ExternalLink,
    ChevronDown,
    Clock,
    CheckCircle,
    ArrowUpRight,
    Webhook,
    CheckCircle2,
    Trash2,
    AlertCircle,
    AlertTriangle,
    Plus,
    Network,
} from "lucide-react";
import { SpaceAutomationDomainData, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";

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

// Simulated list of outputs available in the current workspace with explicit types
const DETECTED_WORKSPACE_OUTPUTS = [
    { node: "User Researcher", artifact: "user_persona.json", type: "json" },
    { node: "Interview Synthesis", artifact: "competitors_list.csv", type: "csv" },
    { node: "Figma Sync", artifact: "design_assets.zip", type: "zip" },
    { node: "Brand Engine", artifact: "logo_primary.png", type: "image" },
    { node: "Copywriter Agent", artifact: "draft_v1.json", type: "json" },
];

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
    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <div className="px-6 pt-6 pb-2 flex flex-col gap-2">
                <Button
                    className={cn(
                        "w-full font-black uppercase tracking-widest text-[10px] rounded-md transition-all h-10 shadow-lg",
                        isTriggering ? "bg-zinc-800 text-zinc-500" : (hasTimeoutError ? "bg-orange-500 text-white hover:bg-orange-400" : "bg-zinc-200 text-black hover:bg-white")
                    )}
                    startContent={isTriggering ? <Spinner size="sm" color="current" /> : (hasTimeoutError ? <AlertTriangle size={14} /> : <Webhook size={14} />)}
                    onPress={onTriggerWorkflow}
                    isDisabled={isTriggering}
                >
                    {isTriggering ? "Executing Workflow..." : (hasTimeoutError ? "Retry Workflow" : "Trigger (Webhook)")}
                </Button>
                <Button
                    size="sm"
                    variant="flat"
                    className="w-full h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-zinc-800 border border-zinc-800 transition-colors"
                    startContent={<ExternalLink size={14} />}
                >
                    Open n8n Workflow
                </Button>

                {validationError && (
                    <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle size={12} className="text-red-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] font-black text-red-400 leading-tight uppercase tracking-wider">
                            {validationError}
                        </p>
                    </div>
                )}

                {hasTimeoutError && (
                    <div className="mt-2 p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertTriangle size={12} className="text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] font-black text-orange-400 leading-tight uppercase tracking-wider">
                            {"⚠️ Connection timed out (n8n) -> Retry or add artifact manually"}
                        </p>
                    </div>
                )}
            </div>

            <Tabs
                aria-label="Automation Sections"
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
                    key="context"
                    title={
                        <div className="flex items-center gap-2">
                            <LinkIcon size={12} />
                            Context
                            {isContextDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-280px)] p-8">
                        <div className="space-y-10">
                            {data.contexts?.map((context) => {
                                // Filter outputs based on expected type
                                const compatibleOutputs = DETECTED_WORKSPACE_OUTPUTS.filter(out =>
                                    !context.expectedType ||
                                    context.expectedType === 'any' ||
                                    out.type === context.expectedType
                                );

                                return (
                                    <div key={context.id} className="space-y-3.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-xs font-black text-white tracking-tight">{context.label}</h4>
                                                {context.expectedType && context.expectedType !== 'any' && (
                                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded border border-zinc-700 uppercase">
                                                        {context.expectedType}
                                                    </span>
                                                )}
                                            </div>
                                            {context.link && (
                                                <a
                                                    href={context.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                                                >
                                                    Open <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>

                                        {context.sourceNodeLabel ? (
                                            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                                    <Network size={14} />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Linked from Node</span>
                                                    <span className="text-[10px] font-black text-zinc-200 truncate">{context.sourceNodeLabel}</span>
                                                    <span className="text-[9px] font-bold text-zinc-500 font-mono truncate">{context.sourceArtifactLabel}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    className="min-w-0 h-8 px-2 text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest"
                                                    onPress={() => onContextLinkChange(context.id, "")}
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <Input
                                                    size="sm"
                                                    variant="bordered"
                                                    placeholder="Paste link or link from node..."
                                                    value={context.link || ""}
                                                    onValueChange={(value) => onContextLinkChange(context.id, value)}
                                                    startContent={<LinkIcon size={12} className="text-zinc-500" />}
                                                    classNames={{
                                                        input: "text-[10px] font-bold text-zinc-200",
                                                        inputWrapper: "h-10 rounded-lg border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors shadow-none",
                                                    }}
                                                />

                                                <div className="flex justify-start">
                                                    <Dropdown isDisabled={compatibleOutputs.length === 0}>
                                                        <DropdownTrigger>
                                                            <Button
                                                                size="sm"
                                                                variant="flat"
                                                                className="h-8 bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest text-[9px] rounded-lg border border-zinc-800 hover:text-white"
                                                                startContent={<Network size={12} />}
                                                                endContent={<ChevronDown size={10} />}
                                                            >
                                                                {compatibleOutputs.length > 0 ? "Link from Node Output" : "No Compatible Outputs"}
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu
                                                            aria-label="Node Outputs"
                                                            classNames={{
                                                                base: "bg-zinc-950 border border-zinc-800 p-1",
                                                            }}
                                                            onAction={(key) => {
                                                                const source = compatibleOutputs[Number(key)];
                                                                onLinkContextFromNode(context.id, source.node, source.artifact);
                                                            }}
                                                        >
                                                            {compatibleOutputs.map((source, index) => (
                                                                <DropdownItem
                                                                    key={index}
                                                                    description={`${source.artifact} (${source.type})`}
                                                                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                                                                >
                                                                    {source.node}
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {(!data.contexts || data.contexts.length === 0) && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No context links required for this automation.</p>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>

                <Tab
                    key="artefacts"
                    title={
                        <div className="flex items-center gap-2">
                            <Archive size={12} />
                            Artefacts
                            {isArtefactsDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-280px)] p-8">
                        <div className="space-y-10">
                            {data.artefacts?.map((art) => (
                                <div key={art.id} className="space-y-3.5">
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

                                    <div className="flex flex-col gap-2">
                                        <Input
                                            size="sm"
                                            variant="bordered"
                                            placeholder="Wklej link..."
                                            value={art.link || ""}
                                            onValueChange={(value) => onArtefactLinkChange(art.id, value)}
                                            startContent={<LinkIcon size={12} className="text-zinc-500" />}
                                            classNames={{
                                                base: "w-full",
                                                input: "text-[10px] font-bold text-zinc-200",
                                                inputWrapper: "h-10 rounded-lg border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors shadow-none",
                                            }}
                                        />

                                        <div className="flex justify-start gap-1">
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button
                                                        size="sm"
                                                        variant="bordered"
                                                        className="h-10 border-zinc-800 bg-zinc-900/30 text-[9px] font-black uppercase tracking-widest min-w-32 justify-between"
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
                                                isDisabled={art.status !== 'approved'}
                                                className={cn(
                                                    "h-10 w-10 border-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
                                                    art.isOutput ? "bg-orange-500/20 border-orange-500/50 text-orange-500" : "bg-zinc-900/30 text-zinc-600 hover:text-zinc-400"
                                                )}
                                                onPress={() => onArtefactOutputToggle(art.id)}
                                                title={art.status === 'approved' ? "Mark as Workflow Output" : "Approve artefact to mark as output"}
                                            >
                                                <ArrowUpRight size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!data.artefacts || data.artefacts.length === 0) && !isTriggering && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No results yet. Trigger workflow to generate results.</p>
                            )}

                            {isTriggering && (
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <Spinner size="md" color="white" />
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest animate-pulse">Generating n8n results...</p>
                                </div>
                            )}

                            {hasTimeoutError && (
                                <Button
                                    size="sm"
                                    variant="flat"
                                    className="w-full h-11 bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-800 border border-zinc-800 transition-colors mt-4"
                                    startContent={<Plus size={14} />}
                                    onPress={onAddArtefact}
                                >
                                    Dodaj Artefakt Manulanie
                                </Button>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>
        </CardBody>
    );
};
