"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { ProviderStudio } from "./ProviderStudio";
import { ProviderFormData } from "../types/provider-schema";

interface Props {
	providerId?: string;
	initialData?: Partial<ProviderFormData>;
}

/**
 * ProviderStudioContainer: Intelligent client container that connects
 * form view with Server Actions and navigation.
 */
export const ProviderStudioContainer = ({ 
	providerId, 
	initialData 
}: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleSave = async (data: ProviderFormData) => {
		startTransition(async () => {
			try {
				console.log("Saving provider data:", data);
				// TODO: Implement actual Server Action (createProviderAction / updateProviderAction)
				
				toast.success(providerId ? "Dostawca zaktualizowany!" : "Dostawca utworzony pomyślnie!");
				
				// Symulacja opóźnienia sieciowego dla UX
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				router.push(`/settings/llms/providers`);
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
			<ProviderStudio
				onSave={handleSave}
				onCancel={handleCancel}
				initialData={initialData}
				isSaving={isPending}
			/>
		</div>
	);
};
