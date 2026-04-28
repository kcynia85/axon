"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { AutomationProviderStudio } from "./AutomationProviderStudio";
import { AutomationProviderFormData } from "../types/automation-provider-schema";
import { useCreateAutomationProvider, useUpdateAutomationProvider } from "@/modules/settings/application/useAutomationProviders";

interface Props {
	providerId?: string;
	initialData?: Partial<AutomationProviderFormData>;
}

/**
 * AutomationProviderStudioContainer: Intelligent client container that connects
 * form view with Server Actions/Mutations and navigation.
 */
export const AutomationProviderStudioContainer = ({ 
	providerId, 
	initialData 
}: Props) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const { mutateAsync: createProvider } = useCreateAutomationProvider();
	const { mutateAsync: updateProvider } = useUpdateAutomationProvider();

	const handleSave = async (data: AutomationProviderFormData) => {
		console.log("handleSave called in Container with data:", data);
		startTransition(async () => {
			try {
				const payload = {
					name: data.platform,
					platform: data.platform,
					auth_type: data.auth_type,
					base_url: data.base_url || null,
					auth_header_name: data.auth_header_name || null,
					auth_secret: data.auth_secret || null,
				};

				console.log("Sending payload to backend:", payload);

				if (providerId) {
					console.log("Updating provider:", providerId);
					await updateProvider({ id: providerId, data: payload as any });
					toast.success("Dostawca zaktualizowany!");
				} else {
					console.log("Creating new provider");
					await createProvider(payload as any);
					toast.success("Dostawca utworzony pomyślnie!");
				}
				
				console.log("Navigation to /settings/automation/providers");
				router.push(`/settings/automation/providers`);
				router.refresh();
			} catch (error: any) {
				console.error("Error in handleSave:", error);
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
			<AutomationProviderStudio
				providerId={providerId}
				onSave={handleSave}
				onCancel={handleCancel}
				initialData={initialData}
				isSaving={isPending}
			/>
		</div>
	);
};
