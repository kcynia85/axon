"use client";

import { useServiceStudio } from "../application/hooks/useServiceStudio";
import { ServiceStudio } from "./ServiceStudio";

interface Props {
	workspaceId: string;
	serviceId?: string;
}

/**
 * ServiceStudioContainer: Manages data for service definition studio.
 * Standard: 0% useEffect, arrow function.
 */
export const ServiceStudioContainer = ({ workspaceId, serviceId }: Props) => {
	const {
		form,
		isLoading,
		isSaving,
		handleExit,
		handleSubmit,
		syncDraft,
	} = useServiceStudio(serviceId);

	if (serviceId && isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Loading...</div>;
	}

	return (
		<ServiceStudio 
			onSave={handleSubmit} 
			onCancel={handleExit} 
			form={form}
			isEditing={!!serviceId}
			isSaving={isSaving}
			syncDraft={syncDraft}
		/>
	);
};
