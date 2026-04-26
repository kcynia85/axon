"use client";

import React from "react";
import { Divider, Button } from "@heroui/react";
import { X } from "lucide-react";
import { SpaceInspectorPanel } from "./components/SpaceInspectorPanel";
import { useSpacePatternInspector } from "../../application/hooks/useSpacePatternInspector";
import { SpacePatternInspectorProperties } from "../types";

export const SpacePatternNodeInspector = ({ patternData, onPropertyChange, onClose }: SpacePatternInspectorProperties) => {
    const { state } = useSpacePatternInspector(patternData as any);

    return (
        <SpaceInspectorPanel className="relative">
            {onClose && (
                <div className="absolute top-2 right-6 z-30">
                    <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm" 
                        className="text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        onPress={onClose}
                    >
                        <X size={20} strokeWidth={3} />
                    </Button>
                </div>
            )}

            <div className="p-8 space-y-8">
                <Divider className="bg-zinc-800" />

                <div className="p-4 bg-purple-500 rounded-xl border border-purple-500 text-xs text-purple-300 font-medium leading-relaxed italic">
                    Use this pattern to standardize how qualitative interviews are analyzed across projects.
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pipeline Steps</label>
                    <ul className="space-y-3">
                        {state.pipelineSteps.map((step, index) => (
                            <li key={index} className="flex items-center gap-3 text-xs font-bold text-zinc-300">
                                <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">{index + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </SpaceInspectorPanel>
    );
};
