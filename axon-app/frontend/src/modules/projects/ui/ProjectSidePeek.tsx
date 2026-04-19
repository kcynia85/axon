"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Trash2, Link as LinkIcon, Globe, ExternalLink, Component, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Project } from "../domain";
import { mapProjectToViewModel, mapArtifactToViewModel } from "./mappers/ProjectViewModelMapper";
import { useSpaces } from "@/modules/spaces/application/hooks";
import { useProjectArtifactsQuery } from "../application/hooks";

// Consistent set from Simple Icons for all brands
import { SiFigma, SiNotion, SiGoogledrive } from "react-icons/si";

type ProjectSidePeekProps = {
  readonly project: Project | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfigure: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

const getLinkProvider = (url: string) => {
    // Shared monochromatic color class with reduced opacity
    const monoColor = "text-zinc-500 dark:text-zinc-400 opacity-40";
    
    if (!url) return { icon: LinkIcon, color: "text-zinc-400 opacity-40" };
    
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("notion.so")) {
        return { icon: SiNotion, color: monoColor };
    }
    if (lowerUrl.includes("figma.com")) {
        return { icon: SiFigma, color: monoColor };
    }
    if (lowerUrl.includes("drive.google.com") || lowerUrl.includes("docs.google.com")) {
        return { icon: SiGoogledrive, color: monoColor };
    }
    
    return { icon: Globe, color: monoColor };
};

export const ProjectSidePeek = ({
  project,
  isOpen,
  onClose,
  onConfigure,
  onDelete
}: ProjectSidePeekProps) => {
  const { data: allSpaces = [] } = useSpaces();
  const router = useRouter();
  
  // Use aggregated artifacts query (Canvas + DB)
  const { data: artifacts = [], isLoading: isLoadingArtifacts } = useProjectArtifactsQuery(project?.id || null);

  if (!project) return null;

  const viewModel = mapProjectToViewModel(project);

  // Aggregated unique links from both strategy URL and key resources table
  const allLinks = Array.from(new Set([
      ...(project.project_strategy_url ? [project.project_strategy_url] : []),
      ...(project.key_resources || []).map(res => typeof res === 'string' ? res : res.resource_url)
  ])).filter(url => !!url);

  const artifactViewModels = artifacts.map(mapArtifactToViewModel);

  const handleArtifactClick = (spaceId?: string, nodeId?: string) => {
    if (spaceId) {
        const url = new URL(`${window.location.origin}/spaces/${spaceId}`);
        if (nodeId) {
            url.searchParams.set("focus_node", nodeId);
            url.searchParams.set("inspector_tab", "artefacts");
        }
        router.push(url.pathname + url.search);
        onClose(); // Close peek after navigation
    }
  };

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={viewModel.title}
      description={
        <div className="flex flex-col gap-2 mt-1">
            <Badge 
            variant={viewModel.statusVariant} 
            className="w-fit text-[14px] font-bold uppercase tracking-wider border-none h-5 px-2"
            >
            {viewModel.statusLabel}
            </Badge>
        </div>
      }
      modal={false}
      footer={
        <div className="flex w-full justify-between items-center">
          <Button
            variant="ghost"
            size="icon-lg"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 font-bold"
            size="lg"
            onClick={() => onConfigure(project.id)}
          >
            Edytuj projekt
          </Button>
        </div>
      }
    >
      <div className="space-y-12">
        {/* ── Description ── */}
        {project.project_summary && (
            <div className="bg-muted/50 p-4 rounded-xl">
              <p className="text-base leading-relaxed text-foreground/80 font-normal">
                {project.project_summary}
              </p>
            </div>
        )}

        {/* ── Keywords ── */}
        {project.project_keywords && project.project_keywords.length > 0 && (
            <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
                {project.project_keywords.map((kw, i) => (
                <Badge key={i} variant="secondary" className="text-base font-normal">
                    {kw}
                </Badge>
                ))}
            </div>
            </section>
        )}

        {/* ── Key Resources ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
            Key Resources
          </h4>
          <div className="space-y-1.5">
            {allLinks.length > 0 ? (
              allLinks.map((url, index) => {
                const provider = getLinkProvider(url);
                const ProviderIcon = provider.icon;
                return (
                  <a 
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <ProviderIcon className={`w-4 h-4 ${provider.color}`} />
                      <span className="text-base font-mono font-semibold truncate max-w-[200px]">{url}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  </a>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground italic px-1">No resources defined.</div>
            )}
          </div>
        </section>

        {/* ── Spaces ── */}
        <section className="space-y-4">
          <h4 className="text-base font-bold text-muted-foreground">
            Spaces
          </h4>
          <div className="space-y-1.5">
            {project.space_ids && project.space_ids.length > 0 ? (
              project.space_ids.map((spaceId) => {
                const space = allSpaces.find(s => s.id === spaceId);
                return (
                  <a 
                    key={spaceId} 
                    href={`/spaces/${spaceId}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5 hover:border-primary/20 transition-all group"
                  >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-mono font-semibold truncate max-w-[200px]">
                            {space?.name || spaceId}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  </a>
                );
              })
            ) : (
                <div className="text-sm text-muted-foreground italic px-1">No spaces linked.</div>
            )}
          </div>
        </section>

        {/* ── Artefacts ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-muted-foreground">
              Artefakty
            </h4>
            {isLoadingArtifacts && <div className="text-[10px] animate-pulse uppercase font-black tracking-widest text-zinc-600">Syncing...</div>}
          </div>
          <div className="space-y-1.5">
            {artifactViewModels.length > 0 ? (
              artifactViewModels.map((artifact) => {
                return (
                  <div 
                    key={artifact.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5 hover:border-primary/20 transition-all group cursor-pointer"
                    onClick={() => handleArtifactClick(artifact.spaceId, artifact.nodeId)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex flex-col min-w-0">
                            <div className="text-base font-mono font-semibold truncate group-hover:text-white transition-colors">
                                {artifact.name}
                            </div>
                            <div className="text-[12px] text-zinc-500 font-mono truncate tracking-tight">
                                {artifact.sourcePath.toLowerCase()}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                        {artifact.statusVariant === 'success' ? (
                            <span className="text-[12px] font-black uppercase tracking-widest text-emerald-500/60 group-hover:text-emerald-500 transition-colors">
                                {artifact.statusLabel}
                            </span>
                        ) : (
                            <span className="text-[12px] font-black uppercase tracking-widest text-blue-400/60 group-hover:text-blue-400 transition-colors">
                                {artifact.statusLabel}
                            </span>
                        )}
                        <ExternalLink className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                );
              })
            ) : (
                <div className="text-sm text-muted-foreground italic px-1">
                    {isLoadingArtifacts ? "Loading artefacts..." : "No artefacts generated yet."}
                </div>
            )}
          </div>
        </section>
      </div>
    </SidePeek>
  );
};
