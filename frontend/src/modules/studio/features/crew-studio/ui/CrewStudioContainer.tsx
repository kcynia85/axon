"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, startTransition } from "react";
import { CrewStudio } from "./CrewStudio";
import { createCrewAction, updateCrewAction } from "../application/crew-actions";
import type { CrewStudioFormData } from "../types/crew-schema";

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
 * Standard: React 19 useActionState, No manual loading flags.
 */
export const CrewStudioContainer = ({ 
	workspaceId, 
	crewId,
	availableAgents, 
	initialData 
}: Props) => {
	const router = useRouter();

	const [state, formAction, isPending] = useActionState(
		async (_previousState: ActionState, formData: CrewStudioFormData): Promise<ActionState> => {
			try {
				if (crewId) {
					await updateCrewAction(workspaceId, crewId, formData);
					toast.success("Crew successfully updated!");
				} else {
					await createCrewAction(workspaceId, formData);
					toast.success("Crew successfully created!");
				}
				
				router.push(`/workspaces/${workspaceId}/crews`);
				router.refresh();
				
				return { success: true };
			} catch (error: any) {
				const errorMessage = error.message || "An unexpected error occurred";
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

	return (
		<div className="min-h-screen bg-black text-white">
			<CrewStudio
				availableAgents={availableAgents}
				onSave={handleSave}
				onCancel={handleCancel}
				initialData={initialData}
				isSaving={isPending}
			/>
		</div>
	);
};
