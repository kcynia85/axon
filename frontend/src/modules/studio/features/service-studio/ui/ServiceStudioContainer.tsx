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

export const ServiceStudioContainer = ({ workspaceId, serviceId }: Props) => {
	const router = useRouter();
	const { data: service, isLoading, isError } = useService(workspaceId, serviceId as string);
	const { mutateAsync: createService } = useCreateService(workspaceId);
	const { mutateAsync: updateService } = useUpdateService(workspaceId);

	const initialData = useMemo(() => {
		if (!serviceId || !service) return undefined;
		return {
			service_name: service.service_name || "",
			service_description: service.service_description || "",
			service_url: service.service_url || "",
			service_auth_type: (service.service_auth_type as any) || "none",
			service_capabilities: service.service_capabilities?.map(cap => ({
				name: cap.name,
				description: cap.description,
				method: cap.method as any,
				path: cap.path,
			})) || [],
			availability_workspace: service.availability_workspace || [workspaceId],
		} as Partial<ServiceStudioFormData>;
	}, [serviceId, service, workspaceId]);

	const handleSave = async (data: ServiceStudioFormData) => {
		try {
			const apiData = {
				service_name: data.service_name,
				service_description: data.service_description,
				service_url: data.service_url,
				service_auth_type: data.service_auth_type,
				service_capabilities: data.service_capabilities,
				availability_workspace: data.availability_workspace,
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
