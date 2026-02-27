// frontend/src/modules/spaces/ui/inspectors/crews/shared/SpaceCrewContextTab.tsx

import React from "react";
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
    ExternalLink,
    ChevronDown
} from "lucide-react";
import { TemplateContext } from "../../../../domain/types";
import { cn } from "@/shared/lib/utils";

const DETECTED_WORKSPACE_OUTPUTS = [
    { node: "User Researcher", artifact: "user_persona.json", type: "json" },
    { node: "Interview Synthesis", artifact: "competitors_list.csv", type: "csv" },
    { node: "Figma Sync", artifact: "design_assets.zip", type: "zip" },
    { node: "Brand Engine", artifact: "logo_primary.png", type: "image" },
    { node: "Copywriter Agent", artifact: "draft_v1.json", type: "json" },
];

type SpaceCrewContextTabProps = {
    readonly isContextComplete: boolean;
    readonly contextRequirements: readonly TemplateContext[];
    readonly nodeSearch: string;
    readonly setNodeSearch: (query: string) => void;
    readonly handleContextLinkChange: (id: string, link: string) => void;
    readonly handleLinkContextFromNode: (id: string, nodeLabel: string, artifactLabel: string) => void;
};

export const SpaceCrewContextTab = ({
    isContextComplete,
    contextRequirements,
    nodeSearch,
    setNodeSearch,
    handleContextLinkChange,
    handleLinkContextFromNode
}: SpaceCrewContextTabProps) => {
    return (
        <ScrollShadow className="h-full px-8 pt-10 pb-48">
            <div className="space-y-12">
                {contextRequirements.map((context) => {
                    const compatibleOutputs = DETECTED_WORKSPACE_OUTPUTS.filter(out =>
                        (!context.expectedType ||
                        context.expectedType === 'any' ||
                        out.type === context.expectedType) &&
                        (out.node.toLowerCase().includes(nodeSearch.toLowerCase()) || 
                         out.artifact.toLowerCase().includes(nodeSearch.toLowerCase()))
                    );

                    const isMissing = !context.link && !context.sourceNodeLabel;
                    const formatLabel = context.expectedType ? `[ ${context.expectedType.toUpperCase()} ]` : '[ TEXT ]';

                    return (
                        <div key={context.id} className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className={cn("text-[13px] font-black tracking-tighter font-mono", isMissing ? "text-red-500" : "text-white")}>
                                        {context.label} <span className="text-[10px] text-zinc-600 font-mono ml-1">{formatLabel}</span>
                                    </h4>
                                </div>
                                {isMissing && (
                                    <div className="text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest bg-red-500/5 text-red-500 border border-red-500/20">
                                        MISSING
                                    </div>
                                )}
                            </div>

                            {context.sourceNodeLabel ? (
                                <div className="p-4 bg-zinc-950/50 border-2 border-white rounded-2xl flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-zinc-900 text-white">
                                        <Network size={16} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{context.sourceNodeLabel}</span>
                                        <span className="text-[10px] font-bold text-zinc-500 font-mono truncate">{context.sourceArtifactLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-white" />
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="min-w-0 h-8 px-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest"
                                            onPress={() => handleContextLinkChange(context.id, "")}
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
                                        value={context.link || ""}
                                        onValueChange={(value) => handleContextLinkChange(context.id, value)}
                                        startContent={<LinkIcon size={14} className={cn(isMissing ? "text-red-500/40" : "text-white")} />}
                                        endContent={!isMissing && <CheckCircle2 size={16} className="text-white" />}
                                        classNames={{
                                            input: "text-[11px] font-bold text-zinc-200",
                                            inputWrapper: cn(
                                                "h-14 rounded-2xl bg-zinc-950/30 transition-all shadow-none border",
                                                isMissing 
                                                    ? "border-red-900/30 hover:border-red-500 focus-within:!border-red-500" 
                                                    : "border-white border-2"
                                            ),
                                        }}
                                    />

                                    <div className="flex justify-start">
                                        <Select
                                            size="sm"
                                            variant="bordered"
                                            aria-label="Node Outputs"
                                            placeholder="LINK FROM NODE OUTPUT"
                                            selectedKeys={[]}
                                            isDisabled={compatibleOutputs.length === 0 && nodeSearch === ""}
                                            onSelectionChange={(keys) => {
                                                const key = Array.from(keys)[0];
                                                if (key !== undefined) {
                                                    const source = compatibleOutputs[Number(key)];
                                                    if (source) {
                                                        handleLinkContextFromNode(context.id, source.node, source.artifact);
                                                    }
                                                }
                                            }}
                                            onOpenChange={(isOpen) => !isOpen && setNodeSearch("")}
                                            classNames={{
                                                base: "w-full",
                                                trigger: cn(
                                                    "h-12 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-none transition-all bg-transparent",
                                                    isMissing 
                                                        ? "text-red-500/60 border-red-900/20 data-[hover=true]:border-red-500 data-[hover=true]:text-red-500 data-[hover=true]:bg-red-500/[0.02]" 
                                                        : "text-zinc-500 border-zinc-800 data-[hover=true]:text-zinc-300 data-[hover=true]:bg-white/[0.03] data-[hover=true]:border-zinc-700"
                                                ),
                                                value: "text-zinc-500 font-black uppercase tracking-widest text-[10px]",
                                                popoverContent: "bg-zinc-950 border border-zinc-800 rounded-2xl p-0 shadow-2xl",
                                                listbox: "p-2",
                                            }}
                                            renderValue={() => (
                                                <div className="flex items-center gap-3">
                                                    <span>LINK FROM NODE OUTPUT</span>
                                                    <ChevronDown size={14} className="ml-auto opacity-50" />
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
                                                                inputWrapper: "h-10 bg-zinc-900 border-zinc-800 data-[hover=true]:border-zinc-700 transition-colors shadow-none",
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
                                                        className="data-[hover=true]:bg-white/[0.05] rounded-xl py-3 px-4 group transition-all"
                                                    >
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 group-data-[hover=true]:text-zinc-200 transition-colors">
                                                                    {source.node}
                                                                </span>
                                                                <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-900/50 text-zinc-600 rounded border border-zinc-800 uppercase tracking-tighter shrink-0 group-data-[hover=true]:border-zinc-700 transition-colors">
                                                                    {source.type}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Archive size={12} className="text-zinc-600 group-data-[hover=true]:text-zinc-400 transition-colors" />
                                                                <span className="text-[10px] font-bold text-zinc-500 font-mono truncate group-data-[hover=true]:text-zinc-300 transition-colors">
                                                                    {source.artifact}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem key="none" isReadOnly className="text-[10px] font-black uppercase tracking-widest text-zinc-700 text-center py-8 italic">
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
                {(!contextRequirements || contextRequirements.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <Layers size={40} className="text-zinc-700 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">No context required</p>
                    </div>
                )}
            </div>
        </ScrollShadow>
    );
};
