"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { RouterStudio } from "./RouterStudio";
import type { RouterFormData } from "../types/router-schema";
import { useLLMRouter, useCreateLLMRouter, useUpdateLLMRouter } from "@/modules/settings/application/useSettings";
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

	const { data: fetchedData, isLoading: isFetching } = useLLMRouter(routerId);
	const { mutateAsync: createRouter } = useCreateLLMRouter();
	const { mutateAsync: updateRouter } = useUpdateLLMRouter();

	const initialData = useMemo(() => {
		if (providedInitialData) return providedInitialData;
		if (!fetchedData) return undefined;

		// Use priority_chain if available and not empty, otherwise reconstruct from primary/fallback
		const chain = fetchedData.priority_chain && fetchedData.priority_chain.length > 0 
			? fetchedData.priority_chain 
			: [
				{ model_id: fetchedData.primary_model_id, error_timeout: 60, override_params: false },
				...(fetchedData.fallback_model_id ? [{ model_id: fetchedData.fallback_model_id, error_timeout: 30, override_params: false }] : [])
			];

		return {
			name: fetchedData.router_alias,
			strategy: (fetchedData.router_strategy.toLowerCase() === "load_balancer" ? "load_balancer" : "fallback") as any,
			priority_chain: chain as any
		};
	}, [providedInitialData, fetchedData]);

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

	if (routerId && isFetching) {
		return (
			<div className="p-12 space-y-12 bg-black min-h-screen">
				<Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
				<Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
			</div>
		);
	}

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
