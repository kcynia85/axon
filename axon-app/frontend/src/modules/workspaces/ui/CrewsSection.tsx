"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCrews, useDeleteCrew } from "../application/useCrews";
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCrewDraft } from "@/modules/studio/features/crew-studio/application/useCrewDraft";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { toast } from "sonner";
import { CrewsSectionView } from "./CrewsSectionView";

type CrewsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const CrewsSection = ({ workspaceId, colorName = "default" }: CrewsSectionProps) => {
  const router = useRouter();
  const { data: crews, isLoading: isCrewsLoading } = useCrews(workspaceId);
  const { mutate: deleteCrew } = useDeleteCrew(workspaceId);
  const { data: agents } = useAgents(workspaceId);
  const { draft, clearDraft } = useCrewDraft(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  
  const [selectedCrewId, setSelectedCrewId] = React.useState<string | null>(null);
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
    
    setCrewToDeleteId(id);
  };

  const confirmDelete = () => {
    if (!crewToDeleteId) return;
    
    const crew = crews?.find(c => c.id === crewToDeleteId);
    const name = crew?.crew_name || "Crew";
    deleteWithUndo(crewToDeleteId, name, () => deleteCrew(crewToDeleteId));
    setCrewToDeleteId(null);
  };

  // Derived state - React Compiler handles optimization
  const draftCrew = draft ? {
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
  } : null;

  const activeCrew = isDraftSelected ? draftCrew : (crews?.find((crewItem) => crewItem.id === selectedCrewId) || null);

  const handleSelect = (id: string) => {
    setIsDraftSelected(false);
    setSelectedCrewId(id);
  };

  const handleEdit = (id?: string) => {
    if (!id || id === "draft") {
      router.push(`/workspaces/${workspaceId}/crews/studio`);
    } else {
      router.push(`/workspaces/${workspaceId}/crews/studio/${id}`);
    }
  };

  const handleAdd = () => {
    router.push(`/workspaces/${workspaceId}/crews/studio`);
  };

  return (
    <CrewsSectionView 
        workspaceId={workspaceId}
        crews={crews}
        isCrewsLoading={isCrewsLoading}
        agents={agents}
        activeCrew={activeCrew}
        crewToDeleteId={crewToDeleteId}
        colorName={colorName}
        onSelectCrew={handleSelect}
        onClosePeek={() => {
            setIsDraftSelected(false);
            setSelectedCrewId(null);
        }}
        onDeleteClick={handleDelete}
        onConfirmDelete={confirmDelete}
        onCancelDelete={() => setCrewToDeleteId(null)}
        onEditCrew={handleEdit}
        onAddCrew={handleAdd}
    />
  );
};
