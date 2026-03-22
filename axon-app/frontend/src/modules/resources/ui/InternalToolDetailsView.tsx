"use client";

import * as React from "react";
import { InternalTool } from "@/shared/domain/resources";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";

type InternalToolDetailsViewProps = {
    readonly tool: InternalTool;
    readonly onClose?: () => void;
};

export const InternalToolDetailsView = ({ tool, onClose }: InternalToolDetailsViewProps) => {
    return (
        <div className="flex flex-col h-full font-sans">
            <div className="space-y-12 flex-1">
                {/* ── Main Description / Banner ── */}
                {tool.tool_description && (
                    <div className="bg-muted/50 p-4 rounded-xl">
                        <p className="text-base leading-relaxed text-foreground/80 font-normal">
                            {tool.tool_description}
                        </p>
                    </div>
                )}

                {/* ── Keywords ── */}
                <section className="space-y-4">
                    <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {(tool.tool_keywords || []).filter(tag => tag !== "python" && tag !== "synced").map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-base font-normal">
                                #{tag.toLowerCase()}
                            </Badge>
                        ))}
                    </div>
                </section>

                {/* ── Context (Inputs) ── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-muted-foreground">Context</h4>
                        <span className="text-[10px] text-zinc-700 font-mono italic uppercase tracking-widest font-black">*Hint</span>
                    </div>
                    
                    <div className="space-y-6">
                        {Object.entries(tool.tool_input_schema?.properties || {}).map(([key, value]: [string, any]) => (
                            <div key={key} className="space-y-1">
                                <div className="text-base font-bold text-white tracking-tight">{key}</div>
                                <div className="text-sm text-zinc-500 font-medium">
                                    {value.type === "string" ? "Text" : value.type === "number" ? "Number" : value.type || "Any"}
                                </div>
                            </div>
                        ))}
                        {(!tool.tool_input_schema?.properties || Object.keys(tool.tool_input_schema.properties).length === 0) && (
                            <div className="text-sm text-muted-foreground italic pl-1">Brak wymaganych parametrów wejściowych.</div>
                        )}
                    </div>
                </section>

                {/* ── Artefacts (Outputs) ── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-muted-foreground">Artefacts</h4>
                        <span className="text-[10px] text-zinc-700 font-mono italic uppercase tracking-widest font-black">*Hints</span>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(tool.tool_output_schema?.properties || {}).map(([key, value]: [string, any]) => (
                            <div key={key} className="space-y-1">
                                <div className="text-base font-bold text-white tracking-tight">{key}</div>
                                <div className="text-sm text-zinc-500 font-medium">
                                    {value.type === "string" ? "Text" : value.type === "number" ? "Number" : value.type || "Any"}
                                </div>
                            </div>
                        ))}
                        {(!tool.tool_output_schema?.properties || Object.keys(tool.tool_output_schema.properties).length === 0) && (
                            <div className="space-y-1">
                                <div className="text-base font-bold text-white tracking-tight">result</div>
                                <div className="text-sm text-zinc-500 font-medium">
                                    {tool.tool_output_schema?.type === "string" ? "Text" : "Any"}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* ── Footer ── */}
            {onClose && (
                <div className="mt-12 pt-8 flex items-center justify-end gap-4 border-t border-zinc-800/50">
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={onClose}
                        className="hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all"
                    >
                        Close
                    </Button>
                </div>
            )}
        </div>
    );
};
