"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { RouterStudio } from "./RouterStudio";
import type { RouterFormData } from "../types/router-schema";
import { useCreateLLMRouter, useUpdateLLMRouter } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

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
	initialData: providedInitialData 
}: Props) => {
	const routerNav = useRouter();
	const [isSaving, setIsSaving] = useState(false);

	const { mutateAsync: createRouter } = useCreateLLMRouter();
	const { mutateAsync: updateRouter } = useUpdateLLMRouter();

	const initialData = useMemo(() => {
		return providedInitialData;
	}, [providedInitialData]);

	const handleSave = async (data: RouterFormData) => {
		setIsSaving(true);
		try {
			const payload = {
				router_alias: data.name,
				router_strategy: (data.strategy === "load_balancer" ? "LOAD_BALANCER" : "FALLBACK") as any,
				priority_chain: data.priority_chain,
				// primary/fallback_model_id will be extracted by backend service for compatibility
			};

			if (routerId) {
				await updateRouter({ id: routerId, data: payload });
				toast.success("Router zaktualizowany!");
			} else {
				await createRouter(payload as any);
				toast.success("Router utworzony pomyślnie!");
			}
			
			routerNav.push(`/settings/llms/routers`);
			routerNav.refresh();
		} catch (error: any) {
			const errorMessage = error.message || "Wystąpił nieoczekiwany błąd";
			toast.error(`Błąd zapisu: ${errorMessage}`);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		routerNav.back();
	};


	return (
		<div className="min-h-screen bg-black text-white">
			<RouterStudio
				onSave={handleSave}
				onCancel={handleCancel}
				initialData={initialData}
				isSaving={isSaving}
			/>
		</div>
	);
};
