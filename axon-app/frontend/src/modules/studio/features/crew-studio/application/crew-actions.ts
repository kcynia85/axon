"use server";

import { createClient } from "@/shared/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import type { CrewStudioFormData } from "../types/crew-schema";
import { getAgentAvatarUrl } from "@/shared/lib/utils";

/**
 * createCrewAction: Server Action to save a new crew.
 */
export async function createCrewAction(workspaceId: string, data: CrewStudioFormData) {
	const supabase = await createClient();
	const { data: { session } } = await supabase.auth.getSession();
	const token = session?.access_token;

	if (!token && process.env.NODE_ENV === 'production') {
		throw new Error("Unauthorized - Session not found");
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

	// Ensure the current workspace is included in availability
	const availability = new Set(data.availability_workspace || []);
	availability.add(workspaceId);

	// Map data based on the active type branch
	const apiData: any = {
		crew_name: data.crew_name,
		crew_description: data.crew_description,
		crew_process_type: data.crew_process_type,
		crew_keywords: data.crew_keywords,
		availability_workspace: Array.from(availability),
		data_interface: {
			context: data.contexts,
			artefacts: data.artefacts,
		},
		metadata: {}
	};

	if (data.crew_process_type === "Hierarchical") {
		// Ensure manager is included in the team members list
		const members = new Set(data.agent_member_ids);
		if (data.owner_agent_id) members.add(data.owner_agent_id);
		
		apiData.agent_member_ids = Array.from(members);
		apiData.manager_agent_id = data.owner_agent_id;
		apiData.metadata.synthesis_instruction = data.synthesis_instruction;
	} else if (data.crew_process_type === "Parallel") {
		apiData.agent_member_ids = data.agent_member_ids;
	} else if (data.crew_process_type === "Sequential") {
		// In Sequential, members are derived from task specialists
		apiData.agent_member_ids = Array.from(new Set(data.tasks.map(t => t.specialist_id).filter(Boolean)));
		apiData.metadata.tasks = data.tasks;
	}

	const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/crews`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`,
		},
		body: JSON.stringify(apiData),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to save crew: ${errorText}`);
	}

	revalidatePath(`/workspaces/${workspaceId}/crews`);
	return await response.json();
}

/**
 * updateCrewAction: Server Action to update an existing crew.
 */
export async function updateCrewAction(workspaceId: string, crewId: string, data: CrewStudioFormData) {
	const supabase = await createClient();
	const { data: { session } } = await supabase.auth.getSession();
	const token = session?.access_token;

	if (!token && process.env.NODE_ENV === 'production') {
		throw new Error("Unauthorized - Session not found");
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

	// Ensure the current workspace is included in availability
	const availability = new Set(data.availability_workspace || []);
	availability.add(workspaceId);

	// Map data based on the active type branch
	const apiData: any = {
		crew_name: data.crew_name,
		crew_description: data.crew_description,
		crew_process_type: data.crew_process_type,
		crew_keywords: data.crew_keywords,
		availability_workspace: Array.from(availability),
		data_interface: {
			context: data.contexts,
			artefacts: data.artefacts,
		},
		metadata: {}
	};

	if (data.crew_process_type === "Hierarchical") {
		// Ensure manager is included in the team members list
		const members = new Set(data.agent_member_ids);
		if (data.owner_agent_id) members.add(data.owner_agent_id);
		
		apiData.agent_member_ids = Array.from(members);
		apiData.manager_agent_id = data.owner_agent_id;
		apiData.metadata.synthesis_instruction = data.synthesis_instruction;
	} else if (data.crew_process_type === "Parallel") {
		apiData.agent_member_ids = data.agent_member_ids;
	} else if (data.crew_process_type === "Sequential") {
		apiData.agent_member_ids = Array.from(new Set(data.tasks.map(t => t.specialist_id).filter(Boolean)));
		apiData.metadata.tasks = data.tasks;
	}

	const response = await fetch(`${baseUrl}/workspaces/${workspaceId}/crews/${crewId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`,
		},
		body: JSON.stringify(apiData),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to update crew: ${errorText}`);
	}

	revalidatePath(`/workspaces/${workspaceId}/crews`);
	return await response.json();
}

/**
 * getAvailableAgents: Fetches the list of agents strictly from the database.
 */
export async function getAvailableAgents(workspaceId: string) {
	try {
		const supabase = await createClient();
		const { data: { session } } = await supabase.auth.getSession();
		const token = session?.access_token;

		if (!token && process.env.NODE_ENV === 'production') {
			return [];
		}

		const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
		const response = await fetch(`${baseUrl}/agents/?workspace=${workspaceId}`, {
			headers: {
				"Authorization": `Bearer ${token}`,
			},
			next: { revalidate: 60 }
		});

		if (!response.ok) throw new Error("API responded with error");
		
		const data = await response.json();
		return (data as any[]).map(agent => ({
			id: agent.id,
			name: agent.agent_role_text || agent.agent_name || "Unnamed Agent",
			subtitle: agent.agent_name || "Specialist",
			avatarUrl: getAgentAvatarUrl(agent.id, agent.agent_visual_url)
		}));
	} catch (error) {
		console.error("Fetch Agents Error:", error);
		return [];
	}
}
