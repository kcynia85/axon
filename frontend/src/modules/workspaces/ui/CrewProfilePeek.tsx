"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle, FileText, Link as LinkIcon, Type } from "lucide-react";
import { Crew } from "@/shared/domain/workspaces";
import { getDeterministicImgId } from "@/shared/lib/utils";
import { getWorkspaceLabel } from "../domain/constants";

type AgentInfo = {
  name: string;
  visualUrl?: string | null;
}

type CrewProfilePeekProps = {
  readonly crew: Crew | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: (id: string) => void;
  readonly agentsMap?: Record<string, AgentInfo>;
}

const FieldTypeIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'file':
    case 'pdf':
    case 'md':
      return <FileText className="w-4 h-4 text-muted-foreground/70" />;
    case 'link':
    case 'url':
      return <LinkIcon className="w-4 h-4 text-muted-foreground/70" />;
    default:
      return <Type className="w-4 h-4 text-muted-foreground/70" />;
  }
};

export const CrewProfilePeek = ({ crew, isOpen, onClose, onEdit, onDelete, agentsMap = {} }: CrewProfilePeekProps) => {
  if (!crew) return null;

  // Compatibility logic for Context & Artefacts
  const contexts = crew.data_interface?.context || (crew.metadata as any)?.contexts || [];
  const artefacts = crew.data_interface?.artefacts || (crew.metadata as any)?.artefacts || [];

  // Deduplicate and sort workspace labels
  const availabilityLabels = Array.from(new Set(
    (crew.availability_workspace || []).map(getWorkspaceLabel)
  )).sort();

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
        <div className="flex w-full gap-3">
          <Button 
            variant="outline" 
            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 h-14 font-bold uppercase tracking-widest text-[11px]" 
            onClick={() => {
              if (crew.id && onDelete && window.confirm("Are you sure you want to delete this crew?")) {
                onDelete(crew.id);
                onClose();
              }
            }}
          >
            Usuń Crew
          </Button>
          <Button className="flex-[2] bg-primary hover:bg-primary/90 text-base py-6 h-14" onClick={onEdit}>
            Edytuj Crew
          </Button>
        </div>
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
            {crew.agent_member_ids && crew.agent_member_ids.length > 0 ? (
              crew.agent_member_ids
                .filter(id => !!agentsMap[id]) // Only show agents we have data for
                .map((id) => {
                  const agent = agentsMap[id];
                  const imgId = getDeterministicImgId(id);
                  const avatarUrl = agent?.visualUrl || `/images/avatars/agent-${imgId}.webp`;
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
                        <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold text-primary border-primary/20 bg-primary/5">Manager</Badge>
                      )}
                    </div>
                  );
                })
            ) : (
              <div className="flex items-center p-3 rounded-lg bg-muted/30 border border-primary/5 text-sm text-muted-foreground italic">
                No team members assigned to this crew.
              </div>
            )}
            
            {/* Fallback if all members were filtered out but list wasn't empty */}
            {crew.agent_member_ids && crew.agent_member_ids.length > 0 && 
             crew.agent_member_ids.filter(id => !!agentsMap[id]).length === 0 && (
              <div className="text-sm text-muted-foreground italic px-1">
                No matching agents found in this workspace.
              </div>
            )}
          </div>
        </section>

        {/* ── Context & Artefacts ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Context
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {contexts.length > 0 ? (
              contexts.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <div className="flex items-center gap-2">
                    <FieldTypeIcon type={item.field_type} />
                    <span className="text-base font-mono font-semibold">{item.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {item.field_type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic px-1">No context items defined.</div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Artefacts
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {artefacts.length > 0 ? (
              artefacts.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <div className="flex items-center gap-2">
                    <FieldTypeIcon type={item.field_type} />
                    <span className="text-base font-mono font-semibold">{item.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {item.field_type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic px-1">No artefacts defined.</div>
            )}
          </div>
        </section>

        {/* ── Availability ── */}
        {availabilityLabels.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">
              Availability
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {availabilityLabels.map((label) => (
                <Badge key={label} variant="outline" className="text-base font-normal">
                  {label}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </div>
    </SidePeek>
  );
};
