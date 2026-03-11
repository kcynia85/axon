"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle, BookOpen } from "lucide-react";
import { AGENT_REAL_NAMES, KNOWLEDGE_HUB_NAMES, LLM_MODEL_NAMES } from "../domain/constants";
import { Agent } from "@/shared/domain/workspaces";
import { getDeterministicImgId } from "@/shared/lib/utils";

// Re-importing Code2 if needed but instructions said remove icons from native skills
import { Code2 } from "lucide-react";

type AgentProfilePeekProps = {
  readonly agent: Agent | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: () => void;
}

export const AgentProfilePeek = ({ agent, isOpen, onClose, onEdit }: AgentProfilePeekProps) => {
  if (!agent) return null;

  const inputFields = agent.input_schema
    ? Object.entries(agent.input_schema as Record<string, string>)
    : [];
  const outputFields = agent.output_schema
    ? Object.entries(agent.output_schema as Record<string, string>)
    : [];

  const skillIcons: Record<string, React.ElementType | null> = {
    "Web Search": null,
    "File Browser": null,
    "lead_scoring": Code2,
    "validate_nip_pl": Code2,
  };

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={agent.agent_role_text || "AI Agent"}
      description={AGENT_REAL_NAMES[agent.id] || agent.agent_name || "Agent Person"}
      modal={false}
      image={
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-black">
          <Image
            src={agent.agent_visual_url || `/images/avatars/agent-${getDeterministicImgId(agent.id)}.png`}
            alt={agent.agent_name || "Agent"}
            fill
            className="object-cover object-top scale-110"
          />
        </div>
      }
      footer={
        <Button className="w-full bg-primary hover:bg-primary/90 text-base py-6" onClick={onEdit}>
          Edytuj Agenta
        </Button>
      }
    >
      <div className="space-y-12">
        {/* ── Main Description ── */}
        {agent.agent_goal && (
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-base leading-relaxed text-foreground/80 font-normal">
              {agent.agent_goal}
            </p>
          </div>
        )}

        {/* ── Metadata Summary ── */}
        <div className="grid grid-cols-2 gap-4 pb-10 border-b border-muted">
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground">Koszt</div>
            <div className="text-base font-bold">Medium</div>
          </div>
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground">Model</div>
            <div className="text-base font-bold tracking-tight">
              {agent.llm_model_id ? (LLM_MODEL_NAMES[agent.llm_model_id] ?? agent.llm_model_id) : "GPT-4o"}
            </div>
          </div>
        </div>

        {/* ── Keywords ── */}
        {agent.agent_keywords && agent.agent_keywords.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.agent_keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-base font-normal">
                  #{kw}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* ── Context (Input Schema) ── */}
        {inputFields.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              Context
              <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
            </h4>
            <div className="space-y-1.5">
              {inputFields.map(([name, type]) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {type}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Artefacts (Output Schema) ── */}
        {outputFields.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              Artefacts
              <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
            </h4>
            <div className="space-y-1.5">
              {outputFields.map(([name, type]) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold">{name}</span>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold">
                    {type}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Knowledge ── */}
        {agent.knowledge_hub_ids && agent.knowledge_hub_ids.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              Knowledge
              <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
            </h4>
            <div className="space-y-1.5">
              {agent.knowledge_hub_ids.map((hubId) => (
                <div key={hubId} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-primary/5">
                  <BookOpen className="w-4 h-4 text-primary/60 shrink-0" />
                  <span className="text-base font-semibold">{KNOWLEDGE_HUB_NAMES[hubId] ?? hubId}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Skills ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Skills
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {["Web Search", "File Browser", "lead_scoring", "validate_nip_pl"].map((skill) => {
              const Icon = skillIcons[skill];
              return (
                <div key={skill} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-4 h-4 text-primary/60 shrink-0" />}
                    <span className="text-base font-medium">{skill}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Availability ── */}
        {agent.availability_workspace && agent.availability_workspace.length > 0 && (
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">
              Availability
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {agent.availability_workspace.map((wsId) => (
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
