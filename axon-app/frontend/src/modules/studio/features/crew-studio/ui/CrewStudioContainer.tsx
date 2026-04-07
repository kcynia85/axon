"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, startTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/modules/workspaces/application/useWorkspaces";
import { CrewStudio } from "./CrewStudio";
import { createCrewAction, updateCrewAction } from "../application/crew-actions";
import { useCrewDraft } from "../application/useCrewDraft";
import type { CrewStudioFormData } from "../types/crew-schema";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

interface Props {
        workspaceId: string;
        crewId?: string;
        availableAgents: { id: string; name: string; subtitle?: string }[];
        initialData?: Partial<CrewStudioFormData>;
}

type ActionState = {
        success: boolean;
        error?: string;
};

/**
 * CrewStudioContainer: Intelligent client container that connects
 * form view with Server Actions and navigation.
 */
export const CrewStudioContainer = ({ 
        workspaceId, 
        crewId,
        availableAgents, 
        initialData 
}: Props) => {
        const router = useRouter();
        const queryClient = useQueryClient();

        // Draft management
        const { draft, saveDraft, clearDraft, isLoading: isDraftLoading } = useCrewDraft(workspaceId);

        const [state, formAction, isPending] = useActionState(
                async (_previousState: ActionState, formData: CrewStudioFormData): Promise<ActionState> => {
                        try {
                                if (crewId) {
                                        await updateCrewAction(workspaceId, crewId, formData);
                                        toast.success("Crew successfully updated!");
                                        queryClient.invalidateQueries({ queryKey: workspaceKeys.crews(workspaceId) });
                                } else {
                                        await createCrewAction(workspaceId, formData);
                                        toast.success("Crew successfully created!");
                                        queryClient.invalidateQueries({ queryKey: workspaceKeys.crews(workspaceId) });
                                        clearDraft();
                                }

                                router.push(`/workspaces/${workspaceId}/crews`);
                                router.refresh();

                                return { success: true };
                        } catch (error) {
                                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                                toast.error(`Save error: ${errorMessage}`);
                                return { success: false, error: errorMessage };
                        }
                },
                { success: false }
        );

        const handleSave = (data: CrewStudioFormData) => {
                startTransition(() => {
                        formAction(data);
                });
        };

        const handleCancel = () => {
                router.back();
        };

        const handleSyncDraft = (data: CrewStudioFormData) => {
                if (!crewId) {
                        saveDraft(data);
                }
        };

        // Merge initial data with draft if creating a new crew - No useMemo, let React Compiler handle it
        const mergedInitialData = crewId ? initialData : { ...draft };
	// Wait for draft to load before rendering form to ensure defaultValues are correct
	if (isDraftLoading && !crewId) {
		return (
			<div className="p-12 space-y-12 bg-black min-h-screen">
				<Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
				<Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<CrewStudio
				availableAgents={availableAgents}
				onSave={handleSave}
				onCancel={handleCancel}
				onSyncDraft={handleSyncDraft}
				initialData={mergedInitialData}
				isSaving={isPending}
			/>
		</div>
	);
};
