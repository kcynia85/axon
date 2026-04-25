import React, { useState } from "react";
import {
    ScrollShadow,
    Input,
    Select,
    SelectItem,
    Button
} from "@heroui/react";
import { 
    Layers, 
    CheckCircle2, 
    Network, 
    Link as LinkIcon, 
    Search, 
    Archive,
    ChevronDown,
    FileText,
    Sparkles
} from "lucide-react";
import { TemplateContext } from "@/modules/spaces/domain/types";
import { cn } from "@/shared/lib/utils";
import { useKnowledgeSearch } from "@/modules/knowledge/application/useKnowledgeSearch";

export type SpaceCrewContextTabProperties = {
    readonly isContextComplete: boolean;
    readonly contextRequirements: readonly TemplateContext[];
    readonly nodeSearchQuery: string;
    readonly onSearchQueryChange: (query: string) => void;
    readonly onContextLinkChange: (contextId: string, link: string) => void;
    readonly onLinkContextFromNode: (contextId: string, nodeLabel: string, artifactLabel: string) => void;
    readonly canvasNodes?: any[];
};

export const SpaceCrewContextTab = ({
    contextRequirements,
    nodeSearchQuery,
    onSearchQueryChange,
    onContextLinkChange,
    onLinkContextFromNode,
    canvasNodes = []
}: SpaceCrewContextTabProperties) => {
    const [kbSearchQuery, setKbSearchQuery] = useState("");
    const { data: kbResults, isLoading: isKbLoading } = useKnowledgeSearch(kbSearchQuery, kbSearchQuery.length > 2);

    const workflowOutputs = React.useMemo(() => {
        if (!canvasNodes) return [];
        
        return canvasNodes.flatMap(node => {
            const artefacts = (node.data as any)?.artefacts || [];
            return artefacts
                .filter((art: any) => art.isOutput)
                .map((art: any) => ({
                    node: (node.data as any)?.label || "Unknown Node",
                    artifact: art.label || "Unnamed Artefact",
                    type: "output", // Defaulting to output type
                    id: art.id
                }));
        });
    }, [canvasNodes]);

    return (
        <ScrollShadow className="h-full px-8 pt-10 pb-48">
            <div className="space-y-12">
                {contextRequirements.map((contextItem) => {
                    const compatibleOutputs = workflowOutputs.filter(outputItem =>
                        (outputItem.node.toLowerCase().includes(nodeSearchQuery.toLowerCase()) || 
                         outputItem.artifact.toLowerCase().includes(nodeSearchQuery.toLowerCase()))
                    );

                    const isMissing = !contextItem.link && !contextItem.sourceNodeLabel;
                    const formatLabel = contextItem.expectedType ? `[ ${contextItem.expectedType.toUpperCase()} ]` : '[ TEXT ]';

                    return (
                        <div key={contextItem.id} className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className={cn("text-[13px] font-black tracking-tighter font-mono", isMissing ? "text-red-500" : "text-white")}>
                                        {contextItem.label} <span className="text-[10px] text-zinc-600 font-mono ml-1">{formatLabel}</span>
                                    </h4>
                                </div>
                                {isMissing && (
                                    <div className="text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest bg-red-500 text-red-500 border border-red-500">
                                        MISSING
                                    </div>
                                )}
                            </div>

                            {contextItem.sourceNodeLabel ? (
                                <div className="p-4 bg-zinc-950 border-2 border-white rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-zinc-900 text-white">
                                        <Network size={16} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{contextItem.sourceNodeLabel}</span>
                                        <span className="text-[10px] font-bold text-zinc-500 font-mono truncate">{contextItem.sourceArtifactLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-white" />
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="min-w-0 h-8 px-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest"
                                            onPress={() => onContextLinkChange(contextItem.id, "")}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Input
                                        size="sm"
                                        variant="bordered"
                                        placeholder="Paste link or link from node..."
                                        value={contextItem.link || ""}
                                        onChange={(e) => onContextLinkChange(contextItem.id, e.target.value)}
                                        startContent={<LinkIcon size={14} className={cn(isMissing ? "text-red-500" : "text-white")} />}
                                        endContent={!isMissing && <CheckCircle2 size={16} className="text-white" />}
                                        classNames={{
                                            input: "text-[11px] font-bold text-zinc-200",
                                            inputWrapper: cn(
                                                "h-14 rounded-2xl bg-zinc-950 transition-all  border",
                                                isMissing 
                                                    ? "border-red-900 hover:border-red-500 focus-within:!border-red-500" 
                                                    : "border-white border-2"
                                            ),
                                        }}
                                    />

                                    <div className="grid grid-cols-2 gap-3">
                                        <Select
                                            size="sm"
                                            variant="bordered"
                                            aria-label="Node Outputs"
                                            placeholder="NODE OUTPUT"
                                            selectedKeys={[]}
                                            isDisabled={compatibleOutputs.length === 0 && nodeSearchQuery === ""}
                                            onSelectionChange={(selectionKeys) => {
                                                const selectedKey = Array.from(selectionKeys)[0];
                                                if (selectedKey !== undefined) {
                                                    const sourceItem = compatibleOutputs[Number(selectedKey)];
                                                    if (sourceItem) {
                                                        onLinkContextFromNode(contextItem.id, sourceItem.node, sourceItem.artifact);
                                                    }
                                                }
                                            }}
                                            onOpenChange={(isDropdownOpen) => !isDropdownOpen && onSearchQueryChange("")}
                                            classNames={{
                                                base: "w-full",
                                                trigger: cn(
                                                    "h-11 font-black uppercase tracking-widest text-[9px] rounded-xl  transition-all bg-transparent",
                                                    isMissing 
                                                        ? "text-red-500 border-red-900 data-[hover=true]:border-red-500 data-[hover=true]:text-red-500 data-[hover=true]:bg-red-500/[0.02]" 
                                                        : "text-zinc-500 border-zinc-800 data-[hover=true]:text-zinc-300 data-[hover=true]:bg-white/[0.03] data-[hover=true]:border-zinc-700"
                                                ),
                                                value: "text-zinc-500 font-black uppercase tracking-widest text-[9px]",
                                                popoverContent: "bg-zinc-950 border border-zinc-800 rounded-2xl p-0 ",
                                                listbox: "p-2",
                                            }}
                                            renderValue={() => (
                                                <div className="flex items-center gap-2">
                                                    <Network size={12} />
                                                    <span>NODE OUTPUT</span>
                                                </div>
                                            )}
                                            listboxProps={{
                                                topContent: (
                                                    <div className="px-1 py-2 border-b border-zinc-900 mb-1">
                                                        <Input
                                                            size="sm"
                                                            placeholder="Search..."
                                                            value={nodeSearchQuery}
                                                            onChange={(event) => onSearchQueryChange(event.target.value)}
                                                            startContent={<Search size={14} className="text-zinc-600" />}
                                                            classNames={{
                                                                input: "text-zinc-300 text-[11px] font-bold",
                                                                inputWrapper: "h-10 bg-zinc-900 border-zinc-800 data-[hover=true]:border-zinc-700 transition-colors ",
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }}
                                        >
                                            {compatibleOutputs.map((sourceItem, sourceIndex) => (
                                                <SelectItem 
                                                    key={sourceIndex} 
                                                    textValue={sourceItem.node}
                                                    className="data-[hover=true]:bg-white/[0.05] rounded-xl py-3 px-4 group transition-all"
                                                >
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 group-data-[hover=true]:text-zinc-200 transition-colors">
                                                                {sourceItem.node}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Archive size={12} className="text-zinc-600 group-data-[hover=true]:text-zinc-400 transition-colors" />
                                                            <span className="text-[10px] font-bold text-zinc-500 font-mono truncate group-data-[hover=true]:text-zinc-300 transition-colors">
                                                                {sourceItem.artifact}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Select
                                            size="sm"
                                            variant="bordered"
                                            aria-label="Knowledge Base"
                                            placeholder="KNOWLEDGE"
                                            selectedKeys={[]}
                                            onSelectionChange={(selectionKeys) => {
                                                const selectedKey = Array.from(selectionKeys)[0];
                                                if (selectedKey !== undefined) {
                                                    const result = kbResults?.[Number(selectedKey)];
                                                    if (result) {
                                                        // Link by resource ID or path
                                                        onContextLinkChange(contextItem.id, `kb://${result.id}`);
                                                    }
                                                }
                                            }}
                                            onOpenChange={(isDropdownOpen) => !isDropdownOpen && setKbSearchQuery("")}
                                            classNames={{
                                                base: "w-full",
                                                trigger: cn(
                                                    "h-11 font-black uppercase tracking-widest text-[9px] rounded-xl  transition-all bg-transparent",
                                                    "text-zinc-500 border-zinc-800 data-[hover=true]:text-blue-400 data-[hover=true]:bg-blue-500/[0.03] data-[hover=true]:border-blue-500"
                                                ),
                                                value: "text-zinc-500 font-black uppercase tracking-widest text-[9px]",
                                                popoverContent: "bg-zinc-950 border border-zinc-800 rounded-2xl p-0 ",
                                                listbox: "p-2",
                                            }}
                                            renderValue={() => (
                                                <div className="flex items-center gap-2">
                                                    <Sparkles size={12} className="text-blue-500" />
                                                    <span>KNOWLEDGE</span>
                                                </div>
                                            )}
                                            listboxProps={{
                                                topContent: (
                                                    <div className="px-1 py-2 border-b border-zinc-900 mb-1">
                                                        <Input
                                                            size="sm"
                                                            placeholder="Search knowledge..."
                                                            value={kbSearchQuery}
                                                            onChange={(event) => setKbSearchQuery(event.target.value)}
                                                            startContent={<Search size={14} className="text-zinc-600" />}
                                                            classNames={{
                                                                input: "text-zinc-300 text-[11px] font-bold",
                                                                inputWrapper: "h-10 bg-zinc-900 border-zinc-800 data-[hover=true]:border-zinc-700 transition-colors ",
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }}
                                        >
                                            {kbResults && kbResults.length > 0 ? (
                                                kbResults.map((result, idx) => (
                                                    <SelectItem 
                                                        key={idx} 
                                                        textValue={result.metadata.text}
                                                        className="data-[hover=true]:bg-white/[0.05] rounded-xl py-3 px-4 group transition-all"
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <FileText size={12} className="text-blue-400" />
                                                                <span className="text-[11px] font-bold text-zinc-200 line-clamp-1">
                                                                    {result.metadata.text}
                                                                </span>
                                                            </div>
                                                            <span className="text-[9px] font-mono text-zinc-500">
                                                                Score: {(result.score * 100).toFixed(0)}%
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem key="none" isReadOnly className="text-[10px] font-black uppercase tracking-widest text-zinc-700 text-center py-8 italic">
                                                    {isKbLoading ? "Searching..." : "Type to search knowledge"}
                                                </SelectItem>
                                            )}
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {(!contextRequirements || contextRequirements.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 ">
                        <Layers size={40} className="text-zinc-700 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">No context required</p>
                    </div>
                )}
            </div>
        </ScrollShadow>
    );
};

