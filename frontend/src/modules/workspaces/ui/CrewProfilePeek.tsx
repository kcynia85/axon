"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle } from "lucide-react";
import { Crew } from "@/shared/domain/workspaces";

type AgentInfo = {
  name: string;
  visualUrl?: string | null;
}

type CrewProfilePeekProps = {
  readonly crew: Crew | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: () => void;
  readonly agentsMap?: Record<string, AgentInfo>;
}

const getDeterministicImgId = (id: string, index: number): number => {
  return ((id.charCodeAt(id.length - 1) + index) % 5) + 1;
};

export const CrewProfilePeek = ({ crew, isOpen, onClose, onEdit, agentsMap = {} }: CrewProfilePeekProps) => {
  if (!crew) return null;

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={crew.crew_name || "Crew Details"}
      description={
        <Badge variant="secondary" className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none h-5 px-2">
          {crew.crew_process_type}
        </Badge>
      }
      modal={false}
      footer={
        <Button className="w-full bg-primary hover:bg-primary/90 text-base py-6" onClick={onEdit}>
          Edytuj Crew
        </Button>
      }
    >
      <div className="space-y-12">
        {/* ── Main Description ── */}
        {crew.crew_description && (
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-base leading-relaxed text-foreground/80 font-normal">
              {crew.crew_description}
            </p>
          </div>
        )}

        {/* ── Keywords ── */}
        {crew.crew_keywords && crew.crew_keywords.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {crew.crew_keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-base font-normal">
                  #{kw}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* ── Team Structure ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">Team</h4>
          <div className="space-y-1.5">
            {crew.agent_member_ids.map((id, index) => {
              const agent = agentsMap[id];
              const imgId = getDeterministicImgId(id, index);
              const avatarUrl = agent?.visualUrl || `/images/avatars/agent-${imgId}.png`;
              const agentName = agent?.name || "Specialist Agent";

              return (
                <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-primary/10 overflow-hidden bg-black relative">
                      <Image 
                        src={avatarUrl}
                        alt={agentName}
                        fill
                        className="object-cover object-top scale-110"
                      />
                    </div>
                    <span className="text-base font-semibold">{agentName}</span>
                  </div>
                  {id === crew.manager_agent_id && (
                    <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">Manager</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Context & Artefacts ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Context
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
              <span className="text-base font-mono font-semibold">research_brief</span>
              <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                pdf
              </Badge>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Artefacts
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
              <span className="text-base font-mono font-semibold">synteza_results</span>
              <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                md
              </Badge>
            </div>
          </div>
        </section>

        {/* ── Availability ── */}
        {crew.availability_workspace && crew.availability_workspace.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">
              Availability
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {crew.availability_workspace.map((wsId) => (
                <Badge key={wsId} variant="outline" className="text-base font-normal">
                  {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </SidePeek>
  );
};
