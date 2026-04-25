"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Badge } from "@/shared/ui/ui/Badge";
import { cn } from "@/shared/lib/utils";
import { Mic, Radio, ArrowUp, Cpu, CheckCircle2, XCircle, RefreshCw, ChevronRight, UserCircle, AudioLines } from "lucide-react";
import { SiGooglecloud } from "react-icons/si";
import { TbBrandAzure, TbBrandAws } from "react-icons/tb";
import { useVoiceInteraction } from "@/modules/spaces/application/useVoiceInteraction";
import { MetaAgentStudioData } from "../../types/meta-agent-schema";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/Card";

const ElevenLabsIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="4" width="3" height="16" rx="1.5" />
        <rect x="14" y="4" width="3" height="16" rx="1.5" />
    </svg>
);

interface RagTestButtonProps {
    label: string;
    state: 'idle' | 'loading' | 'success' | 'error';
    onClick: () => void;
}

const RagTestButton = ({ label, state, onClick }: RagTestButtonProps) => {
    const getStatusStyles = () => {
        switch (state) {
            case 'loading': return "border-zinc-700 bg-zinc-900/50 text-zinc-400";
            case 'success': return "border-green-500/30 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
            case 'error': return "border-red-500/30 bg-red-500/10 text-red-400";
            default: return "border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/50";
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={state === 'loading'}
            className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group",
                getStatusStyles()
            )}
        >
            <span className="text-[13px] font-bold tracking-tight">{label}</span>
            <div className="flex items-center gap-2">
                {state === 'loading' && <RefreshCw size={14} className="animate-spin opacity-50" />}
                {state === 'success' && <CheckCircle2 size={16} className="animate-in zoom-in duration-300" />}
                {state === 'error' && <XCircle size={16} className="animate-in zoom-in duration-300" />}
                {state === 'idle' && (
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                         <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-300" />
                    </div>
                )}
            </div>
        </button>
    );
};

export const MetaAgentLivePoster = () => {
    const { control, setValue } = useFormContext<MetaAgentStudioData>();
    const data = useWatch({ control });
    const [query, setQuery] = React.useState("");
    
    // Test states for RAGs
    const [rag1State, setRag1State] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [rag2State, setRag2State] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleTestRag = async (ragNum: 1 | 2) => {
        const setter = ragNum === 1 ? setRag1State : setRag2State;
        setter('loading');
        await new Promise(resolve => setTimeout(resolve, 800));
        setter('success');
    };

    const getProviderIcon = (provider: string) => {
        switch (provider) {
            case "ElevenLabs": return <ElevenLabsIcon />;
            case "Inworld_AI": return <UserCircle size={12} />;
            case "Cartesia": return <AudioLines size={12} />;
            case "Google_Cloud": return <SiGooglecloud size={12} />;
            case "Microsoft_Azure": return <TbBrandAzure size={12} />;
            case "Amazon_Polly": return <TbBrandAws size={12} />;
            default: return <Mic size={12} />;
        }
    };

    const {
        isRecording,
        isProcessing,
        toggleRecording
    } = useVoiceInteraction((text) => {
        setQuery(prev => prev ? `${prev} ${text}` : text);
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setQuery("");
        }
    };

    return (
        <div className="mt-8 space-y-6 w-full max-w-sm flex flex-col items-center pb-8 animate-in fade-in slide-in-from-right-8 duration-700">
            <Card className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden transition-all">
                {/* System Awareness Section */}
                <CardHeader className="pt-8 pb-4">
                    <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                        System Awareness
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4 pb-6">
                    <div className="flex flex-col gap-3">
                        <RagTestButton 
                            label="Test RAG #1 (Knowledge)" 
                            state={rag1State} 
                            onClick={() => handleTestRag(1)} 
                        />
                        <RagTestButton 
                            label="Test RAG #2 (System)" 
                            state={rag2State} 
                            onClick={() => handleTestRag(2)} 
                        />
                    </div>
                </CardContent>

                <div className="mx-6 border-t border-zinc-100 dark:border-zinc-900" />

                {/* Voice Sandbox Section */}
                <CardHeader className="pt-8 pb-6 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                        Test Voice Provider
                    </CardTitle>
                    {isRecording && (
                        <Badge variant="outline" className="text-[8px] border-red-500/50 text-red-500 animate-pulse bg-red-500/5 px-1.5 py-0">
                            Recording
                        </Badge>
                    )}
                </CardHeader>
                
                <CardContent className="space-y-6 pb-8">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 transition-all">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Test your voice or type..."
                            className="w-full bg-transparent resize-none text-base text-white placeholder-zinc-500 px-1 py-1 focus:outline-none focus:ring-0 leading-relaxed min-h-[100px] max-h-[160px]"
                            rows={1}
                        />

                        <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="flex items-center gap-2 text-[10px] font-black tracking-tight border-zinc-800 text-zinc-400 bg-black/20 px-2.5 py-1 rounded-lg">
                                {getProviderIcon(data.voice_provider || "")}
                                {data.voice_provider || "No Provider"}
                            </Badge>

                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleRecording();
                                }}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 border",
                                    isRecording
                                        ? "bg-white text-black border-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {isProcessing ? (
                                    <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                                ) : (
                                    <Mic size={18} strokeWidth={2.5} />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-[10px] text-zinc-500 leading-relaxed text-center font-medium px-2">
                        Speak or type to verify your STT connection and response quality in real-time before saving configuration.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
