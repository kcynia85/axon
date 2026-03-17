"use client";

import React, { useState, useMemo } from "react";
import { 
  useWorkspace, 
  useAgents, 
  useCrews, 
  usePatterns, 
  useTemplates, 
  useServices, 
  useAutomations 
} from "@/modules/workspaces/application/useWorkspaces";
import { AgentsSection } from "@/modules/workspaces/ui/AgentsSection";
import { CrewsSection } from "@/modules/workspaces/ui/CrewsSection";
import { PatternsSection } from "@/modules/workspaces/ui/PatternsSection";
import { TemplatesSection } from "@/modules/workspaces/ui/TemplatesSection";
import { ServicesSection } from "@/modules/workspaces/ui/ServicesSection";
import { AutomationsSection } from "@/modules/workspaces/ui/AutomationsSection";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";

const SECTIONS = [
  { id: "agents", label: "Agents", href: "agents", Component: AgentsSection },
  { id: "crews", label: "Crews", href: "crews", Component: CrewsSection },
  { id: "patterns", label: "Patterns", href: "patterns", Component: PatternsSection },
  { id: "templates", label: "Templates", href: "templates", Component: TemplatesSection },
  { id: "services", label: "Services", href: "services", Component: ServicesSection },
  { id: "automations", label: "Automations", href: "automations", Component: AutomationsSection },
];

const PreviewSection = ({ 
    id, 
    label, 
    count, 
    href, 
    workspaceId,
    children 
}: { 
    id: string; 
    label: string; 
    count?: number; 
    href: string;
    workspaceId: string;
    children: React.ReactNode 
}) => (
  <section id={id} className="mb-16 animate-in fade-in slide-in-from-bottom-2 duration-500 text-left">
    <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-zinc-900 pb-2">
        <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-zinc-900 dark:text-white">
            {label} {count !== undefined && <span className="opacity-40 tabular-nums">[{count}]</span>}
        </h3>
        
        <button className="h-auto p-0 text-[16px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors outline-none">
            <Link href={`/workspaces/${workspaceId}/${href}`} className="flex items-center gap-1.5">
                View all <ChevronRight className="h-4 w-4" />
            </Link>
        </button>
    </div>
    
    <div className="relative">
        {children}
    </div>
  </section>
);

/**
 * WorkspaceOverviewPage: Entry point for a specific workspace.
 * Standard: 0% useEffect, arrow functions.
 */
const WorkspaceOverviewPage = () => {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic counts for each section
  const agents = useAgents(workspaceId);
  const crews = useCrews(workspaceId);
  const patterns = usePatterns(workspaceId);
  const templates = useTemplates(workspaceId);
  const services = useServices(workspaceId);
  const automations = useAutomations(workspaceId);

  const sectionCounts: Record<string, number | undefined> = {
    agents: agents.data?.length,
    crews: crews.data?.length,
    patterns: patterns.data?.length,
    templates: templates.data?.length,
    services: services.data?.length,
    automations: automations.data?.length,
  };

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  const filteredSections = useMemo(() => {
    if (!searchQuery) return SECTIONS;
    const query = searchQuery.toLowerCase();
    return SECTIONS.filter(section => 
      section.label.toLowerCase().includes(query) || 
      section.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  if (isLoading) {
    return (
        <PageLayout
            title="Loading..."
            breadcrumbs={[{ label: "Workspaces", href: "/workspaces" }, { label: "..." }]}
        >
            <div className="space-y-12">
                <Skeleton className="h-11 w-full rounded-xl" />
                <div className="grid gap-8">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
            </div>
        </PageLayout>
    );
  }

  if (!workspace) {
    return (
        <PageLayout title="Not Found" breadcrumbs={[]}>
            <div className="p-12 text-center text-muted-foreground">Workspace not found</div>
        </PageLayout>
    );
  }

  return (
    <PageLayout
      title={workspace.name}
      description={workspace.description || ""}
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Workspaces", href: "/workspaces" },
        { label: workspace.name }
      ]}
      showPagination={false}
    >
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={`Search within ${workspace.name}...`}
      >
        <div className="max-w-5xl pt-4">
            {filteredSections.map((section) => (
                <PreviewSection 
                    key={section.id} 
                    id={section.id} 
                    label={section.label}
                    count={sectionCounts[section.id]}
                    href={section.href}
                    workspaceId={workspaceId}
                >
                    <section.Component workspaceId={workspaceId} colorName={colorName} />
                </PreviewSection>
            ))}
            {filteredSections.length === 0 && (
                <div className="py-24 text-center">
                    <p className="text-zinc-500 font-medium italic">No sections found matching &quot;{searchQuery}&quot;</p>
                </div>
            )}
        </div>
      </BrowserLayout>
    </PageLayout>
  );
};

export default WorkspaceOverviewPage;
