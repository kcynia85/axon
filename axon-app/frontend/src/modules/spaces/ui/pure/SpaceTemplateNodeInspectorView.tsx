// frontend/src/modules/spaces/ui/pure/SpaceTemplateNodeInspectorView.tsx

import React from "react";
import dynamic from "next/dynamic";
import {
    ScrollShadow,
    Divider,
    Tabs,
    Tab,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Checkbox,
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
    FileText,
} from "lucide-react";
import { SpaceTemplateDomainData, TemplateAction, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";
import { SpaceInspectorPanel } from "../inspectors/components/SpaceInspectorPanel";

const SpaceTemplateCustomActionsEditor = dynamic(
    () => import("../inspectors/components/SpaceTemplateCustomActionsEditor").then(module => module.SpaceTemplateCustomActionsEditor),
    { ssr: false }
);

export type SpaceTemplateNodeInspectorViewProps = {
    readonly templateData: SpaceTemplateDomainData;
    readonly isAllDone: boolean;
    readonly isContextDone: boolean;
    readonly isArtefactsDone: boolean;
    readonly groupedActions: Record<string, TemplateAction[]>;
    readonly onActionToggle: (actionId: string) => void;
    readonly onCustomActionsChange: (content: string) => void;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onArtefactLinkChange: (artefactId: string, link: string) => void;
    readonly onArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly onArtefactOutputToggle: (artefactId: string) => void;
};

const ARTEFACT_STATUS_VISUAL_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
} as const;

export const SpaceTemplateNodeInspectorView = ({
    templateData,
    isAllDone,
    isContextDone,
    isArtefactsDone,
    groupedActions,
    onActionToggle,
    onCustomActionsChange,
    onContextLinkChange,
    onArtefactLinkChange,
    onArtefactStatusChange,
    onArtefactOutputToggle,
}: SpaceTemplateNodeInspectorViewProps) => {
    return (
        <SpaceInspectorPanel>
            <Tabs
                aria-label="Template Sections"
                variant="underlined"
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors p-0"
                }}
            >
                <Tab
                    key="actions"
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} />
                            Actions
                            {isAllDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-192px)] p-8">
                        <div className="space-y-12">
                            {Object.entries(groupedActions).map(([sectionName, actionsList]) => (
                                <div key={sectionName} className="space-y-5">
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-sm font-black text-white">{sectionName}</h4>
                                        <Divider className="bg-zinc-800/50" />
                                    </div>
                                    <div className="flex flex-col gap-3.5 pl-1">
                                        {actionsList.map((actionItem) => (
                                            <Checkbox
                                                key={actionItem.id}
                                                size="sm"
                                                radius="full"
                                                isSelected={actionItem.isCompleted}
                                                onValueChange={() => onActionToggle(actionItem.id)}
                                                classNames={{
                                                    label: cn(
                                                        "text-xs font-bold transition-all",
                                                        actionItem.isCompleted ? "text-zinc-500 line-through" : "text-zinc-300"
                                                    ),
                                                    wrapper: "after:bg-zinc-200"
                                                }}
                                            >
                                                {actionItem.label}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-6">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Notatki</h4>
                                    </div>
                                </div>
                                <div>
                                    <SpaceTemplateCustomActionsEditor
                                        initialContent={templateData.customActionsContent}
                                        onChange={onCustomActionsChange}
                                    />
                                </div>
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
                    <ScrollShadow className="h-[calc(100vh-192px)] p-8">
                        <div className="space-y-8">
                            {templateData.contexts?.map((contextItem) => (
                                <div key={contextItem.id} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black text-white tracking-tight">{contextItem.label}</h4>
                                        {contextItem.link && (
                                            <a
                                                href={contextItem.link}
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
                                        value={contextItem.link || ""}
                                        onValueChange={(value) => onContextLinkChange(contextItem.id, value)}
                                        startContent={<LinkIcon size={12} className="text-zinc-500" />}
                                        classNames={{
                                            input: "text-[10px] font-bold text-zinc-200",
                                            inputWrapper: "h-10 rounded-lg border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors shadow-none",
                                        }}
                                    />
                                </div>
                            ))}
                            {(!templateData.contexts || templateData.contexts.length === 0) && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No context links provided.</p>
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
                            {templateData.artefacts?.some(artefact => artefact.status === 'in_review') ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            ) : templateData.artefacts && templateData.artefacts.length > 0 ? (
                                <CheckCircle2 size={10} className="text-green-500" />
                            ) : null}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-192px)] p-8">
                        <div className="space-y-10">
                            {templateData.artefacts?.map((artefactItem) => (
                                <div key={artefactItem.id} className="space-y-3.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-black text-white tracking-tight">{artefactItem.label}</h4>
                                            {artefactItem.isOutput && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[8px] font-black text-orange-500 uppercase tracking-widest">
                                                    Output <ArrowUpRight size={8} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {artefactItem.link && (
                                                <a
                                                    href={artefactItem.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                                                >
                                                    Open <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Input
                                            size="sm"
                                            variant="bordered"
                                            placeholder="Wklej link..."
                                            value={artefactItem.link || ""}
                                            onValueChange={(value) => onArtefactLinkChange(artefactItem.id, value)}
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
                                                            <div className={cn("w-1.5 h-1.5 rounded-full", ARTEFACT_STATUS_VISUAL_CONFIG[artefactItem.status]?.dot || "bg-blue-400")} />
                                                            {ARTEFACT_STATUS_VISUAL_CONFIG[artefactItem.status]?.label || "In Review"}
                                                        </div>
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu
                                                    aria-label="Artefact Status"
                                                    onAction={(key) => onArtefactStatusChange(artefactItem.id, key as TemplateArtefact['status'])}
                                                    classNames={{
                                                        base: "bg-zinc-950 border border-zinc-800 p-1",
                                                    }}
                                                >
                                                    {(['in_review', 'approved'] as const).map((key) => (
                                                        <DropdownItem
                                                            key={key}
                                                            startContent={React.createElement(ARTEFACT_STATUS_VISUAL_CONFIG[key].icon, { size: 12, className: ARTEFACT_STATUS_VISUAL_CONFIG[key].color })}
                                                            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                                                        >
                                                            {ARTEFACT_STATUS_VISUAL_CONFIG[key].label}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>

                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="bordered"
                                                className={cn(
                                                    "h-10 w-10 border-zinc-800 transition-all",
                                                    artefactItem.isOutput ? "bg-orange-500/20 border-orange-500/50 text-orange-500" : "bg-zinc-900/30 text-zinc-600 hover:text-zinc-400"
                                                )}
                                                onPress={() => onArtefactOutputToggle(artefactItem.id)}
                                                title="Mark as Workflow Output"
                                            >
                                                <ArrowUpRight size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!templateData.artefacts || templateData.artefacts.length === 0) && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No artefacts provided.</p>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>
        </SpaceInspectorPanel>
    );
};
