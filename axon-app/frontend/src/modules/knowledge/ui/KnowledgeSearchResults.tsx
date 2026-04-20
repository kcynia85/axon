"use client";

import React from "react";
import { KnowledgeSearchResult } from "../infrastructure/api";
import { Search, FileText, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type KnowledgeSearchResultsProps = {
    readonly results: KnowledgeSearchResult[];
    readonly isLoading: boolean;
    readonly isVisible: boolean;
};

export const KnowledgeSearchResults = ({ results, isLoading, isVisible }: KnowledgeSearchResultsProps) => {
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl"
            >
                <div className="p-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <Search size={12} />
                        Knowledge Base Results
                    </div>

                    <div className="space-y-1">
                        {isLoading ? (
                            <div className="p-4 flex flex-col gap-2">
                                <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
                            </div>
                        ) : results.length > 0 ? (
                            results.map((result) => (
                                <button
                                    key={result.id}
                                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group text-left"
                                >
                                    <div className="mt-0.5 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium line-clamp-2 leading-relaxed">
                                            {result.metadata.text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-mono text-zinc-400">
                                                Score: {(result.score * 100).toFixed(0)}%
                                            </span>
                                            {result.metadata.hub_id && (
                                                <span className="text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded uppercase font-bold">
                                                    Hub: {result.metadata.hub_id.split("-")[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="mt-1 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-sm text-zinc-500 italic text-zinc-400">No matching knowledge found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
