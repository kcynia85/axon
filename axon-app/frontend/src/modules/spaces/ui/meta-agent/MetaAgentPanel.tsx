import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
    SquarePen, Maximize2, Minus, Plus, SlidersHorizontal, 
    ArrowUp, Sparkles, Check, XCircle, HelpCircle, X, File, 
    Image as ImageIcon, Mic, Database, Layout, Briefcase, ExternalLink,
    Bot, Users, FileText, Pause, Play
} from 'lucide-react';
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
    contextStats?: any | null;
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
    
    // UI State from store
    query: string;
    setQuery: (q: string) => void;
    isFocused: boolean;
    setIsFocused: (f: boolean) => void;
    isMaximized: boolean;
    setIsMaximized: (m: boolean) => void;
    isPaused: boolean;
    setIsPaused: (p: boolean) => void;
    
    hasProjectContext?: boolean;
    hasNotionContext?: boolean;
    systemAwarenessEnabled?: boolean;
    activeStep: 'idle' | 'planner' | 'retriever' | 'drafter' | 'validator';
}

const SUPPORTED_FORMATS = ".jpg,.jpeg,.png,.pdf,.md,.doc,.docx";

/**
 * MetaAgentPanel (Axon Standard: Zero useEffect, Zero useMemo)
 * 
 * Pure View component driven by props and global store.
 * Logic is handled by useMetaAgent hook.
 */
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
    contextStats,
    contextLabel,
    knowledgeEnabled,
    setKnowledgeEnabled,
    attachedFiles,
    addFiles,
    removeFile,
    query,
    setQuery,
    isFocused,
    setIsFocused,
    isMaximized,
    setIsMaximized,
    isPaused,
    setIsPaused,
    hasProjectContext = false,
    hasNotionContext = false,
    systemAwarenessEnabled = true,
    activeStep
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((query.trim() || attachedFiles.length > 0) && !isProposing) {
            onPropose(query);
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
                        id: `${file.name}-${file.size}-${Date.now()}-${i}`,
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
        setQuery(query ? `${query} ${transcribedText}` : transcribedText);
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
                        "fixed right-6 bottom-6 bg-zinc-950  rounded-3xl border border-zinc-800  flex flex-col overflow-hidden z-[1000] transition-all duration-300 transform-gpu translate-z-0",
                        isMaximized 
                            ? "w-[400px] h-[80vh] max-h-[800px]" 
                            : "w-[400px] h-[calc(100vh-120px)] max-h-[600px]"
                    )}
                    style={{ 
                        willChange: "transform, opacity",
                        contain: "layout paint"
                    }}
                >
                    {/* Hidden File Input */}
                    <input type="file" ref={fileInputRef} className="hidden" accept={SUPPORTED_FORMATS} multiple onChange={handleFileChange} />

                    {/* Header Controls (Floating) */}
                    <div className="absolute top-4 right-5 z-20">
                        <div className="flex items-center gap-1 text-zinc-400">
                            <button onClick={onNewChat} className="p-1.5 hover:bg-zinc-900 rounded-md transition-colors" title="New Draft"><SquarePen size={16} /></button>
                            <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 hover:bg-zinc-900 rounded-md transition-colors" title={isMaximized ? "Restore" : "Maximize"}><Maximize2 size={16} /></button>
                            <button onClick={onClose} className="p-1.5 hover:bg-zinc-900 rounded-md transition-colors" title="Close"><Minus size={16} /></button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-5 pt-4 flex flex-col">
                        <div className="flex flex-col mb-6">
                            {!isProposing && drafts.length === 0 && (
                                <>
                                    <div className="w-12 h-12 flex items-center justify-center mb-6 shrink-0 relative">
                                        <div className="absolute inset-0 scale-[0.35] origin-center">
                                            <MagicSphere />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-4">What kind of flow should I draft?</h2>
                                </>
                            )}

                            {/* Suggestions List */}
                            {!isProposing && drafts.length === 0 && (
                                <div className="flex flex-col gap-1">
                                    <SuggestionItem icon={<Sparkles size={16} />} text="Draft a Data Analyst Agent" onClick={() => onPropose("Draft a Data Analyst Agent")} />
                                    <SuggestionItem icon={<Sparkles size={16} />} text="Draft a Web Research Crew" onClick={() => onPropose("Draft a Web Research Crew")} />
                                    <SuggestionItem icon={<Sparkles size={16} />} text="Draft a Content Writing Process" onClick={() => onPropose("Draft a Content Writing Process")} />
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-3 rounded-lg bg-red-500 border border-red-500 text-red-400 text-sm">
                                    An error occurred: {error.message || "Failed to generate proposal."}
                                </div>
                            )}

                            {isProposing && (
                                <div className="mt-12 mb-8 flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 scale-[0.6] origin-center">
                                            <MagicSphere />
                                        </div>
                                    </div>
                                    <div className="h-20 flex flex-col items-center">
                                        <AnimatePresence mode="wait">
                                            <motion.div 
                                                key={activeStep}
                                                initial={{ y: 10, opacity: 0 }} 
                                                animate={{ y: 0, opacity: 1 }} 
                                                exit={{ y: -10, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="flex flex-col items-center gap-3"
                                            >
                                                <div className="text-lg font-mono font-bold tracking-tight text-white flex items-center">
                                                    {
                                                        activeStep === 'planner' ? "Thinking through it" :
                                                        activeStep === 'retriever' ? "Gathering context" :
                                                        activeStep === 'drafter' ? "Drafting the flow" :
                                                        activeStep === 'validator' ? "Finalizing everything" :
                                                        "Processing"
                                                    }
                                                    <span className="inline-flex w-8">
                                                        <motion.span
                                                            animate={{ opacity: [0, 1, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.33, 1] }}
                                                        >.</motion.span>
                                                        <motion.span
                                                            animate={{ opacity: [0, 1, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.66, 1], delay: 0.2 }}
                                                        >.</motion.span>
                                                        <motion.span
                                                            animate={{ opacity: [0, 1, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, times: [0, 1, 1], delay: 0.4 }}
                                                        >.</motion.span>
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {drafts.length > 0 && !isProposing && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 flex flex-col gap-4"
                                >
                                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 ">
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
                                                    <div className="flex items-center gap-2 px-1 mb-3">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                            {workspaceId.replace('ws-', '')}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {wsDrafts.map((draft, idx) => (
                                                            <div key={idx} className="p-2.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-white transition-all flex gap-2.5">
                                                                <div className="shrink-0 mt-0.5">
                                                                    {draft.visual_url ? (
                                                                        <div className="w-[14px] h-[14px] rounded-sm overflow-hidden border border-zinc-800">
                                                                            <img src={draft.visual_url} alt={draft.name} className="w-full h-full object-cover" />
                                                                        </div>
                                                                    ) : (
                                                                        draft.entity === 'agent' ? <Bot size={14} className="text-zinc-500" /> : 
                                                                        draft.entity === 'crew' ? <Users size={14} className="text-zinc-500" /> :
                                                                        <FileText size={14} className="text-zinc-500" />
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                                    <div className="text-sm font-bold text-white truncate">
                                                                        {draft.name}
                                                                    </div>
                                                                    <div className="text-xs text-zinc-400 leading-relaxed">
                                                                        {draft.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {reasoning && (
                                            <div className="text-base text-white mt-6 pt-6 border-t border-zinc-800 leading-relaxed">
                                                <div className="prose prose-invert prose-zinc prose-sm max-w-none 
                                                    prose-headings:text-white prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0
                                                    prose-p:text-white prose-p:mb-3
                                                    prose-li:text-white prose-li:mb-1
                                                    prose-strong:text-white
                                                ">
                                                    <ReactMarkdown>{reasoning}</ReactMarkdown>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-zinc-800">
                                            <button 
                                                onClick={onRejectDraft}
                                                className="flex items-center justify-center gap-1.5 bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-zinc-700"
                                            >
                                                <XCircle size={16} /> Discard
                                            </button>

                                            <button 
                                                onClick={() => onApproveDrafts(drafts, connections)}
                                                className="flex items-center justify-center gap-1.5 bg-white text-black hover:bg-zinc-200 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <Check size={16} /> Apply Flow
                                            </button>
                                        </div>

                                        {contextStats?.total_tokens !== undefined && contextStats.total_tokens > 0 && (
                                            <div className="mt-4 flex justify-end">
                                                <div className="text-[12px] font-mono font-bold text-zinc-400 tracking-widest">
                                                    {contextStats.total_tokens} tk used
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className={cn(
                        "p-4 shrink-0 bg-transparent transition-all duration-300", 
                        drafts.length > 0 && !isProposing && !isFocused ? "pt-0 pb-6 " : "p-4 0"
                    )}>
                        <div className={cn(
                            "relative flex flex-col bg-zinc-900  rounded-[20px] transition-all ",
                            isProposing && ""
                        )}>
                            <AnimatePresence>
                                {(!drafts.length || isProposing || isFocused) && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0, y: 10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: 10 }}
                                        transition={{ duration: 0.3, ease: "circOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-wrap items-center gap-1.5 px-3 pt-3 pb-1">
                                            {/* Context Pills - Monochromatic Style */}
                                            <ContextPill 
                                                icon={<Layout size={10} />} 
                                                label={contextLabel}
                                                active 
                                            />
                                            {systemAwarenessEnabled && <ContextPill icon={<Database size={10} />} label="System" active />}
                                            {hasProjectContext && <ContextPill icon={<Briefcase size={10} />} label="Project" active />}
                                            {hasNotionContext && <ContextPill icon={<ExternalLink size={10} />} label="Notion" active />}
                                            
                                            <AnimatePresence mode="popLayout">
                                                {knowledgeEnabled && (
                                                    <motion.div
                                                        key="knowledge-pill"
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.8, opacity: 0 }}
                                                        layout
                                                    >
                                                        <ContextPill 
                                                            icon={<Sparkles size={10} />} 
                                                            label="Knowledge"
                                                            active 
                                                            onRemove={() => setKnowledgeEnabled(false)}
                                                        />
                                                    </motion.div>
                                                )}

                                                {attachedFiles.map((file) => (
                                                    <motion.div 
                                                        key={file.id || file.name} 
                                                        initial={{ scale: 0.8, opacity: 0 }} 
                                                        animate={{ scale: 1, opacity: 1 }} 
                                                        exit={{ scale: 0.8, opacity: 0 }}
                                                        layout
                                                    >
                                                        <ContextPill 
                                                            icon={file.content_type.includes('image') ? <ImageIcon size={10} /> : <File size={10} />}
                                                            label={file.name}
                                                            active
                                                            onRemove={() => removeFile(file.name)}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={handleKeyDown}
                                placeholder={drafts.length > 0 ? "Refine this flow..." : "Describe the flow, agent, or crew..."}
                                className={cn(
                                    "w-full bg-transparent resize-none text-base text-white placeholder-zinc-500 px-4 focus:outline-none focus:ring-0 leading-relaxed transition-all duration-300",
                                    drafts.length > 0 && !isProposing && !isFocused ? "py-3 min-h-[44px]" : "py-2 min-h-[50px] max-h-[150px]"
                                )}
                                rows={1}
                                disabled={isProposing}
                            />

                            <div className="flex items-center justify-between px-3 pb-3 pt-1">
                                <div className="flex items-center gap-1 text-zinc-400">
                                    <AnimatePresence>
                                        {(!drafts.length || isProposing || isFocused) && (
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="flex items-center gap-1"
                                            >
                                                <button 
                                                    disabled={isProposing}
                                                    className="p-1.5 hover:bg-zinc-900 rounded-lg transition-colors disabled: disabled:cursor-not-allowed" 
                                                    title="Attach context" 
                                                    onClick={(e) => { e.preventDefault(); triggerFileUpload(); }}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild disabled={isProposing}>
                                                        <button 
                                                            disabled={isProposing}
                                                            className="p-1.5 hover:bg-zinc-900 rounded-lg transition-colors outline-none disabled: disabled:cursor-not-allowed" 
                                                            title="Meta-Agent Settings"
                                                        >
                                                            <SlidersHorizontal size={16} />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-64 bg-zinc-950  border-zinc-800 text-white p-3 rounded-2xl  z-[1100]">
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex items-center gap-3">
                                    {contextStats?.total_tokens !== undefined && contextStats.total_tokens > 0 && (
                                        <div className="text-xs font-mono font-bold text-zinc-400 flex items-center gap-1">
                                            {contextStats.is_estimated && <span>~</span>}
                                            <span>{contextStats.total_tokens}</span>
                                            <span className="text-zinc-500">tk</span>
                                        </div>
                                    )}
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleRecording();
                                        }}
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 border",
                                            isRecording
                                                ? "bg-white text-black border-zinc-800" 
                                                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700",
                                            isProcessing && " cursor-wait pointer-events-none"
                                        )}
                                        title={isRecording ? "Stop Recording" : "Voice Input"}
                                    >
                                        <Mic size={16} strokeWidth={2.5} />
                                    </button>
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (isProposing) {
                                                    setIsPaused(!isPaused);
                                                } else {
                                                    handleSubmit();
                                                }
                                            }} 
                                            disabled={!isProposing && (!(query || '').trim() && attachedFiles.length === 0)} 
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center transition-all border", 
                                                (isProposing || (query || '').trim() || attachedFiles.length > 0) 
                                                    ? "bg-white text-black border-zinc-800 hover:scale-105 active:scale-95" 
                                                    : "bg-transparent border-zinc-800 text-zinc-600 cursor-not-allowed"
                                            )}
                                            title={isProposing ? (isPaused ? "Resume Generation" : "Pause Generation") : "Send Request"}
                                        >
                                            {isProposing ? (
                                                isPaused ? <Play size={16} fill="currentColor" strokeWidth={2.5} /> : <Pause size={16} fill="currentColor" strokeWidth={2.5} />
                                            ) : (
                                                <ArrowUp size={16} strokeWidth={2.5} />
                                            )}
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
    <button onClick={onClick} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-300 hover:text-zinc-100 text-left border border-transparent hover:border-zinc-800">
        <div className="text-zinc-500 flex shrink-0">{icon}</div>
        <span className="text-[15px] font-medium">{text}</span>
    </button>
);

const ContextPill = ({ icon, label, active, onRemove }: { icon: React.ReactNode, label: string, active?: boolean, onRemove?: () => void }) => (
    <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-default",
        active 
            ? (onRemove 
                ? "bg-zinc-700 text-white" 
                : "bg-zinc-800 text-zinc-300") 
            : "bg-transparent text-zinc-500"
    )}>
        <div className={cn("shrink-0", active ? "0" : "")}>{icon}</div>
        <span className="truncate max-w-[100px]">{label}</span>
        {onRemove && (
            <button 
                onClick={(e) => { e.stopPropagation(); onRemove(); }} 
                className="ml-1 -mr-1 p-0.5 hover:bg-white rounded-md transition-colors text-zinc-500 hover:text-white"
            >
                <X size={10} strokeWidth={3} />
            </button>
        )}
    </div>
);
