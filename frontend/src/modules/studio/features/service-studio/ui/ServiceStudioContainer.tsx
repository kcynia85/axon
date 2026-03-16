"use client";

import { useService, useCreateService, useUpdateService } from "@/modules/workspaces/application/useServices";
import { ServiceStudio } from "./ServiceStudio";
import { useRouter } from "next/navigation";
import { ServiceStudioFormData } from "../types/service-schema";
import { useMemo } from "react";
import { toast } from "sonner";

interface Props {
	workspaceId: string;
	serviceId?: string;
}

/**
 * ServiceStudioContainer: Manages data for service definition studio.
 * Standard: 0% useEffect, arrow function.
 */
export const ServiceStudioContainer = ({ workspaceId, serviceId }: Props) => {
	const router = useRouter();
	const { data: service, isLoading, isError } = useService(workspaceId, serviceId as string);
	const { mutateAsync: createService } = useCreateService(workspaceId);
	const { mutateAsync: updateService } = useUpdateService(workspaceId);

	const initialData = useMemo(() => {
		if (!serviceId || !service) return undefined;
		return {
			name: service.service_name || "",
			business_context: service.service_description || "",
			url: service.service_url || "",
			keywords: service.service_keywords || [],
			categories: [service.service_category],
			capabilities: service.capabilities?.map(cap => ({
				name: (cap as any).name || cap,
				description: (cap as any).description || "",
				method: (cap as any).method || "GET",
				path: (cap as any).path || "",
			})) || [],
			availability: service.availability_workspace || [workspaceId],
		} as Partial<ServiceStudioFormData>;
	}, [serviceId, service, workspaceId]);

	const handleSave = async (data: ServiceStudioFormData) => {
		try {
			const apiData: any = {
				service_name: data.name,
				service_description: data.business_context,
				service_url: data.url,
				service_category: data.categories[0] || "Business",
				capabilities: data.capabilities.map(cap => ({
					name: cap.name,
					description: cap.description,
					method: (cap as any).method,
					path: (cap as any).path
				})),
				availability_workspace: data.availability,
			};

			if (serviceId) {
				await updateService({ serviceId, service: apiData });
				toast.success("Service updated successfully");
			} else {
				await createService(apiData);
				toast.success("Service created successfully");
			}
			router.push(`/workspaces/${workspaceId}/services`);
		} catch (error: any) {
			toast.error(`Error: ${error.message}`);
		}
	};

	const handleCancel = () => {
		router.push(`/workspaces/${workspaceId}/services`);
	};

	if (serviceId && isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Loading...</div>;
	}

	if (serviceId && isError) {
		return <div className="flex h-screen w-full items-center justify-center text-red-500 font-mono text-sm tracking-widest uppercase">Error loading service.</div>;
	}

	return (
		<ServiceStudio 
			onSave={handleSave} 
			onCancel={handleCancel} 
			initialData={initialData}
			isEditing={!!serviceId}
		/>
	);
};
