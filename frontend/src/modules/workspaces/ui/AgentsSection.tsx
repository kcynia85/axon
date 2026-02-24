"use client";

import * as React from "react";
import { useAgentsSection } from "../application/useAgentsSection";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "./SidePeek";
import { CostEstimator } from "./CostEstimator";
import { Button } from "@/shared/ui/ui/Button";
import {
  Edit2,
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

interface AgentsSectionProps {
  workspaceId: string;
}

export const AgentsSection = ({ workspaceId }: AgentsSectionProps) => {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full" />)}
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className="hover:border-primary/50 transition-all cursor-pointer group relative hover:shadow-lg dark:hover:shadow-primary/5"
            onClick={() => handleSelectAgent(agent.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold">
                  {agent.agent_role_text || "Specialist"}
                </Badge>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-sm font-bold mt-2 font-display">
                {agent.agent_name || "Untitled Agent"}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-[11px] leading-relaxed">
                {agent.agent_goal || "No goal defined"}
              </CardDescription>

              <div className="flex items-center gap-1 mt-3 flex-wrap">
                {agent.agent_keywords?.slice(0, 2).map((kw, i) => (
                  <span key={i} className="text-[10px] text-muted-foreground/60 italic">#{kw}</span>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
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
