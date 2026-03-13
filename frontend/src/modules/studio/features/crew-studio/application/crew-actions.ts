"use server";

import { createClient } from "@/shared/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import type { CrewStudioFormData } from "../types/crew-schema";
import { getDeterministicImgId } from "@/shared/lib/utils";
import { AGENT_REAL_NAMES } from "@/modules/workspaces/domain/constants";

/**
 * createCrewAction: Server Action to save a new crew.
 */
export async function createCrewAction(workspaceId: string, data: CrewStudioFormData) {
	const supabase = await createClient();
	const { data: { session } } = await supabase.auth.getSession();
	const token = session?.access_token;

	if (!token && process.env.NEXT_PUBLIC_USE_MOCK !== 'true') {
		throw new Error("Unauthorized - Session not found");
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

	// Map data based on the active type branch
	const apiData: any = {
		crew_name: data.crew_name,
		crew_description: data.crew_description,
		crew_process_type: data.crew_process_type,
		crew_keywords: data.crew_keywords,
		availability_workspace: data.availability_workspace,
		metadata: {
			contexts: data.contexts,
			artefacts: data.artefacts,
		}
	};

	if (data.crew_process_type === "Hierarchical") {
		apiData.agent_member_ids = data.agent_member_ids;
		apiData.metadata.owner_agent_id = data.owner_agent_id;
		apiData.metadata.synthesis_instruction = data.synthesis_instruction;
	} else if (data.crew_process_type === "Parallel") {
		apiData.agent_member_ids = data.agent_member_ids;
	} else if (data.crew_process_type === "Sequential") {
		// In Sequential, members are derived from task specialists
		apiData.agent_member_ids = Array.from(new Set(data.tasks.map(t => t.specialist_id).filter(Boolean)));
		apiData.metadata.tasks = data.tasks;
	}

	// In mock mode, just log the data
	if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
		console.log("MOCK SAVE CREW:", apiData);
		return { id: 'mock-crew-id', ...apiData };
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

	if (!token && process.env.NEXT_PUBLIC_USE_MOCK !== 'true') {
		throw new Error("Unauthorized - Session not found");
	}

	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

	// Map data based on the active type branch
	const apiData: any = {
		crew_name: data.crew_name,
		crew_description: data.crew_description,
		crew_process_type: data.crew_process_type,
		crew_keywords: data.crew_keywords,
		availability_workspace: data.availability_workspace,
		metadata: {
			contexts: data.contexts,
			artefacts: data.artefacts,
		}
	};

	if (data.crew_process_type === "Hierarchical") {
		apiData.agent_member_ids = data.agent_member_ids;
		apiData.metadata.owner_agent_id = data.owner_agent_id;
		apiData.metadata.synthesis_instruction = data.synthesis_instruction;
	} else if (data.crew_process_type === "Parallel") {
		apiData.agent_member_ids = data.agent_member_ids;
	} else if (data.crew_process_type === "Sequential") {
		apiData.agent_member_ids = Array.from(new Set(data.tasks.map(t => t.specialist_id).filter(Boolean)));
		apiData.metadata.tasks = data.tasks;
	}

	if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
		console.log("MOCK UPDATE CREW:", crewId, apiData);
		return { id: crewId, ...apiData };
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
 * getAvailableAgents: Fetches the list of agents.
 * Added support for MOCK mode to always return data to the UI.
 */
export async function getAvailableAgents(workspaceId: string) {
	try {
		const supabase = await createClient();
		const { data: { session } } = await supabase.auth.getSession();
		const token = session?.access_token;

		// MOCK FALLBACK: If mock mode or no token
		if (process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !token) {
			return [
				{ 
					id: "a-product-owner", 
					name: "Product Owner", 
					subtitle: AGENT_REAL_NAMES["a-product-owner"], 
					avatarUrl: `/images/avatars/agent-${getDeterministicImgId("a-product-owner")}.png` 
				},
				{ 
					id: "a-tech-writer", 
					name: "Technical Writer", 
					subtitle: AGENT_REAL_NAMES["a-tech-writer"], 
					avatarUrl: `/images/avatars/agent-${getDeterministicImgId("a-tech-writer")}.png` 
				},
				{ 
					id: "a-user-researcher", 
					name: "User Researcher", 
					subtitle: AGENT_REAL_NAMES["a-user-researcher"], 
					avatarUrl: `/images/avatars/agent-${getDeterministicImgId("a-user-researcher")}.png` 
				},
				{ 
					id: "a-developer", 
					name: "Full-Stack Developer", 
					subtitle: AGENT_REAL_NAMES["a-developer"], 
					avatarUrl: `/images/avatars/agent-${getDeterministicImgId("a-developer")}.png` 
				},
			];
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
			subtitle: AGENT_REAL_NAMES[agent.id] || agent.agent_name || "Agent Person",
			avatarUrl: agent.agent_visual_url || `/images/avatars/agent-${getDeterministicImgId(agent.id)}.png`
		}));
	} catch (error) {
		console.error("Fetch Agents Error:", error);
		// Return an empty list instead of throwing an error to avoid breaking the entire page
		return [];
	}
}
