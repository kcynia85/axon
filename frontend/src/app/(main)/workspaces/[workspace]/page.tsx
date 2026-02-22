"use client";

import { useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { AgentsSection } from "@/modules/workspaces/ui/AgentsSection";
import { CrewsSection } from "@/modules/workspaces/ui/CrewsSection";
import { PatternsSection } from "@/modules/workspaces/ui/PatternsSection";
import { TemplatesSection } from "@/modules/workspaces/ui/TemplatesSection";
import { ServicesSection } from "@/modules/workspaces/ui/ServicesSection";
import { AutomationsSection } from "@/modules/workspaces/ui/AutomationsSection";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Button } from "@/shared/ui/ui/Button";
import { ChevronRight, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { Input } from "@/shared/ui/ui/Input";
import Link from "next/link";

const SECTIONS = [
  { id: "patterns", label: "Patterns", count: 3, href: "patterns", Component: PatternsSection },
  { id: "crews", label: "Crews", count: 5, href: "crews", Component: CrewsSection },
  { id: "agents", label: "Agents", href: "agents", Component: AgentsSection },
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
  <section id={id} className="mb-12">
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
            {label} {count !== undefined && <span className="text-muted-foreground font-normal text-sm">[{count}]</span>}
        </h3>
    </div>
    
    <div className="mb-4">
        {children}
    </div>

    <Button variant="link" asChild className="px-0 text-primary h-auto font-medium">
        <Link href={`/workspaces/${workspaceId}/${href}`} className="flex items-center gap-1">
            All → {label} Page <ChevronRight className="h-3 w-3" />
        </Link>
    </Button>
  </section>
);

export default function WorkspaceOverviewPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  const { data: workspace, isLoading } = useWorkspace(workspaceId);

  if (isLoading) {
    return (
        <PageContainer>
            <div className="p-6 space-y-6">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-64 w-full" />
            </div>
        </PageContainer>
    );
  }

  if (!workspace) {
    return <div className="p-6">Workspace not found</div>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title={`${workspace.name} Workspace`} 
        description={workspace.description}
      />
      
      <PageContent className="max-w-5xl">
        <div className="relative mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search in workspace..." 
                className="pl-10 max-w-md h-10 bg-muted/50 border-none"
            />
        </div>

        <div className="grid gap-x-12">
            {SECTIONS.map((section) => (
                <PreviewSection 
                    key={section.id} 
                    id={section.id} 
                    label={section.label}
                    count={section.count}
                    href={section.href}
                    workspaceId={workspaceId}
                >
                    <section.Component workspaceId={workspaceId} />
                </PreviewSection>
            ))}
        </div>
      </PageContent>
    </PageContainer>
  );
}
