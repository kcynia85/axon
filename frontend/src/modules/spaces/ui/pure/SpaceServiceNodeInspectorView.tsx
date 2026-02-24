// frontend/src/modules/spaces/ui/pure/SpaceServiceNodeInspectorView.tsx

import React from "react";
import {
    CardBody,
    Button,
    ScrollShadow,
    Divider,
    Tabs,
    Tab,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import {
    Link as LinkIcon,
    Archive,
    ExternalLink,
    ChevronDown,
    Clock,
    CheckCircle,
    ArrowUpRight,
    CheckCircle2,
    Play,
    Settings2,
    ShieldCheck,
    Box,
} from "lucide-react";
import { SpaceServiceDomainData, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";

type SpaceServiceNodeInspectorViewProps = {
    readonly data: SpaceServiceDomainData;
    readonly isContextDone: boolean;
    readonly isArtefactsDone: boolean;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onArtefactLinkChange: (artefactId: string, link: string) => void;
    readonly onArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly onArtefactOutputToggle: (artefactId: string) => void;
};

const ARTEFACT_STATUS_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
} as const;

export const SpaceServiceNodeInspectorView = ({
    data,
    isContextDone,
    isArtefactsDone,
    onContextLinkChange,
    onArtefactLinkChange,
    onArtefactStatusChange,
    onArtefactOutputToggle,
}: SpaceServiceNodeInspectorViewProps) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-black text-white">
            {/* Action Buttons Section */}
            <div className="px-6 pt-6 pb-2 flex flex-col gap-2">
                <div className="flex gap-2">
                    <Button
                        className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all h-10 shadow-lg"
                        startContent={<Play size={14} fill="currentColor" />}
                    >
                        Trigger
                    </Button>
                    <Button
                        variant="flat"
                        className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all rounded-md h-10"
                        startContent={<Settings2 size={14} />}
                    >
                        Config
                    </Button>
                </div>
                {/* Capability Info Summary */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h3 className="font-black text-lg tracking-tight">{data.label}</h3>
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Type: Service / Integration</p>
                    </div>
                </div>
            </div>

            <Tabs
                aria-label="Service Sections"
                variant="underlined"
                classNames={{
                    base: "w-full border-b border-zinc-800 mt-2",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors"
                }}
            >
                <Tab
                    key="capabilities"
                    title={
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={12} />
                            Capabilities
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-320px)] p-8">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">Active Status</h4>
                            <p className="text-sm font-black italic">{data.actionName || "Idle - Ready for action"}</p>

                            <Divider className="bg-zinc-800" />

                            <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">Available Capabilities</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {data.capabilities?.map((cap, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3 transition-colors hover:bg-zinc-800/80">
                                        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                            <Box size={14} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-wider">{cap}</span>
                                    </div>
                                ))}
                                {(!data.capabilities || data.capabilities.length === 0) && (
                                    <p className="text-xs text-zinc-600 italic">No capabilities defined for this service.</p>
                                )}
                            </div>
                        </div>
                    </ScrollShadow>
                </Tab>

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
                    <ScrollShadow className="h-[calc(100vh-320px)] p-8">
                        <div className="space-y-8">
                            {data.contexts?.map((context) => (
                                <div key={context.id} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-white tracking-tight">{context.label}</h4>
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
                                    <Input
                                        size="sm"
                                        variant="bordered"
                                        placeholder="Wklej link..."
                                        value={context.link || ""}
                                        onValueChange={(value) => onContextLinkChange(context.id, value)}
                                        startContent={<LinkIcon size={12} className="text-zinc-500" />}
                                        classNames={{
                                            input: "text-[10px] font-bold text-zinc-200",
                                            inputWrapper: "h-10 rounded-lg border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors shadow-none",
                                        }}
                                    />
                                </div>
                            ))}
                            {(!data.contexts || data.contexts.length === 0) && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No context links required.</p>
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
                    <ScrollShadow className="h-[calc(100vh-320px)] p-8">
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

                            {(!data.artefacts || data.artefacts.length === 0) && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No artefacts provided.</p>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>
        </CardBody>
    );
};
