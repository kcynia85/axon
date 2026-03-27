import { useFormContext, useWatch } from "react-hook-form";
import { useMemo } from "react";
import type { RouterFormData } from "../types/router-schema";
import { ALL_MODELS } from "../../agent-studio/types/agent-studio.constants";

export type RouterGraphNode = {
	id: string;
	type: "router" | "model";
	name: string;
	x: number;
	y: number;
	sequenceNumber?: number;
};

export type RouterGraphEdge = {
	id: string;
	from: string;
	to: string;
	type: "solid" | "dashed";
};

export type RouterGraphData = {
	nodes: RouterGraphNode[];
	edges: RouterGraphEdge[];
};

export const useRouterGraph = (): RouterGraphData => {
	const { control } = useFormContext<RouterFormData>();
	
	const name = useWatch({ control, name: "name" }) || "Router";
	const strategy = useWatch({ control, name: "strategy" }) || "fallback";
	const priority_chain = useWatch({ control, name: "priority_chain" }) || [];

	return useMemo(() => {
		const nodes: RouterGraphNode[] = [];
		const edges: RouterGraphEdge[] = [];

		const getModel = (id: string) => ALL_MODELS.find(m => m.id === id);

		const NODE_SPACING_X = 160;
		const NODE_SPACING_Y = 160;

		// Main Router Node
		nodes.push({
			id: "router-main",
			type: "router",
			name: name,
			x: 250,
			y: 100,
		});

		if (strategy === "fallback") {
			// Sequential layout
			priority_chain.forEach((item, index) => {
				const model = getModel(item.model_id);
				const nodeId = item.id || `model-${index}`;

				nodes.push({
					id: nodeId,
					type: "model",
					name: model?.name || "Unassigned Model",
					x: 250,
					y: 100 + (index + 1) * NODE_SPACING_Y,
					sequenceNumber: index + 1,
				});

				const prevNodeId = index === 0 ? "router-main" : (priority_chain[index-1].id || `model-${index-1}`);
				edges.push({
					id: `edge-${prevNodeId}-${nodeId}`,
					from: prevNodeId,
					to: nodeId,
					type: "solid",
				});
			});
		} else if (strategy === "load_balancer") {
			// Parallel layout
			const memberCount = priority_chain.length;

			priority_chain.forEach((item, index) => {
				const model = getModel(item.model_id);
				const nodeId = item.id || `model-${index}`;

				let x, y;
				if (memberCount === 1) {
					x = 250;
					y = 100 + NODE_SPACING_Y;
				} else {
					// spread horizontally
					const totalWidth = (memberCount - 1) * NODE_SPACING_X;
					const startX = 250 - totalWidth / 2;
					x = startX + index * NODE_SPACING_X;
					y = 100 + NODE_SPACING_Y;
				}

				nodes.push({
					id: nodeId,
					type: "model",
					name: model?.name || "Unassigned Model",
					x,
					y,
					sequenceNumber: index + 1,
				});

				edges.push({
					id: `edge-router-${nodeId}`,
					from: "router-main",
					to: nodeId,
					type: "dashed",
				});
			});
		}

		return { nodes, edges };
	}, [name, strategy, priority_chain]);
};
