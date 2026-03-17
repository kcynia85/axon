import { useFormContext, useWatch } from "react-hook-form";
import type { CrewStudioFormData } from "../types/crew-schema";
import { useMemo } from "react";

export type GraphNode = {
	id: string;
	type: "manager" | "member" | "task" | "crew";
	name: string;
	avatarUrl?: string;
	x: number;
	y: number;
	sequenceNumber?: number;
};

export type GraphEdge = {
	id: string;
	from: string; // node id
	to: string; // node id
	type: "solid" | "dashed";
};

export type GraphData = {
	nodes: GraphNode[];
	edges: GraphEdge[];
};

interface UseCrewGraphProps {
	availableAgents: { id: string; name: string; subtitle?: string; avatarUrl?: string }[];
}

/**
 * useCrewGraph: Reactive logic for calculating graph layout based on form data.
 * Viewport: 500x600 (expandable via panning)
 */
export const useCrewGraph = ({ availableAgents }: UseCrewGraphProps): GraphData => {
	const { control } = useFormContext<CrewStudioFormData>();
	
	const name = useWatch({ control, name: "crew_name" }) || "Crew";
	const type = useWatch({ control, name: "crew_process_type" });
	const members = useWatch({ control, name: "agent_member_ids" }) || [];
	const tasks = useWatch({ control, name: "tasks" }) || [];
	const ownerId = useWatch({ control, name: "owner_agent_id" });

	return useMemo(() => {
		const nodes: GraphNode[] = [];
		const edges: GraphEdge[] = [];

		const getAgent = (id: string) => availableAgents.find(a => a.id === id);

		// Dynamic spacing constant
		const NODE_SPACING = 140; 

		if (type === "Hierarchical") {
			const memberCount = members.length;
			// Calculate radius to prevent overlapping nodes on the arc
			// Circumference of semi-circle arc must fit all nodes
			const requiredRadius = (memberCount * NODE_SPACING) / Math.PI;
			const radius = Math.max(220, requiredRadius);

			// Manager at the top
			const manager = getAgent(ownerId || "");
			nodes.push({
				id: "manager",
				type: "manager",
				name: manager?.name || "Assign Manager",
				avatarUrl: manager?.avatarUrl,
				x: 250,
				y: 150,
			});

			// Members in an arc below
			members.forEach((id, index) => {
				const agent = getAgent(id);
				if (!agent) return;

				// Distribute nodes evenly along the 180-degree arc (PI radians)
				const angle = (Math.PI / (memberCount + 1)) * (index + 1) + Math.PI;
				const x = 250 + Math.cos(angle) * radius;
				const y = 150 - Math.sin(angle) * radius;

				nodes.push({
					id: `member-${id}`,
					type: "member",
					name: agent.name,
					avatarUrl: agent.avatarUrl,
					x,
					y,
				});

				edges.push({
					id: `edge-manager-${id}`,
					from: "manager",
					to: `member-${id}`,
					type: "solid",
				});
			});
		} else if (type === "Parallel") {
			const memberCount = members.length;
			// Circumference of the full circle must fit all nodes
			const requiredRadius = (memberCount * NODE_SPACING) / (2 * Math.PI);
			const radius = Math.max(200, requiredRadius);

			// Crew Center
			nodes.push({
				id: "crew-center",
				type: "crew",
				name: name,
				x: 250,
				y: 320,
			});

			// Members in a circle
			members.forEach((id, index) => {
				const agent = getAgent(id);
				if (!agent) return;

				const angle = (2 * Math.PI / memberCount) * index;
				const x = 250 + Math.cos(angle) * radius;
				const y = 320 + Math.sin(angle) * radius;

				nodes.push({
					id: `member-${id}`,
					type: "member",
					name: agent.name,
					avatarUrl: agent.avatarUrl,
					x,
					y,
				});

				edges.push({
					id: `edge-center-${id}`,
					from: "crew-center",
					to: `member-${id}`,
					type: "dashed",
				});
			});
		} else if (type === "Sequential") {
			// Tasks in a sequence - Vertical Layout with fixed safe spacing
			const spacing = 200; 
			const startY = 150;

			tasks.forEach((task, index) => {
				const agent = getAgent(task.specialist_id || "");
				const nodeId = task.id || `task-${index}`;

				nodes.push({
					id: nodeId,
					type: "task",
					name: agent?.name || "Assign Specialist",
					avatarUrl: agent?.avatarUrl,
					x: 250,
					y: startY + index * spacing,
					sequenceNumber: index + 1,
				});

				if (index > 0) {
					const prevNodeId = tasks[index-1].id || `task-${index-1}`;
					edges.push({
						id: `edge-task-${index-1}-${index}`,
						from: prevNodeId,
						to: nodeId,
						type: "solid",
					});
				}
			});
		}


		return { nodes, edges };
	}, [type, name, members, tasks, ownerId, availableAgents]);
};
