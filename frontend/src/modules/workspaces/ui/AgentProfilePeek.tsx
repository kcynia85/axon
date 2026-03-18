"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { HelpCircle, BookOpen, Edit2, Trash2, Code2, Globe, Database } from "lucide-react";
import { KNOWLEDGE_HUB_NAMES, LLM_MODEL_NAMES, getWorkspaceLabel } from "../domain/constants";
import { Agent } from "@/shared/domain/workspaces";
import { getAgentAvatarUrl } from "@/shared/lib/utils";

type AgentProfilePeekProps = {
  readonly agent: Agent | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: (id: string) => void;
}

export const AgentProfilePeek = ({ agent, isOpen, onClose, onEdit, onDelete }: AgentProfilePeekProps) => {
  if (!agent) return null;

  const rawInputFields = agent.input_schema
    ? Object.entries(agent.input_schema as Record<string, string>)
    : [];
  const inputFields = rawInputFields.length > 0 
    ? rawInputFields 
    : [["income", "number"], ["business_size", "string"]];

  const rawOutputFields = agent.output_schema
    ? Object.entries(agent.output_schema as Record<string, string>)
    : [];
  const outputFields = rawOutputFields.length > 0 
    ? rawOutputFields 
    : [["score", "number"], ["segment", "string"]];

  const skillIcons: Record<string, React.ElementType | null> = {
    "web_search": Globe,
    "code_interpreter": Code2,
    "file_browser": Database,
    "web search": Globe,
    "file browser": Database,
  };

  const avatarUrl = getAgentAvatarUrl(agent.id, agent.agent_visual_url);

  // Combine native and custom skills
  const rawSkills = [
    ...(agent.native_skills || []).map(id => ({ id, name: id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) })),
    ...(agent.custom_functions || []).map(id => ({ id, name: id, isCustom: true }))
  ];
  
  const allSkills = rawSkills.length > 0 
    ? rawSkills 
    : [
        { id: "web_search", name: "Web Search" },
        { id: "file_browser", name: "File Browser" },
        { id: "lead_scoring", name: "lead_scoring", isCustom: true },
        { id: "validate_nip_pl", name: "validate_nip_pl", isCustom: true }
      ];

  const rawAvailability = Array.from(new Set(
    (agent.availability_workspace || []).map(getWorkspaceLabel)
  )).filter(Boolean).sort();
  
  const availabilityLabels = rawAvailability.length > 0 ? rawAvailability : ["Global"];

  const keywords = (agent.agent_keywords && agent.agent_keywords.length > 0) 
    ? agent.agent_keywords 
    : ["churnbusting"];

  const knowledgeHubs = (agent.knowledge_hub_ids && agent.knowledge_hub_ids.length > 0)
    ? agent.knowledge_hub_ids.map(id => KNOWLEDGE_HUB_NAMES[id] ?? id)
    : ["Product Management Hub", "Discovery Hub"];

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={agent.agent_name || "Product Guardian"}
      description={agent.agent_role_text || "Strategic Product Advisor"}
      modal={false}
      image={
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-black">
          <Image
            src={avatarUrl}
            alt={agent.agent_name || "Agent"}
            fill
            className="object-cover object-top scale-110"
          />
        </div>
      }
      footer={
        <div className="flex w-full justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon-lg"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
            onClick={() => {
              if (agent.id && onDelete && window.confirm("Are you sure you want to delete this agent?")) {
                onDelete(agent.id);
                onClose();
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 font-bold" 
            size="lg"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4 mr-2" /> {agent.id === "draft" ? "Kontynuuj projektowanie" : "Edytuj Agenta"}
          </Button>
        </div>
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
            <div className="text-base font-bold text-muted-foreground">Cost</div>
            <div className="text-base font-bold">Medium</div>
          </div>
          <div className="space-y-2">
            <div className="text-base font-bold text-muted-foreground">Model LLM</div>
            <div className="text-base font-bold tracking-tight">
              {agent.llm_model_id ? (LLM_MODEL_NAMES[agent.llm_model_id] ?? agent.llm_model_id) : "GPT-4o"}
            </div>
          </div>
        </div>

        {/* ── Keywords ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw, i) => (
              <Badge key={i} variant="secondary" className="text-base font-normal">
                #{kw}
              </Badge>
            ))}
          </div>
        </section>

        {/* ── Context (Input Schema) ── */}
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
                  {String(type)}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* ── Artefacts (Output Schema) ── */}
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
                  {String(type)}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* ── Knowledge ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Wiedza (RAG)
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {knowledgeHubs.map((name, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-primary/5">
                <BookOpen className="w-4 h-4 text-primary/60 shrink-0" />
                <span className="text-base font-semibold">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Skills
            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
          </h4>
          <div className="space-y-1.5">
            {allSkills.map((skill) => {
              const Icon = skillIcons[skill.id.toLowerCase()];
              return (
                <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <div className="flex items-center gap-3">
                    {Icon ? <Icon className="w-4 h-4 text-primary/60 shrink-0" /> : <Code2 className="w-4 h-4 text-primary/60 shrink-0" />}
                    <span className="text-base font-medium">{skill.name}</span>
                  </div>
                  { (skill as any).isCustom && <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-bold uppercase opacity-50">Custom</Badge> }
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Availability ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">
            Dostępność
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {availabilityLabels.map((label) => (
              <Badge key={label} variant="outline" className="text-base font-normal">
                {label}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </SidePeek>
  );
};
