"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useCrewsBrowser } from "../application/useCrewsBrowser";
import { Crew } from "@/shared/domain/workspaces";
import { Workflow, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useDeleteCrew } from "@/modules/workspaces/application/useCrews";
import { useCrewDraft } from "@/modules/studio/features/crew-studio/application/useCrewDraft";
import { CrewProfilePeek } from "@/modules/workspaces/ui/CrewProfilePeek";
import { useAllAgents } from "@/modules/agents/infrastructure/useAgents";
import { getAgentAvatarUrl, getDeterministicImgId } from "@/shared/lib/utils";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { toast } from "sonner";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Formed" },
];

type CrewsBrowserProps = {
  readonly initialCrews: Crew[];
  readonly colorName?: string;
}

export const CrewsBrowser = ({ initialCrews, colorName = "default" }: CrewsBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const {
    processedCrews,
    viewMode,
    setViewMode,
    selectedCrewId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  } = useCrewsBrowser(initialCrews);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilters,
    filterGroups,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    getPreviewCount,
    setPendingFilterIds,
  } = filterConfig;

  const { mutate: deleteCrew } = useDeleteCrew(workspaceId);
  const { data: agents } = useAllAgents();
  const { draft, clearDraft } = useCrewDraft(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);
  const [crewToDeleteId, setCrewToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic zespołu usunięty");
      }
      return;
    }
    
    const crew = initialCrews.find(c => c.id === id);
    const name = crew?.crew_name || "Crew";
    deleteWithUndo(id, name, () => deleteCrew(id));
  };

  const confirmDelete = () => {
    if (crewToDeleteId) {
      deleteCrew(crewToDeleteId);
      setCrewToDeleteId(null);
      toast.success("Zespół usunięty");
    }
  };

  const selectedCrew = initialCrews.find(c => c.id === selectedCrewId) || null;

  // Map agent IDs to their info for better visual representation in cards and peek
  const agentsMap = React.useMemo(() => {
    const map: Record<string, { name: string; visualUrl?: string | null }> = {};

    // Strictly use real data from API
    agents?.forEach(agent => {
      map[agent.id] = {
        name: agent.agent_role_text || agent.agent_name || "Specialist Agent",
        visualUrl: agent.agent_visual_url
      };
    });
    return map;
  }, [agents]);

  // Compatibility map for WorkspaceCardHorizontal
  const agentVisualsMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(agentsMap).forEach(([id, info]) => {
      map[id] = getAgentAvatarUrl(id, info.visualUrl);
    });
    return map;
  }, [agentsMap]);

  // Map draft to Crew structure for peek
  const draftCrew = React.useMemo(() => {
    if (!draft) return null;
    return {
      id: "draft",
      crew_name: draft.crew_name || "New Team",
      crew_description: draft.crew_description || "Work in progress...",
      crew_process_type: draft.crew_process_type || "Hierarchical",
      crew_keywords: draft.crew_keywords || [],
      agent_member_ids: draft.agent_member_ids || [],
      manager_agent_id: draft.owner_agent_id || null,
      availability_workspace: [workspaceId],
      data_interface: {
        context: draft.contexts || [],
        artefacts: draft.artefacts || []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }, [draft, workspaceId]);

  const activeCrew = isDraftSelected ? draftCrew : selectedCrew;

  const displayCrews = React.useMemo(() => {
    const limit = draft ? 3 : 4;
    return processedCrews.slice(0, limit);
  }, [processedCrews, draft]);

  return (
    <>
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search crews..."
        activeFilters={activeFilters.length > 0 && (
          <FilterBar 
            activeFilters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}
        actionBar={
          <ActionBar 
            filterGroups={filterGroups}
            activeFilters={activeFilters}
            quickFilters={[
              { label: "Procesy", groupId: 'process-types' }
            ]}
            onToggleFilter={handleToggleFilter}
            onApplyFilters={handleApplyFilters}
            onClearAllFilters={handleClearAll}
            onPendingFilterIdsChange={setPendingFilterIds}
            resultsCount={getPreviewCount(initialCrews) + (draft ? 1 : 0)}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        {displayCrews.length === 0 && !draft ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground italic">No crews found matching your criteria.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-8"}>
            {/* Render Draft if exists and matches search */}
            {draft && (!searchQuery || draft.crew_name?.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <WorkspaceCardHorizontal 
                  key="crew-draft"
                  variant="crew"
                  isDraft
                  icon={Users}
                  title={draft.crew_name || "New Team"}
                  description={draft.crew_description || "Resume assembling this crew..."}
                  href={`/workspaces/${workspaceId}/crews/studio`}
                  badgeLabel={draft.crew_process_type || "Draft Team"}
                  tags={draft.crew_keywords}
                  colorName="default"
                  agentIds={[]}
                  agentVisualsMap={{}}
                  resourceId="draft"
                  onEdit={() => {
                      setIsDraftSelected(true);
                      setIsSidebarOpen(true);
                  }}
                  onClick={() => {
                      setIsDraftSelected(true);
                      setIsSidebarOpen(true);
                  }}
                  onDelete={() => handleDelete("draft")}
                  footerContent={
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                          <Workflow className="w-3 h-3 text-zinc-500" />
                          <span>{(draft.agent_member_ids || []).length} Potential Nodes</span>
                      </div>
                  }
              />
            )}

            {displayCrews.map((crew) => (
              <WorkspaceCardHorizontal 
                  key={crew.id}
                  variant="crew"
                  title={crew.crew_name}
                  description={crew.crew_description}
                  href="#"
                  badgeLabel={crew.crew_process_type}
                  tags={crew.crew_keywords}
                  colorName={colorName}
                  agentIds={crew.agent_member_ids}
                  agentVisualsMap={agentVisualsMap}
                  resourceId={crew.id}
                  onEdit={() => {
                      setIsDraftSelected(false);
                      handleViewDetails(crew.id);
                  }}
                  onClick={() => {
                      setIsDraftSelected(false);
                      handleViewDetails(crew.id);
                  }}
                  onDelete={handleDelete}
                  footerContent={
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                          <Workflow className="w-3 h-3" />
                          <span>{crew.agent_member_ids.length} Nodes</span>
                      </div>
                  }
              />
            ))}
          </div>
        )}

        <CrewProfilePeek 
          crew={activeCrew}
          isOpen={isSidebarOpen}
          onClose={() => {
              setIsDraftSelected(false);
              setIsSidebarOpen(false);
          }}
          agentsMap={agentsMap}
          onDelete={handleDelete}
          onEdit={() => {
            if (isDraftSelected) {
              router.push(`/workspaces/${workspaceId}/crews/studio`);
            } else if (selectedCrewId) {
              router.push(`/workspaces/${workspaceId}/crews/studio/${selectedCrewId}`);
            }
          }}
        />
      </BrowserLayout>

      <DestructiveDeleteModal
        isOpen={!!crewToDeleteId}
        onClose={() => setCrewToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Crew"
        resourceName={initialCrews.find(c => c.id === crewToDeleteId)?.crew_name || "this crew"}
        affectedResources={[]}
      />
    </>
  );
};
