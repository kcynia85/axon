// frontend/src/modules/spaces/ui/pure/SpaceServiceNodeInspectorView.tsx

import React from "react";
import {
    Button,
    ScrollShadow,
    Tabs,
    Tab,
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Select,
    SelectItem,
    SelectSection,
    Tooltip,
} from "@heroui/react";
import {
    Archive,
    ExternalLink,
    ChevronDown,
    Clock,
    CheckCircle,
    ArrowUpRight,
    CheckCircle2,
    Search,
    Link as LinkIcon,
    X,
} from "lucide-react";
import { SpaceServiceDomainData, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";
import { SpaceInspectorFooter } from "../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../inspectors/components/SpaceInspectorPanel";
import { SpaceCrewContextTab } from "../inspectors/crews/shared/SpaceCrewContextTab";

export type SpaceServiceNodeInspectorViewProps = {
    readonly serviceData: SpaceServiceDomainData;
    readonly isContextDone: boolean;
    readonly isArtefactsDone: boolean;
    readonly selectedTabIdentifier: string;
    readonly componentSearchQuery: string;
    readonly capabilitySearchQuery: string;
    readonly onTabChange: (tabIdentifier: string) => void;
    readonly onSearchQueryChange: (query: string) => void;
    readonly onCapabilitySearchChange: (query: string) => void;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onLinkContextFromNode: (contextId: string, nodeLabel: string, artifactLabel: string) => void;
    readonly onArtefactLinkChange: (artefactId: string, link: string) => void;
    readonly onArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly onArtefactOutputToggle: (artefactId: string) => void;
    readonly onAddArtefact: () => void;
    readonly onCapabilityChange: (value: string) => void;
    readonly onAttachedLabelChange: (artefactId: string, value: string) => void;
    readonly canvasNodes: any[];
    readonly onClose?: () => void;
};

const ARTEFACT_STATUS_VISUAL_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
} as const;

const MOCK_CAPABILITIES = [
    { key: "Text-to-Speech", label: "Text-to-Speech" },
    { key: "Speech-to-Text", label: "Speech-to-Text" },
    { key: "Text Generation", label: "Text Generation" },
    { key: "Image Generation", label: "Image Generation" },
    { key: "Video Generation", label: "Video Generation" },
    { key: "Data Extraction", label: "Data Extraction" },
];

export const SpaceServiceNodeInspectorView = ({
    serviceData,
    isContextDone,
    isArtefactsDone,
    selectedTabIdentifier,
    componentSearchQuery,
    capabilitySearchQuery,
    onTabChange,
    onSearchQueryChange,
    onCapabilitySearchChange,
    onContextLinkChange,
    onLinkContextFromNode,
    onArtefactLinkChange,
    onArtefactStatusChange,
    onArtefactOutputToggle,
    onAddArtefact,
    onCapabilityChange,
    onAttachedLabelChange,
    canvasNodes,
    onClose,
}: SpaceServiceNodeInspectorViewProps) => {
    const filteredCapabilities = MOCK_CAPABILITIES.filter((capability) =>
        capability.label.toLowerCase().includes(capabilitySearchQuery.toLowerCase())
    );

    const artefacts = serviceData.artefacts || [];
    const hasInReview = artefacts.some(artefact => artefact.status === 'in_review');
    const allApproved = artefacts.length > 0 && artefacts.every(artefact => artefact.status === 'approved');

    return (
        <SpaceInspectorPanel className="relative">
            {onClose && (
                <div className="absolute top-2 right-6 z-30">
                    <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm" 
                        className="text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        onPress={onClose}
                    >
                        <X size={20} strokeWidth={3} />
                    </Button>
                </div>
            )}
            <Tabs 

                aria-label="Service Sections"
                variant="underlined"
                selectedKey={selectedTabIdentifier}
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
                            <LinkIcon size={12} />
                            Context
                            {isContextDone && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewContextTab 
                            isContextComplete={isContextDone}
                            contextRequirements={serviceData.contexts || []}
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
                            <Archive size={12} />
                            Artefacts
                            {hasInReview ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [0_0_8px_rgb(0,0,0)]" />
                            ) : allApproved ? (
                                <CheckCircle2 size={10} className="text-white" />
                            ) : null}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <ScrollShadow className="p-8 h-full pb-48">
                            <div className="space-y-10">
                                {artefacts.map((artefactItem) => {
                                    const isFilled = (artefactItem.link || "").trim().length > 0;
                                    return (
                                        <div key={artefactItem.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                                            <div className="flex flex-col gap-2.5">
                                                <div className="flex justify-between items-center text-xs gap-3">
                                                    <div className="flex-1">
                                                        <Input
                                                            size="sm"
                                                            variant="underlined"
                                                            value={artefactItem.label}
                                                            placeholder="Artefact Name"
                                                            onChange={(event) => onAttachedLabelChange(artefactItem.id, event.target.value)}
                                                            classNames={{
                                                                input: "text-white font-black text-left text-sm",
                                                                inputWrapper: "h-8 min-h-8 p-0 border-transparent hover:border-zinc-800 transition-colors  after:hidden"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-xs w-full">
                                                    <Select
                                                        size="sm"
                                                        variant="underlined"
                                                        aria-label="Capability"
                                                        placeholder="Select capability"
                                                        defaultSelectedKeys={serviceData.capabilities?.[0] ? [serviceData.capabilities[0]] : []}
                                                        onChange={(event) => onCapabilityChange(event.target.value)}
                                                        onOpenChange={(isDropdownOpen) => !isDropdownOpen && onCapabilitySearchChange("")}
                                                        classNames={{
                                                            base: "w-full",
                                                            trigger: "h-6 min-h-6 p-0 border-zinc-800  bg-transparent hover:bg-transparent after:hidden",
                                                            value: "text-zinc-500 font-bold text-left text-xs group-data-[has-value=true]:text-zinc-500",
                                                            popoverContent: "bg-zinc-950 border border-zinc-800 rounded-lg p-0",
                                                        }}
                                                        listboxProps={{
                                                            topContent: (
                                                                <div className="p-2 border-b border-zinc-800">
                                                                    <Input
                                                                        size="sm"
                                                                        placeholder="Search capability..."
                                                                        value={capabilitySearchQuery}
                                                                        onChange={(event) => onCapabilitySearchChange(event.target.value)}
                                                                        onKeyDown={(event) => {
                                                                            if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Enter" && event.key !== "Escape") {
                                                                                event.stopPropagation();
                                                                            }
                                                                        }}
                                                                        startContent={<Search size={12} className="text-zinc-500" />}
                                                                        classNames={{
                                                                            input: "text-zinc-300 text-xs",
                                                                            inputWrapper: "h-8 min-h-8 bg-zinc-900",
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }}
                                                    >
                                                        {filteredCapabilities.length > 0 ? [
                                                            <SelectSection
                                                                key="recent"
                                                                title="Recently Used"
                                                                showDivider
                                                                classNames={{ heading: "text-[9px] font-black uppercase tracking-widest text-zinc-600 px-2 py-1", divider: "bg-zinc-800" }}
                                                            >
                                                                {filteredCapabilities.slice(0, 2).map((capability) => (
                                                                    <SelectItem key={`recent_${capability.key}`} textValue={capability.label} className="text-xs font-bold text-zinc-400">
                                                                        {capability.label}
                                                                </SelectItem>
                                                                ))}
                                                            </SelectSection>,
                                                            <SelectSection
                                                                key="all"
                                                                title="All Capabilities"
                                                                classNames={{ heading: "text-[9px] font-black uppercase tracking-widest text-zinc-600 px-2 py-1" }}
                                                            >
                                                                {filteredCapabilities.map((capability) => (
                                                                    <SelectItem key={capability.key} textValue={capability.label} className="text-xs font-bold text-zinc-400">
                                                                        {capability.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectSection>
                                                        ] : capabilitySearchQuery.trim().length > 0 ? (
                                                            <SelectItem key={capabilitySearchQuery.trim()} textValue={capabilitySearchQuery.trim()} className="text-xs font-bold text-zinc-400">
                                                                Create &quot;{capabilitySearchQuery.trim()}&quot;
                                                            </SelectItem>
                                                        ) : (
                                                            <SelectItem key="empty" className="text-xs font-bold text-zinc-600 text-center" isReadOnly>
                                                                Type to add new capability
                                                            </SelectItem>
                                                        )}
                                                    </Select>
                                                </div>
                                                <div className="flex items-center text-xs pt-2 border-t border-zinc-800">
                                                    <div className="w-full flex gap-2 items-center">
                                                        <Input
                                                            size="sm"
                                                            variant="bordered"
                                                            placeholder="Paste URL"
                                                            value={artefactItem.link || ''}
                                                            onValueChange={(value) => onArtefactLinkChange(artefactItem.id, value)}
                                                            startContent={<LinkIcon size={12} className={cn(isFilled ? "text-white" : "text-zinc-500")} />}
                                                            endContent={isFilled && <CheckCircle2 size={14} className="text-white" />}
                                                            classNames={{
                                                                input: "text-[10px] font-bold text-zinc-200",
                                                                inputWrapper: cn(
                                                                    "h-11 rounded-xl transition-all  border",
                                                                    isFilled ? "bg-zinc-950 border-white border-2" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                                                                ),
                                                            }}
                                                        />
                                                        <Button
                                                            isIconOnly
                                                            as="a"
                                                            href={artefactItem.link || '#'}
                                                            target="_blank"
                                                            size="sm"
                                                            isDisabled={!artefactItem.link}
                                                            className="w-11 h-11 min-w-11 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white shrink-0 disabled: disabled:cursor-not-allowed rounded-xl"
                                                            title="Open link"
                                                        >
                                                            <ExternalLink size={14} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-2">
                                                <div className="flex items-center gap-2">
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <Button
                                                                size="sm"
                                                                variant="bordered"
                                                                className="h-10 border-zinc-800 bg-zinc-900 text-[9px] font-black uppercase tracking-widest min-w-32 justify-between rounded-lg"
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

                                                    <Tooltip
                                                        content={artefactItem.isOutput ? "Unmark as Workflow Output" : "Mark as Workflow Output"}
                                                        placement="top"
                                                        classNames={{
                                                            content: "py-1 px-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950 border border-zinc-800 ",
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
                                                                    artefactItem.isOutput ? "bg-orange-500 border-orange-500 text-orange-500" : "bg-zinc-900 text-zinc-600 hover:text-zinc-400"
                                                                )}
                                                                onPress={() => onArtefactOutputToggle(artefactItem.id)}
                                                            >
                                                                <ArrowUpRight size={14} />
                                                            </Button>
                                                        </div>
                                                    </Tooltip>
                                                </div>

                                                {artefactItem.isOutput && (
                                                    <div className="shrink-0 flex items-center">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 px-2 py-1 rounded bg-orange-500 border border-orange-500">
                                                            Active Output
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {(!artefacts || artefacts.length === 0) && (
                                    <div className="flex flex-col items-center justify-center py-20 ">
                                        <Archive size={40} className="text-zinc-700 mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">No artefacts generated</p>
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
                        variant="bordered"
                        className="w-full border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 h-10 text-[10px] font-black uppercase tracking-widest rounded-md"
                        startContent={<span className="text-lg leading-none mb-0.5">+</span>}
                        onPress={onAddArtefact}
                    >
                        Dodaj Artefakt
                    </Button>
                    <Button
                        className="w-full font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all h-10 "
                        startContent={<ExternalLink size={14} />}
                    >
                        Open {serviceData.label}
                    </Button>
                </div>
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
