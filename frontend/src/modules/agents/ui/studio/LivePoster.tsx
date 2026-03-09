"use client";

import React from "react";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import { CreateAgentFormData } from "../../domain/agent.schema";

type LivePosterProps = {
  data: Partial<CreateAgentFormData>;
};

export const LivePoster = ({ data }: LivePosterProps) => {
  return (
    <div className="sticky top-24 w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="relative group">
        {/* Glow effect based on name length or some other property for "aliveness" */}
        <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <WorkspaceCard
          title={data.agent_name || "New Agent"}
          badgeLabel={data.agent_role_text || "Define Role"}
          description={data.agent_goal}
          href="#"
          variant="agent"
          layout="grid"
          tags={data.agent_keywords}
          visualArea={
            data.agent_visual_url ? (
              <img 
                src={data.agent_visual_url} 
                alt="Agent Visual" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-zinc-800 font-display text-9xl font-black select-none">
                  {data.agent_name?.charAt(0) || "?"}
                </span>
              </div>
            )
          }
        />

        {/* Status Info below the card */}
        <div className="mt-8 space-y-4 px-2">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-40">
                <span>Model Engine</span>
                <span className="text-primary font-bold">Gemini 2.5 Pro</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-40">
                <span>Predictive Capacity</span>
                <span className="text-white font-bold">High</span>
            </div>
            <div className="h-[1px] w-full bg-zinc-800" />
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-40">
                <span>Est. Inference Cost</span>
                <span className="text-white font-bold">$0.002 / 1k tokens</span>
            </div>
        </div>
      </div>
    </div>
  );
};
