// frontend/src/modules/spaces/ui/pure/SpaceServiceNodeInspectorView.tsx

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
    Select,
    SelectItem,
    SelectSection,
    Tooltip,
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
    Search,
    Network,
} from "lucide-react";
import { SpaceServiceDomainData, TemplateArtefact } from "../../domain/types";
import { cn } from "@/shared/lib/utils";

type SpaceServiceNodeInspectorViewProps = {
    readonly data: SpaceServiceDomainData;
    readonly isContextDone: boolean;
    readonly isArtefactsDone: boolean;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onLinkContextFromNode: (contextId: string, nodeLabel: string, artifactLabel: string) => void;
    readonly onArtefactLinkChange: (artefactId: string, link: string) => void;
    readonly onArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly onArtefactOutputToggle: (artefactId: string) => void;
    readonly onAddArtefact: () => void;
    readonly onCapabilityChange: (value: string) => void;
    readonly onAttachedLabelChange: (artefactId: string, value: string) => void;
};

const ARTEFACT_STATUS_CONFIG = {
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

// Simulated list of outputs available in the current workspace with explicit types
const DETECTED_WORKSPACE_OUTPUTS = [
    { node: "User Researcher", artifact: "user_persona.json", type: "json" },
    { node: "Interview Synthesis", artifact: "competitors_list.csv", type: "csv" },
    { node: "Figma Sync", artifact: "design_assets.zip", type: "zip" },
    { node: "Brand Engine", artifact: "logo_primary.png", type: "image" },
    { node: "Copywriter Agent", artifact: "draft_v1.json", type: "json" },
];

export const SpaceServiceNodeInspectorView = ({
    data,
    isContextDone,
    isArtefactsDone,
    onContextLinkChange,
    onLinkContextFromNode,
    onArtefactLinkChange,
    onArtefactStatusChange,
    onArtefactOutputToggle,
    onAddArtefact,
    onCapabilityChange,
    onAttachedLabelChange,
}: SpaceServiceNodeInspectorViewProps) => {
    const [capabilitySearch, setCapabilitySearch] = React.useState("");
    const [nodeSearch, setNodeSearch] = React.useState("");
    const filteredCapabilities = MOCK_CAPABILITIES.filter((cap) =>
        cap.label.toLowerCase().includes(capabilitySearch.toLowerCase())
    );

    return (
        <CardBody className="p-0 flex flex-col h-full bg-black text-white">
            {/* Action Buttons Section */}
            <div className="px-6 pt-6 pb-2 flex flex-col gap-2">
                <div className="flex gap-2">
                    <Button
                        className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all h-10 shadow-lg"
                        startContent={<ExternalLink size={14} />}
                    >
                        Open {data.label}
                    </Button>
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
                        <div className="space-y-10">
                            {data.contexts?.map((context) => {
                                // Filter outputs based on expected type and search
                                const compatibleOutputs = DETECTED_WORKSPACE_OUTPUTS.filter(out =>
                                    (!context.expectedType ||
                                    context.expectedType === 'any' ||
                                    out.type === context.expectedType) &&
                                    (out.node.toLowerCase().includes(nodeSearch.toLowerCase()) || 
                                     out.artifact.toLowerCase().includes(nodeSearch.toLowerCase()))
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
                                                    <Select
                                                        size="sm"
                                                        variant="flat"
                                                        aria-label="Node Outputs"
                                                        placeholder="Link from Node Output"
                                                        selectedKeys={[]}
                                                        isDisabled={compatibleOutputs.length === 0 && nodeSearch === ""}
                                                        onSelectionChange={(keys) => {
                                                            const key = Array.from(keys)[0];
                                                            if (key !== undefined) {
                                                                const source = compatibleOutputs[Number(key)];
                                                                if (source) {
                                                                    onLinkContextFromNode(context.id, source.node, source.artifact);
                                                                }
                                                            }
                                                        }}
                                                        onOpenChange={(isOpen) => !isOpen && setNodeSearch("")}
                                                        classNames={{
                                                            base: "w-full max-w-[260px]",
                                                            trigger: "h-9 bg-zinc-900/50 text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-lg border border-zinc-800 hover:text-white hover:border-zinc-700 shadow-none data-[hover=true]:bg-zinc-800 transition-all",
                                                            value: "text-zinc-400 font-black uppercase tracking-widest text-[10px]",
                                                            popoverContent: "bg-zinc-950 border border-zinc-800 rounded-xl p-0 shadow-2xl",
                                                            listbox: "p-2",
                                                        }}
                                                        renderValue={() => (
                                                            <div className="flex items-center gap-2.5">
                                                                <Network size={14} className="text-zinc-500" />
                                                                <span>Link from Node Output</span>
                                                            </div>
                                                        )}
                                                        listboxProps={{
                                                            topContent: (
                                                                <div className="px-1 py-2 border-b border-zinc-900 mb-1">
                                                                    <Input
                                                                        size="sm"
                                                                        placeholder="Search node or artifact..."
                                                                        value={nodeSearch}
                                                                        onChange={(e) => setNodeSearch(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter" && e.key !== "Escape") {
                                                                                e.stopPropagation();
                                                                            }
                                                                        }}
                                                                        startContent={<Search size={14} className="text-zinc-600" />}
                                                                        classNames={{
                                                                            input: "text-zinc-300 text-[11px] font-bold",
                                                                            inputWrapper: "h-9 bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors",
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }}
                                                    >
                                                        {compatibleOutputs.length > 0 ? (
                                                            compatibleOutputs.map((source, index) => (
                                                                <SelectItem 
                                                                    key={index} 
                                                                    textValue={source.node}
                                                                    className="data-[hover=true]:bg-zinc-900/80 rounded-lg py-2.5 px-3"
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex items-center justify-between gap-4">
                                                                            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-200">
                                                                                {source.node}
                                                                            </span>
                                                                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-900 text-zinc-600 rounded border border-zinc-800 uppercase tracking-tighter shrink-0">
                                                                                {source.type}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Archive size={10} className="text-zinc-600" />
                                                                            <span className="text-[10px] font-bold text-zinc-500 font-mono truncate">
                                                                                {source.artifact}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem key="none" isReadOnly className="text-[10px] font-black uppercase tracking-widest text-zinc-700 text-center py-6 italic">
                                                                No matching outputs
                                                            </SelectItem>
                                                        )}
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
                    <div className="flex flex-col h-[calc(100vh-320px)] relative">
                        <ScrollShadow className="flex-1 p-8 pb-32">
                            <div className="space-y-10">
                                {data.artefacts?.map((art) => (
                                    <div key={art.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
                                        <div className="flex flex-col gap-2.5">
                                            <div className="flex justify-between items-center text-xs gap-3">
                                                <div className="flex-1">
                                                    <Input
                                                        size="sm"
                                                        variant="underlined"
                                                        value={art.label}
                                                        placeholder="Artefact Name"
                                                        onChange={(e) => onAttachedLabelChange(art.id, e.target.value)}
                                                        classNames={{
                                                            input: "text-white font-black text-left text-sm",
                                                            inputWrapper: "h-8 min-h-8 p-0 border-transparent hover:border-zinc-800 transition-colors"
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
                                                    defaultSelectedKeys={data.capabilities?.[0] ? [data.capabilities[0]] : []}
                                                    onChange={(e) => onCapabilityChange(e.target.value)}
                                                    onOpenChange={(isOpen) => !isOpen && setCapabilitySearch("")}
                                                    classNames={{
                                                        base: "w-full",
                                                        trigger: "h-6 min-h-6 p-0 border-zinc-800 shadow-none bg-transparent hover:bg-transparent",
                                                        value: "text-zinc-500 font-bold text-left text-xs group-data-[has-value=true]:text-zinc-500",
                                                        popoverContent: "bg-zinc-950 border border-zinc-800 rounded-lg p-0",
                                                    }}
                                                    listboxProps={{
                                                        topContent: (
                                                            <div className="p-2 border-b border-zinc-800">
                                                                <Input
                                                                    size="sm"
                                                                    placeholder="Search capability..."
                                                                    value={capabilitySearch}
                                                                    onChange={(e) => setCapabilitySearch(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter" && e.key !== "Escape") {
                                                                            e.stopPropagation();
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
                                                            {filteredCapabilities.slice(0, 2).map((cap) => (
                                                                <SelectItem key={`recent_${cap.key}`} textValue={cap.label} className="text-xs font-bold text-zinc-400">
                                                                    {cap.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectSection>,
                                                        <SelectSection
                                                            key="all"
                                                            title="All Capabilities"
                                                            classNames={{ heading: "text-[9px] font-black uppercase tracking-widest text-zinc-600 px-2 py-1" }}
                                                        >
                                                            {filteredCapabilities.map((cap) => (
                                                                <SelectItem key={cap.key} textValue={cap.label} className="text-xs font-bold text-zinc-400">
                                                                    {cap.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectSection>
                                                    ] : capabilitySearch.trim().length > 0 ? (
                                                        <SelectItem key={capabilitySearch.trim()} textValue={capabilitySearch.trim()} className="text-xs font-bold text-zinc-400">
                                                            Create &quot;{capabilitySearch.trim()}&quot;
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
                                                        variant="underlined"
                                                        placeholder="Paste URL"
                                                        value={art.link || ''}
                                                        onChange={(e) => onArtefactLinkChange(art.id, e.target.value)}
                                                        classNames={{
                                                            input: "!text-zinc-500 font-bold text-xs text-left placeholder:text-zinc-600",
                                                            inputWrapper: "h-6 min-h-6 p-0 border-zinc-800"
                                                        }}
                                                    />
                                                    <Button
                                                        isIconOnly
                                                        as="a"
                                                        href={art.link || '#'}
                                                        target="_blank"
                                                        size="sm"
                                                        isDisabled={!art.link}
                                                        className="w-6 h-6 min-w-6 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Open link"
                                                    >
                                                        <ExternalLink size={10} />
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
                                                            className="h-8 border-zinc-800 bg-zinc-900/80 text-[9px] font-black uppercase tracking-widest min-w-28 justify-between"
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

                                                <Tooltip
                                                    content={art.status === 'approved' ? (art.isOutput ? "Unmark as Workflow Output" : "Mark as Workflow Output") : "Approve artefact to mark as output"}
                                                    placement="top"
                                                    classNames={{
                                                        content: "py-1 px-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950 border border-zinc-800 shadow-md",
                                                    }}
                                                    closeDelay={0}
                                                >
                                                    <div className="inline-block relative">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="bordered"
                                                            isDisabled={art.status !== 'approved'}
                                                            className={cn(
                                                                "h-8 w-8 border-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
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
                                ))}

                            </div>
                        </ScrollShadow>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black border-t border-zinc-900 border-solid z-10 w-full shadow-[0px_-20px_20px_0px_rgba(0,0,0,0.8)]">
                            <Button
                                variant="bordered"
                                className="w-full border-solid border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 h-10 text-[10px] font-black uppercase tracking-widest"
                                startContent={<span className="text-lg leading-none mb-0.5">+</span>}
                                onPress={onAddArtefact}
                            >
                                Dodaj Artefakt
                            </Button>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </CardBody>
    );
};
