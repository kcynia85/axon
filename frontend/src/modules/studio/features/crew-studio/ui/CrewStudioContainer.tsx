"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CrewStudio } from "./CrewStudio";
import { createCrewAction } from "../application/crew-actions";
import type { CrewStudioFormData } from "../types/crew-schema";

interface Props {
	workspaceId: string;
	availableAgents: { id: string; name: string; subtitle?: string }[];
	initialData?: Partial<CrewStudioFormData>;
}

/**
 * CrewStudioContainer: Intelligent client container that connects
 * form view with Server Actions and navigation.
 */
export const CrewStudioContainer = ({ 
	workspaceId, 
	availableAgents, 
	initialData 
}: Props) => {
	const router = useRouter();

	const handleSave = async (data: CrewStudioFormData) => {
		const promise = createCrewAction(workspaceId, data);

		toast.promise(promise, {
			loading: "Saving new crew...",
			success: () => {
				router.push(`/workspaces/${workspaceId}/crews`);
				router.refresh(); // Refresh data on the destination page
				return "Crew successfully created!";
			},
			error: (err) => `Save error: ${err.message}`,
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
			/>
		</div>
	);
};
