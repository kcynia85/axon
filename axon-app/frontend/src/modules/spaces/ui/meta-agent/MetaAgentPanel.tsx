import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SquarePen, Maximize2, Minus, FileText, AlignLeft, Languages, Search, CheckCircle, Plus, SlidersHorizontal, ArrowUp, Sparkles, Check, XCircle, HelpCircle, X, File, Image as ImageIcon, Mic } from 'lucide-react';
import { MetaAgentDraftEntity, MetaAgentProposalConnection } from '../../infrastructure/metaAgentApi';
import { cn } from "@/shared/lib/utils";
import { Switch } from "@heroui/react";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuLabel 
} from "@/shared/ui/ui/DropdownMenu";
import { Tooltip } from "@/shared/ui/ui/Tooltip";
import { MagicSphere } from "@/shared/ui/complex/MagicSphere";
import { useVoiceInteraction } from '../../application/useVoiceInteraction';

interface MetaAgentPanelProps {
    isOpen: boolean;
    onClose: () => void;
    drafts: MetaAgentDraftEntity[];
    connections: MetaAgentProposalConnection[];
    reasoning: string | null;
    isProposing: boolean;
    error: Error | null;
    onPropose: (query: string) => void;
    onApproveDrafts: (drafts: MetaAgentDraftEntity[], connections: MetaAgentProposalConnection[]) => void;
    onRejectDraft: () => void;
    onNewChat: () => void;
    contextLabel: string;
    knowledgeEnabled: boolean;
    setKnowledgeEnabled: (enabled: boolean) => void;
    attachedFiles: any[];
    addFiles: (files: any[]) => void;
    removeFile: (name: string) => void;
}

const SUPPORTED_FORMATS = ".jpg,.jpeg,.png,.pdf,.md,.doc,.docx";

export const MetaAgentPanel: React.FC<MetaAgentPanelProps> = ({
    isOpen,
    onClose,
    drafts,
    connections,
    reasoning,
    isProposing,
    error,
    onPropose,
    onApproveDrafts,
    onRejectDraft,
    onNewChat,
    contextLabel,
    knowledgeEnabled,
    setKnowledgeEnabled,
    attachedFiles,
    addFiles,
    removeFile
}) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((query.trim() || attachedFiles.length > 0) && !isProposing) {
            onPropose(query);
            setQuery('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newAttachments: any[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            const promise = new Promise<any>((resolve) => {
                reader.onload = () => {
                    resolve({
                        name: file.name,
                        content_type: file.type,
                        content_base64: reader.result as string,
                        size_bytes: file.size
                    });
                };
                reader.readAsDataURL(file);
            });
            newAttachments.push(await promise);
        }

        addFiles(newAttachments);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const {
        isRecording,
        isProcessing,
        toggleRecording
    } = useVoiceInteraction((transcribedText) => {
        setQuery((prev) => prev ? `${prev} ${transcribedText}` : transcribedText);
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                        "fixed right-6 bottom-6 bg-zinc-950/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-[1000] transition-all duration-300",
                        isMaximized 
                            ? "w-[800px] h-[80vh] max-h-[800px]" 
                            : "w-[440px] h-[calc(100vh-120px)] max-h-[600px]"
                    )}
                >
                    {/* Hidden File Input */}
                    <input type="file" ref={fileInputRef} className="hidden" accept={SUPPORTED_FORMATS} multiple onChange={handleFileChange} />

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-white/5 bg-white/5">
                        <button className="flex items-center gap-1.5 text-zinc-200 hover:bg-white/10 px-2 py-1 rounded-md transition-colors text-sm font-medium">
                            New Draft Flow <ChevronDown size={14} className="text-zinc-500" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-zinc-400">
                                <button onClick={onNewChat} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" title="New Draft"><SquarePen size={16} /></button>
                                <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" title={isMaximized ? "Restore" : "Maximize"}><Maximize2 size={16} /></button>
                                <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-md transition-colors" title="Close"><Minus size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-5 flex flex-col">
                        <div className="flex flex-col mb-8">
                            <div className="w-12 h-12 flex items-center justify-center mb-4 shrink-0 relative">
                                <div className="absolute inset-0 scale-[0.35] origin-center">
                                    <MagicSphere />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-6">What kind of flow should I draft?</h2>

                            {/* Suggestions List */}
                            {!isProposing && drafts.length === 0 && (
                                <div className="flex flex-col gap-1">
                                    <SuggestionItem icon={<AlignLeft size={16} />} text="Draft a Data Analyst Agent" onClick={() => onPropose("Draft a Data Analyst Agent")} />
                                    <SuggestionItem icon={<Languages size={16} />} text="Draft a Web Research Crew" onClick={() => onPropose("Draft a Web Research Crew")} />
                                    <SuggestionItem icon={<Search size={16} />} text="Draft a Python Code Executor Tool" onClick={() => onPropose("Draft a Python Code Executor Tool")} />
                                    <SuggestionItem icon={<CheckCircle size={16} />} text="Draft a Content Writing Process" onClick={() => onPropose("Draft a Content Writing Process")} />
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    An error occurred: {error.message || "Failed to generate proposal."}
                                </div>
                            )}

                            {isProposing && (
                                <div className="mt-8 flex flex-col items-center justify-center gap-4 text-zinc-400">
                                    <Sparkles className="animate-pulse text-blue-400" size={24} />
                                    <span className="text-sm animate-pulse">Generating draft flow...</span>
                                </div>
                            )}

                            {drafts.length > 0 && !isProposing && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 flex flex-col gap-4"
                                >
                                    <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50 shadow-inner">
                                        <div className="flex items-center justify-between border-b border-zinc-700/50 pb-2 mb-3">
                                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Sparkles size={12} /> Proposed Flow ({drafts.length} entities)
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-5 max-h-[400px] overflow-y-auto pr-2">
                                            {/* Grouping by target_workspace */}
                                            {Object.entries(
                                                drafts.reduce((acc, draft) => {
                                                    const ws = draft.target_workspace || 'ws-discovery';
                                                    if (!acc[ws]) acc[ws] = [];
                                                    acc[ws].push(draft);
                                                    return acc;
                                                }, {} as Record<string, MetaAgentDraftEntity[]>)
                                            ).map(([workspaceId, wsDrafts]) => (
                                                <div key={workspaceId} className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2 px-1">
                                                        <div className={cn(
                                                            "w-1.5 h-3 rounded-full",
                                                            workspaceId === 'ws-discovery' ? "bg-purple-500" :
                                                            workspaceId === 'ws-design' ? "bg-pink-500" :
                                                            workspaceId === 'ws-delivery' ? "bg-green-500" :
                                                            workspaceId === 'ws-product' ? "bg-blue-500" : "bg-yellow-500"
                                                        )} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                            {workspaceId.replace('ws-', '')} Zone
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2 pl-3 border-l border-white/5 ml-1.5">
                                                        {wsDrafts.map((draft, idx) => (
                                                            <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                                                    {draft.entity === 'agent' ? <Search size={12} className="text-zinc-500" /> : 
                                                                     draft.entity === 'crew' ? <Languages size={12} className="text-zinc-500" /> :
                                                                     <FileText size={12} className="text-zinc-500" />}
                                                                    {draft.name}
                                                                </div>
                                                                <div className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">{draft.description}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {reasoning && (
                                            <div className="text-[11px] italic text-zinc-500 border-l-2 border-white/10 pl-3 mt-6 leading-relaxed">
                                                {reasoning}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-6 pt-3 border-t border-white/5">
                                            <button 
                                                onClick={onRejectDraft}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 text-sm font-medium py-2 rounded-lg transition-colors border border-white/5"
                                            >
                                                <XCircle size={16} /> Discard
                                            </button>
                                            <button 
                                                onClick={() => onApproveDrafts(drafts, connections)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black hover:bg-zinc-200 text-sm font-bold py-2 rounded-lg transition-colors shadow-lg shadow-white/10"
                                            >
                                                <Check size={16} /> Apply Flow
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 shrink-0 bg-transparent">
                        <div className={cn(
                            "relative flex flex-col bg-white/5 backdrop-blur-md rounded-[20px] border transition-colors shadow-sm",
                            isFocused ? "border-white" : "border-white/10",
                            isProposing && "opacity-60 pointer-events-none"
                        )}>
                            <div className="flex flex-wrap items-center gap-1.5 px-3 pt-3 pb-1">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-zinc-300 cursor-default transition-colors max-w-full">
                                    <FileText size={12} className="text-zinc-400 shrink-0" />
                                    <span className="truncate">{contextLabel}</span>
                                </div>
                                <AnimatePresence>
                                    {attachedFiles.map((file) => (
                                        <motion.div key={file.name} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                                            {file.content_type.includes('image') ? <ImageIcon size={12} /> : <File size={12} />}
                                            <span className="truncate max-w-[100px]">{file.name}</span>
                                            <button onClick={() => removeFile(file.name)} className="hover:text-white transition-colors"><X size={12} /></button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe the flow, agent, or crew..."
                                className="w-full bg-transparent resize-none text-base text-white placeholder-zinc-500 px-4 py-2 min-h-[50px] max-h-[150px] focus:outline-none focus:ring-0 leading-relaxed"
                                rows={1}
                                disabled={isProposing}
                            />

                            <div className="flex items-center justify-between px-3 pb-3 pt-1">
                                <div className="flex items-center gap-1 text-zinc-400">
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Attach context" onClick={(e) => { e.preventDefault(); triggerFileUpload(); }}><Plus size={16} /></button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors outline-none" title="Meta-Agent Settings"><SlidersHorizontal size={16} /></button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-64 bg-zinc-950/90 backdrop-blur-xl border-white/10 text-white p-3 rounded-2xl shadow-2xl z-[1100]">
                                            <DropdownMenuLabel className="px-1 pb-2 pt-0 text-zinc-400 font-bold text-[10px] uppercase tracking-wider">Agent Capabilities</DropdownMenuLabel>
                                            <div className="flex flex-col gap-3 mt-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">Knowledge</span>
                                                        <Tooltip content="RAG#1: Optional. Access to your uploaded documents and resources."><div className="text-zinc-500 cursor-help hover:text-zinc-300 transition-colors"><HelpCircle size={14} /></div></Tooltip>
                                                    </div>
                                                    <Switch isSelected={knowledgeEnabled} onValueChange={setKnowledgeEnabled} size="sm" color="default" />
                                                </div>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleRecording();
                                        }}
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 border",
                                            isRecording
                                                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                                                : "bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10 hover:text-zinc-300",
                                            isProcessing && "opacity-50 cursor-wait pointer-events-none"
                                        )}
                                        title={isRecording ? "Stop Recording" : "Voice Input"}
                                    >
                                        <Mic size={16} strokeWidth={2.5} />
                                    </button>
                                    <button onClick={() => handleSubmit()} disabled={(!query.trim() && attachedFiles.length === 0) || isProposing} className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all border", (query.trim() || attachedFiles.length > 0) ? "bg-white text-black border-white hover:scale-105 active:scale-95" : "bg-white/5 border-white/10 text-zinc-600 cursor-not-allowed")}>
                                        <ArrowUp size={16} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SuggestionItem = ({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 transition-colors text-zinc-300 hover:text-zinc-100 text-left border border-transparent hover:border-white/5">
        <div className="text-zinc-500 flex shrink-0">{icon}</div>
        <span className="text-[15px] font-medium">{text}</span>
    </button>
);
