// frontend/src/modules/spaces/ui/pure/SpaceTemplateNodeInspectorView.tsx

import React from "react";
import dynamic from "next/dynamic";
import {
  CardBody,
  Button,
  ScrollShadow,
  Checkbox,
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
  Plus,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Archive,
  ExternalLink,
  ChevronDown,
  Clock,
  CheckCircle,
  ArrowUpRight, // Added ArrowUpRight
} from "lucide-react";
import { SpaceTemplateDomainData, TemplateAction, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";

const SpaceTemplateCustomActionsEditor = dynamic(
  () => import("../inspectors/components/SpaceTemplateCustomActionsEditor").then(mod => mod.SpaceTemplateCustomActionsEditor),
  { ssr: false }
);

type SpaceTemplateNodeInspectorViewProps = {
    readonly data: SpaceTemplateDomainData;
    readonly isAllDone: boolean;
    readonly isContextDone: boolean;
    readonly isArtefactsDone: boolean;
    readonly groupedActions: Record<string, TemplateAction[]>;
    readonly onActionToggle: (id: string) => void;
    readonly onCustomActionsChange: (content: string) => void;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onArtefactLinkChange: (artefactId: string, link: string) => void;
    readonly onArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly onArtefactOutputToggle: (artefactId: string) => void; // Added
};

const ARTEFACT_STATUS_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
    // Keeping others for internal compatibility if needed, but only top 2 will be shown in menu
    pending: { label: "Pending", color: "text-zinc-500", dot: "bg-zinc-700", icon: Clock },
    completed: { label: "Completed", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle2 },
    failed: { label: "Failed", color: "text-red-500", dot: "bg-red-500", icon: Clock },
} as const;

export const SpaceTemplateNodeInspectorView = ({
    data,
    isAllDone,
    isContextDone,
    isArtefactsDone,
    groupedActions,
    onActionToggle,
    onCustomActionsChange,
    onContextLinkChange,
    onArtefactLinkChange,
    onArtefactStatusChange,
    onArtefactOutputToggle, // Added
}: SpaceTemplateNodeInspectorViewProps) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <Tabs 
                aria-label="Template Sections" 
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
                    key="actions" 
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12}/> 
                            Actions
                            {isAllDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
                        <div className="space-y-12">
                            {Object.entries(groupedActions).map(([sectionName, actions]) => (
                                <div key={sectionName} className="space-y-5">
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-sm font-black text-white">{sectionName}</h4>
                                        <Divider className="bg-zinc-800/50" />
                                    </div>
                                    <div className="flex flex-col gap-3.5 pl-1">
                                        {actions.map((action) => (
                                            <Checkbox 
                                                key={action.id}
                                                size="sm" 
                                                radius="full"
                                                isSelected={action.isCompleted}
                                                onValueChange={() => onActionToggle(action.id)}
                                                classNames={{
                                                    label: cn(
                                                        "text-xs font-bold transition-all", 
                                                        action.isCompleted ? "text-zinc-500 line-through" : "text-zinc-300"
                                                    ),
                                                    wrapper: "after:bg-zinc-200"
                                                }}
                                            >
                                                {action.label}
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
                                        initialContent={data.customActionsContent}
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
                            <LinkIcon size={12}/> 
                            Context
                            {isContextDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
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
                                <p className="text-xs text-zinc-600 italic text-center py-10">No context links provided.</p>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>

                <Tab 
                    key="artefacts" 
                    title={
                        <div className="flex items-center gap-2">
                            <Archive size={12}/> 
                            Artefacts
                            {isArtefactsDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
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
                                    
                                    <div className="flex items-center gap-2">
                                        <Input
                                            size="sm"
                                            variant="bordered"
                                            placeholder="Wklej link..."
                                            value={art.link || ""}
                                            onValueChange={(value) => onArtefactLinkChange(art.id, value)}
                                            startContent={<LinkIcon size={12} className="text-zinc-500" />}
                                            classNames={{
                                                base: "flex-1",
                                                input: "text-[10px] font-bold text-zinc-200",
                                                inputWrapper: "h-10 rounded-lg border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors shadow-none",
                                            }}
                                        />
                                        
                                        <div className="flex gap-1">
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button 
                                                        size="sm" 
                                                        variant="bordered" 
                                                        className="h-10 border-zinc-800 bg-zinc-900/30 text-[9px] font-black uppercase tracking-widest min-w-32 justify-between"
                                                        endContent={<ChevronDown size={12} />}
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={cn("w-1.5 h-1.5 rounded-full", ARTEFACT_STATUS_CONFIG[art.status]?.dot || "bg-zinc-700")} />
                                                            {ARTEFACT_STATUS_CONFIG[art.status]?.label || "Pending"}
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
