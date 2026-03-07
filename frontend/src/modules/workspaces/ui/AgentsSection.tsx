"use client";

import * as React from "react";
import Image from "next/image";
import { useAgentsSection } from "../application/useAgentsSection";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { CostEstimator } from "./CostEstimator";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import {
  Layout,
  Zap,
  Trash2,
  Hash,
  ArrowDownToLine,
  ArrowUpFromLine,
  BookOpen,
  Globe,
  Cpu,
  Activity,
  User,
  Bot,
} from "lucide-react";

/** Human-friendly names for mock knowledge hub IDs */
const KNOWLEDGE_HUB_NAMES: Record<string, string> = {
  "kh-product-management": "Product Management Hub",
  "kh-strategy-frameworks": "Strategy Frameworks",
  "kh-discovery-hub": "Discovery Hub",
  "kh-jtbd-library": "JTBD Library",
  "kh-design-system": "Design System Hub",
  "kh-engineering-standards": "Engineering Standards",
  "kh-architecture-patterns": "Architecture Patterns",
  "kh-brand-guidelines": "Brand Guidelines",
  "kh-seo-playbook": "SEO Playbook",
};

/** Human-friendly names for LLM models */
const LLM_MODEL_NAMES: Record<string, string> = {
  "model-gpt4o": "GPT-4o",
  "model-gpt4o-mini": "GPT-4o Mini",
  "model-claude-sonnet": "Claude 3.5 Sonnet",
};

const AGENT_REAL_NAMES: Record<string, string> = {
  "a-product-owner": "Alex Morgan",
  "a-tech-writer": "Elena Vance",
  "a-user-researcher": "Marcus Chen",
  "a-competitor-analyst": "Sarah Jenkins",
  "a-ui-designer": "Olivia Aris",
  "a-developer": "David Kessler",
  "a-qa-engineer": "Jordan Smith",
  "a-copywriter": "Mia Thorne",
};

const getDeterministicImgId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return (Math.abs(hash) % 5) + 1;
};

type AgentsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const AgentsSection = ({ workspaceId, colorName = "default" }: AgentsSectionProps) => {
  const {
    agents,
    isAgentsLoading,
    selectedAgent,
    costEstimate,
    isCostLoading,
    handleSelectAgent,
    handleClosePeek,
  } = useAgentsSection(workspaceId);

  if (isAgentsLoading) {
    return (
      <div className="flex flex-wrap gap-6">
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="aspect-[1694/2528] w-[252px] shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <Card className="border-dashed h-24 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No agents defined yet. Bring in some talent.
      </Card>
    );
  }

  const inputFields = selectedAgent?.input_schema
    ? Object.entries(selectedAgent.input_schema as Record<string, string>)
    : [];
  const outputFields = selectedAgent?.output_schema
    ? Object.entries(selectedAgent.output_schema as Record<string, string>)
    : [];

  return (
    <>
      <div className="flex flex-wrap gap-6">
        {agents.map((agent) => {
          const imgId = getDeterministicImgId(agent.id);

          return (
            <WorkspaceCard
              key={agent.id}
              variant="agent"
              title={AGENT_REAL_NAMES[agent.id] || agent.agent_name || "Agent Person"}
              description={agent.agent_goal}
              href={`/workspaces/${workspaceId}/agents/${agent.id}`}
              badgeLabel={agent.agent_role_text || "AI Agent"}
              tags={agent.agent_keywords}
              onEdit={() => handleSelectAgent(agent.id)}
              className="w-[252px] shrink-0"
              colorName={colorName}
              visualArea={
                <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-24">
                  {/* Background Soft Glow (Consistent neutral black for all workspaces) */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Optimized Agent Image using Next.js Image component */}
                  <div className="relative w-full h-full flex justify-center">
                    <Image
                      src={`/images/avatars/agent-${imgId}.png`}
                      alt={agent.agent_name}
                      fill
                      sizes="252px"
                      priority={imgId <= 2}
                      className="object-contain scale-[1.25] origin-bottom transition-all duration-500 group-hover:-translate-y-2"
                    />
                  </div>
                </div>
              }
            />
          );
        })}
      </div>

      <SidePeek
        open={!!selectedAgent}
        onOpenChange={(open) => !open && handleClosePeek()}
        title={selectedAgent?.agent_name || "Agent Details"}
        description={selectedAgent?.agent_role_text || "Specialist"}
      >
        {selectedAgent && (
          <div className="space-y-6">
            {/* ── Core Goal ── */}
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Layout className="w-3 h-3" /> Core Goal
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 bg-muted/30 p-4 rounded-lg border border-primary/5">
                {selectedAgent.agent_goal}
              </p>
            </section>

            {/* ── Keywords ── */}
            {selectedAgent.agent_keywords.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.agent_keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* ── Context (Input Schema) ── */}
            {inputFields.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <ArrowDownToLine className="w-3 h-3" /> Context
                </h4>
                <div className="space-y-1.5">
                  {inputFields.map(([name, type]) => (
                    <div key={name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-primary/5">
                      <span className="text-xs font-mono font-semibold">{name}</span>
                      <Badge variant="outline" className="text-[8px] h-4 px-1.5 py-0 uppercase font-bold tracking-tighter">
                        {type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Artefacts (Output Schema) ── */}
            {outputFields.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <ArrowUpFromLine className="w-3 h-3" /> Artefacts
                </h4>
                <div className="space-y-1.5">
                  {outputFields.map(([name, type]) => (
                    <div key={name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-primary/5">
                      <span className="text-xs font-mono font-semibold">{name}</span>
                      <Badge variant="outline" className="text-[8px] h-4 px-1.5 py-0 uppercase font-bold tracking-tighter">
                        {type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Knowledge (RAG) ── */}
            {selectedAgent.knowledge_hub_ids && selectedAgent.knowledge_hub_ids.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Knowledge (RAG)
                </h4>
                <div className="space-y-1.5">
                  {selectedAgent.knowledge_hub_ids.map((hubId) => (
                    <div key={hubId} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-primary/5">
                      <BookOpen className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-xs font-semibold">{KNOWLEDGE_HUB_NAMES[hubId] ?? hubId}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Behaviour ── */}
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Activity className="w-3 h-3" /> Behaviour
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-bold">{selectedAgent.reflexion ? "Interactive" : "Autonomous"}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-mono font-bold">{selectedAgent.temperature}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">RAG Enforcement</span>
                  <Badge variant={selectedAgent.rag_enforcement ? "default" : "outline"} className="text-[8px] h-4 px-1.5 py-0 uppercase font-bold">
                    {selectedAgent.rag_enforcement ? "On" : "Off"}
                  </Badge>
                </div>
                {selectedAgent.llm_model_id && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Model LLM</span>
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-primary" />
                      <span className="font-bold">{LLM_MODEL_NAMES[selectedAgent.llm_model_id] ?? selectedAgent.llm_model_id}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ── Availability ── */}
            {selectedAgent.availability_workspace.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Availability
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAgent.availability_workspace.map((wsId) => (
                    <Badge key={wsId} variant="outline" className="text-[10px] font-normal">
                      {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* ── Economics ── */}
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Zap className="w-3 h-3" /> Economics
              </h4>
              {isCostLoading || !costEstimate ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <CostEstimator estimate={costEstimate} />
              )}
            </section>

            {/* ── Actions ── */}
            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Edit Agent
              </Button>
              <Button variant="outline" className="flex-1">
                Open Lab
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
