// frontend/src/modules/spaces/ui/inspectors/crews/shared/SpaceCrewArtefactsTab.tsx

import React from "react";
import dynamic from "next/dynamic";
import {
    ScrollShadow,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { 
    FileText, 
    ChevronRight, 
    Clock, 
    ChevronUp, 
    ChevronDown, 
    ExternalLink,
    CheckCircle,
    ArrowUpRight,
    History,
    RotateCcw,
} from "lucide-react";
import { TemplateArtefact } from "@/modules/spaces/domain/types";
import { cn } from "@/shared/lib/utils";

const ARTEFACT_STATUS_VISUAL_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
} as const;

const SpaceArtefactBlockNoteEditor = dynamic(
    () => import("../../components/SpaceArtefactBlockNoteEditor").then(module => module.SpaceArtefactBlockNoteEditor),
    { ssr: false }
);

export type SpaceCrewArtefactsTabProperties = {
    readonly isDone: boolean;
    readonly artefacts: readonly TemplateArtefact[];
    readonly progressValue: number;
    readonly isWorking: boolean;
    readonly editingArtefactId: string | null;
    readonly setEditingArtefactId: (artefactId: string | null) => void;
    readonly expandedVersionHistory: Record<string, boolean>;
    readonly toggleVersionHistory: (artefactId: string) => void;
    readonly handleRestoreVersion: (artefactId: string, versionLabel: string) => void;
    readonly handleArtefactStatusChange: (artefactId: string, status: TemplateArtefact['status']) => void;
    readonly handleArtefactOutputToggle: (artefactId: string) => void;
    readonly handleArtefactContentChange: (artefactId: string, content: string) => void;
};

export const SpaceCrewArtefactsTab = ({
    artefacts,
    progressValue,
    isWorking,
    editingArtefactId,
    setEditingArtefactId,
    expandedVersionHistory,
    toggleVersionHistory,
    handleRestoreVersion,
    handleArtefactStatusChange,
    handleArtefactOutputToggle,
    handleArtefactContentChange
}: SpaceCrewArtefactsTabProperties) => {
    return (
        <ScrollShadow className="h-[calc(100vh-220px)] p-8">
            <div className="space-y-10">
                {editingArtefactId ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between">
                            <div 
                                className="flex items-center gap-3 cursor-pointer group" 
                                onClick={() => setEditingArtefactId(null)}
                            >
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="light" 
                                    className="text-zinc-500 group-hover:text-white transition-colors"
                                    onPress={() => setEditingArtefactId(null)}
                                >
                                    <ChevronRight className="rotate-180" size={18} />
                                </Button>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                                    {artefacts.find(artefact => artefact.id === editingArtefactId)?.label}
                                </h4>
                            </div>
                        </div>

                        <SpaceArtefactBlockNoteEditor 
                            initialContent={artefacts.find(artefact => artefact.id === editingArtefactId)?.content}
                            onChange={(content) => handleArtefactContentChange(editingArtefactId, content)}
                        />
                    </div>
                ) : (
                    artefacts.map((artefactItem) => (
                        <div key={artefactItem.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setEditingArtefactId(artefactItem.id)}>
                                    <h4 className="text-xs font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">{artefactItem.label}</h4>
                                    {artefactItem.isOutput && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500 border border-orange-500 text-[8px] font-black text-orange-500 uppercase tracking-widest">
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

                            <div className="flex justify-start gap-1">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            className="h-10 border-zinc-800 bg-zinc-900 text-[9px] font-black uppercase tracking-widest min-w-32 justify-between"
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
                                        onAction={(key) => handleArtefactStatusChange(artefactItem.id, key as TemplateArtefact['status'])}
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
                                        artefactItem.isOutput ? "bg-orange-500 border-orange-500 text-orange-500" : "bg-zinc-900 text-zinc-600 hover:text-zinc-400"
                                    )}
                                    onPress={() => handleArtefactOutputToggle(artefactItem.id)}
                                    title="Mark as Workflow Output"
                                >
                                    <ArrowUpRight size={14} />
                                </Button>
                            </div>

                            <div className="pt-2 border-t border-zinc-900 mt-2">
                                <button 
                                    onClick={() => toggleVersionHistory(artefactItem.id)}
                                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                                >
                                    <History size={10} />
                                    Version History
                                    {expandedVersionHistory[artefactItem.id] ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                </button>

                                {expandedVersionHistory[artefactItem.id] && (
                                    <div className="mt-3 space-y-2 pl-2 border-l border-zinc-900 animate-in fade-in slide-in-from-left-1 duration-200">
                                        {[
                                            { version: 'v2', date: 'Today, 14:20', tokens: '6,450' },
                                            { version: 'v1', date: 'Yesterday, 18:05', tokens: '5,900' }
                                        ].map((versionItem, versionIndex) => (
                                            <div 
                                                key={versionIndex} 
                                                className="flex items-center justify-between group/ver py-1.5 px-2 hover:bg-zinc-900 rounded-lg transition-all cursor-pointer"
                                                onClick={() => handleRestoreVersion(artefactItem.id, versionItem.version)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-mono text-zinc-500">{versionItem.version}</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tight">{versionItem.date}</span>
                                                        <span className="text-[8px] font-mono text-zinc-600">{versionItem.tokens} tokens</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2  group-hover/ver:0 transition-opacity">
                                                    <div className="p-1 rounded bg-zinc-800 text-blue-400 hover:text-blue-300" title="Restore this version">
                                                        <RotateCcw size={10} />
                                                    </div>
                                                    <div className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white" title="View details">
                                                        <ExternalLink size={10} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {isWorking && (
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 border-dashed ">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 animate-pulse">
                                    <FileText size={14} />
                                </div>
                                <span className="text-xs font-black text-zinc-400">new_artefact.md</span>
                            </div>
                            <span className="text-[9px] text-zinc-200 font-black animate-pulse uppercase tracking-widest">Generating... {progressValue}%</span>
                        </div>
                    </div>
                )}

                {(!isWorking && artefacts.length === 0) && (
                    <div className="text-center py-20 ">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full border-2 border-dashed border-zinc-700">
                                <FileText size={32} className="text-zinc-700" />
                            </div>
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-600">No artefacts yet</p>
                        <p className="text-[10px] text-zinc-700 mt-2 font-mono">Artefacts will appear here once the task is completed.</p>
                    </div>
                )}
            </div>
        </ScrollShadow>
    );
};
