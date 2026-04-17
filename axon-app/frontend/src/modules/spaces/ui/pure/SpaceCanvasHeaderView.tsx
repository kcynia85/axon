// frontend/src/modules/spaces/ui/pure/SpaceCanvasHeaderView.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
} from "@heroui/react";
import Link from "next/link";
import { SpaceCanvasHeaderProperties } from "../types";
import { CheckCircle2, Cloud, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserNav } from "@/shared/ui/layout/UserNav";

export const SpaceCanvasHeaderView = ({ 
    activeSpaceDisplayName, 
    parentProjectDisplayName, 
    parentProjectIdentifier,
    onRenameSpace,
    isSaving
}: SpaceCanvasHeaderProperties) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(activeSpaceDisplayName);
    const [showSuccess, setShowSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTempName(activeSpaceDisplayName);
    }, [activeSpaceDisplayName]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleCommit = () => {
        if (!isEditing) return;
        setIsEditing(false);
        if (tempName && tempName !== activeSpaceDisplayName) {
            onRenameSpace?.(tempName);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleCommit();
        if (e.key === "Escape") {
            setTempName(activeSpaceDisplayName);
            setIsEditing(false);
        }
    };

    return (
        <>
            <div className="absolute top-8 left-8 z-50 pointer-events-none select-none">
                 <div className="flex flex-col gap-3 pointer-events-auto">
                     {/* Breadcrumbs */}
                     <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] ml-1">
                        <Link href="/spaces" className="hover:text-zinc-300 transition-colors">Spaces</Link>
                        <span className="text-zinc-700">/</span>
                        <span className="text-zinc-300">{activeSpaceDisplayName}</span>
                     </div>

                    <Card className="bg-black/40 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl py-3 px-8 min-w-[340px] backdrop-blur-xl">
                        <CardBody className="p-0 flex-row justify-between items-center gap-8 overflow-visible">
                            <div className="flex flex-col gap-0.5 w-full">
                                <div className="flex items-center gap-3">
                                    {isEditing ? (
                                        <input
                                            ref={inputRef}
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onBlur={handleCommit}
                                            onKeyDown={handleKeyDown}
                                            className="text-2xl font-black tracking-tight text-white bg-transparent border-none outline-none p-0 w-full focus:ring-0"
                                        />
                                    ) : (
                                        <h1 
                                            className="text-2xl font-black tracking-tight text-white cursor-text hover:text-zinc-200 transition-colors"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            {activeSpaceDisplayName}
                                        </h1>
                                    )}

                                    <AnimatePresence>
                                        {showSuccess && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.5, x: -10 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className="text-green-500 shrink-0"
                                            >
                                                <CheckCircle2 size={18} fill="currentColor" className="text-black" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                                        {parentProjectIdentifier ? (
                                            <>Linked: <Link href={`/projects/${parentProjectIdentifier}`} className="text-zinc-300 hover:text-white underline decoration-zinc-700 underline-offset-4 transition-colors normal-case">{parentProjectDisplayName}</Link></>
                                        ) : (
                                            <>Status: <span className="text-zinc-400 normal-case">Detached</span></>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                 </div>
            </div>

            <div className="absolute top-8 right-8 z-50 pointer-events-none select-none">
                <div className="flex items-center gap-6 pointer-events-auto bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl py-2 px-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-1.5">
                        <AnimatePresence mode="wait">
                            {isSaving ? (
                                <motion.div
                                    key="saving"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw size={14} className="text-zinc-500 animate-spin" />
                                    <span className="text-[14px] font-black uppercase tracking-[0.1em] text-zinc-500">Saving...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="saved"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <Cloud size={14} className="text-zinc-600" />
                                    <span className="text-[14px] font-black uppercase tracking-[0.1em] text-zinc-600">Saved</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-10 w-px bg-zinc-800/50" />

                    <UserNav hideText={true} />
                </div>
            </div>
        </>
    );
};
