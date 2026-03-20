"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useServiceDraft } from "./useServiceDraft";
import {
	ServiceStudioSchema,
	type ServiceStudioFormData,
} from "../../types/service-schema";
import { useService, useCreateService, useUpdateService } from "@/modules/workspaces/application/useServices";
import { toast } from "sonner";

/**
 * useServiceStudio handles the full-screen service design logic.
 */
export const useServiceStudio = (serviceId?: string | null) => {
	const { workspace: workspaceId } = useParams<{ workspace: string }>();
	const router = useRouter();

	const { data: service, isLoading: isServiceLoading } = useService(workspaceId, serviceId as string);
	const { draft, saveDraft, clearDraft, isLoading: isDraftLoading } = useServiceDraft(workspaceId, serviceId);
	const { mutateAsync: createService, isPending: isCreating } = useCreateService(workspaceId);
	const { mutateAsync: updateService, isPending: isUpdating } = useUpdateService(workspaceId);

	const initialData = useMemo(() => {
		if (!serviceId || !service) return undefined;

		return {
			name: service.service_name || "",
			url: service.service_url || "",
			business_context: service.service_description || "",
			keywords: service.service_keywords || [],
			categories: [service.service_category],
			capabilities: service.capabilities?.map(c => ({
				id: c.id,
				name: c.capability_name,
				description: c.capability_description || ""
			})) || [],
			availability: service.availability_workspace || [workspaceId],
		} as Partial<ServiceStudioFormData>;
	}, [serviceId, service, workspaceId]);

	const form = useForm<ServiceStudioFormData>({
		resolver: zodResolver(ServiceStudioSchema) as any,
		values: initialData || draft || {
			name: "",
			url: "",
			business_context: "",
			keywords: [],
			categories: [],
			capabilities: [],
			availability: [workspaceId],
		},
	});

	const handleExit = useCallback(() => {
		router.push(`/workspaces/${workspaceId}/services`);
	}, [router, workspaceId]);

	const handleSubmit = async (data: ServiceStudioFormData) => {
		try {
			const apiData: any = {
				service_name: data.name,
				service_url: data.url,
				service_description: data.business_context,
				service_keywords: data.keywords,
				service_category: data.categories[0] || "Business",
				capabilities: data.capabilities.map(c => ({
					id: c.id,
					capability_name: c.name,
					capability_description: c.description
				})),
				availability_workspace: data.availability,
			};

			if (serviceId) {
				await updateService({ serviceId, service: apiData });
				toast.success("Usługa zaktualizowana pomyślnie");
			} else {
				await createService(apiData);
				toast.success("Usługa utworzona pomyślnie");
			}
			
			clearDraft();
			handleExit();
		} catch (error: any) {
			toast.error(`Wystąpił błąd: ${error.message || "Nieznany błąd"}`);
		}
	};

	const syncDraft = useCallback(() => {
		saveDraft(form.getValues());
	}, [form, saveDraft]);

	return {
		form,
		isLoading: (!!serviceId && isServiceLoading) || isDraftLoading,
		isSaving: isCreating || isUpdating,
		handleExit,
		handleSubmit,
		syncDraft,
		workspaceId,
	};
};
