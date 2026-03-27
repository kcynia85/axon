"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { RouterStudio } from "./RouterStudio";
import type { RouterFormData } from "../types/router-schema";

interface Props {
	routerId?: string;
	initialData?: Partial<RouterFormData>;
}

/**
 * RouterStudioContainer: Intelligent client container that connects
 * form view with Server Actions and navigation.
 */
export const RouterStudioContainer = ({ 
	routerId, 
	initialData 
}: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleSave = async (data: RouterFormData) => {
		startTransition(async () => {
			try {
				console.log("Saving router data:", data);
				// TODO: Implement actual Server Action (createRouterAction / updateRouterAction)
				
				toast.success(routerId ? "Router zaktualizowany!" : "Router utworzony pomyślnie!");
				
				// Symulacja opóźnienia sieciowego dla UX
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				router.push(`/settings/llms/routers`);
				router.refresh();
			} catch (error: any) {
				const errorMessage = error.message || "Wystąpił nieoczekiwany błąd";
				toast.error(`Błąd zapisu: ${errorMessage}`);
			}
		});
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<RouterStudio
				onSave={handleSave}
				onCancel={handleCancel}
				initialData={initialData}
				isSaving={isPending}
			/>
		</div>
	);
};
