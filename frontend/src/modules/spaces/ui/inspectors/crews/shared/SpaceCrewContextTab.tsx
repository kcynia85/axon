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
    ExternalLink
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
        <ScrollShadow className="h-[calc(100vh-220px)] p-8">
            <div className="space-y-10">
                {contextRequirements.map((context) => {
                    const compatibleOutputs = DETECTED_WORKSPACE_OUTPUTS.filter(out =>
                        (!context.expectedType ||
                        context.expectedType === 'any' ||
                        out.type === context.expectedType) &&
                        (out.node.toLowerCase().includes(nodeSearch.toLowerCase()) || 
                         out.artifact.toLowerCase().includes(nodeSearch.toLowerCase()))
                    );

                    const isMissing = !context.link && !context.sourceNodeLabel;
                    const formatLabel = context.expectedType ? `[ ${context.expectedType.toUpperCase()} ]` : '[ Text ]';

                    return (
                        <div key={context.id} className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className={cn("text-xs font-black tracking-tight", isMissing ? "text-red-500" : "text-white")}>
                                        {context.label} <span className="text-[9px] text-zinc-500 font-mono ml-1">{formatLabel}</span>
                                    </h4>
                                </div>
                                {isMissing && (
                                    <div className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                                        MISSING
                                    </div>
                                )}
                            </div>

                            {context.sourceNodeLabel ? (
                                <div className="p-3 bg-zinc-900/50 border-2 border-green-500/30 rounded-xl flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                        <Network size={14} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-[10px] font-black text-zinc-200 truncate">{context.sourceNodeLabel}</span>
                                        <span className="text-[9px] font-bold text-zinc-500 font-mono truncate">{context.sourceArtifactLabel}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="light"
                                        className="min-w-0 h-8 px-2 text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest"
                                        onPress={() => handleContextLinkChange(context.id, "")}
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
                                        onValueChange={(value) => handleContextLinkChange(context.id, value)}
                                        startContent={<LinkIcon size={12} className={cn(isMissing ? "text-red-500/50" : "text-zinc-500")} />}
                                        endContent={!isMissing && <CheckCircle2 size={14} className="text-green-500/70" />}
                                        classNames={{
                                            input: "text-[10px] font-bold text-zinc-200",
                                            inputWrapper: cn(
                                                "h-10 rounded-lg bg-zinc-900/30 transition-colors shadow-none border-2",
                                                isMissing 
                                                    ? "border-red-900/50 hover:border-red-500" 
                                                    : "border-green-500/30 hover:border-green-500"
                                            ),
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
                                                        handleLinkContextFromNode(context.id, source.node, source.artifact);
                                                    }
                                                }
                                            }}
                                            onOpenChange={(isOpen) => !isOpen && setNodeSearch("")}
                                            classNames={{
                                                base: "w-full max-w-[260px]",
                                                trigger: cn(
                                                    "h-9 font-black uppercase tracking-widest text-[10px] rounded-lg shadow-none transition-all",
                                                    isMissing 
                                                        ? "bg-red-950/10 text-red-500/70 border border-red-900/30 hover:border-red-500" 
                                                        : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                                                ),
                                                value: "text-zinc-400 font-black uppercase tracking-widest text-[10px]",
                                                popoverContent: "bg-zinc-950 border border-zinc-800 rounded-xl p-0 shadow-2xl",
                                                listbox: "p-2",
                                            }}
                                            renderValue={() => (
                                                <div className="flex items-center gap-2.5">
                                                    <Network size={14} className={isMissing ? "text-red-500/50" : "text-zinc-500"} />
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
                {(!contextRequirements || contextRequirements.length === 0) && (
                    <p className="text-xs text-zinc-600 italic text-center py-10">No context links required.</p>
                )}
            </div>
        </ScrollShadow>
    );
};
