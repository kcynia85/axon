"use client";

import React from "react";
import { Divider } from "@heroui/react";
import { SpaceInspectorPanel } from "./components/SpaceInspectorPanel";
import { useSpacePatternInspector } from "../../application/hooks/useSpacePatternInspector";
import { SpacePatternInspectorProperties } from "../types";

export const SpacePatternNodeInspector = ({ data, onPropertyChange }: SpacePatternInspectorProperties) => {
    const { state } = useSpacePatternInspector(data as any);

    return (
        <SpaceInspectorPanel>
            <div className="p-8 space-y-8">
                <div className="space-y-2">
                    <h3 className="font-black text-xl text-white">{state.label}</h3>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Intelligent Pattern</p>
                </div>

                <Divider className="bg-zinc-800" />

                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-xs text-purple-300 font-medium leading-relaxed italic">
                    Use this pattern to standardize how qualitative interviews are analyzed across projects.
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pipeline Steps</label>
                    <ul className="space-y-3">
                        {state.pipelineSteps.map((step, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-300">
                                <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">{i + 1}</span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </SpaceInspectorPanel>
    );
};
