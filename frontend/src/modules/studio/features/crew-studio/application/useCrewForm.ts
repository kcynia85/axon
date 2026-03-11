import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { CrewStudioFormSchema, type CrewStudioFormData } from "../types/crew-schema";

/**
 * useCrewForm: The main logical heart of Crew Studio.
 * Manages form state, validation, and derived calculations (e.g., cost).
 */
export const useCrewForm = (initialData?: Partial<CrewStudioFormData>) => {
	const form = useForm<CrewStudioFormData>({
		resolver: zodResolver(CrewStudioFormSchema),
		mode: "onChange",
		defaultValues: {
			crew_process_type: "Hierarchical",
			crew_name: "",
			crew_description: "",
			crew_keywords: [],
			contexts: [],
			artefacts: [],
			availability_workspace: [],
			agent_member_ids: [],
			cost: 0,
			...initialData,
		} as any,
	});

	const { watch, setValue } = form;

	// Subscription to fields for dynamic calculations
	const currentType = watch("crew_process_type");
	const members = watch("agent_member_ids") || [];
	const tasks = (watch as any)("tasks") || [];

	/**
	 * DERIVED STATE: Dynamic Cost Calculation
	 * Calculated on the fly without useEffect.
	 */
	const estimatedCost = useMemo(() => {
		const BASE_AGENT_RATE = 45.0; // Sample fixed rate
		
		if (currentType === "Sequential") {
			// In sequential, cost is based on number of tasks/steps
			return tasks.length * BASE_AGENT_RATE;
		}
		
		// In other modes, based on number of unique members
		return members.length * BASE_AGENT_RATE;
	}, [currentType, members.length, tasks.length]);

	/**
	 * Action to change collaboration type while maintaining data consistency.
	 * We no longer reset fields here to allow users to switch back and forth 
	 * without losing their progress (Better UX).
	 */
	const handleTypeChange = (type: CrewStudioFormData["crew_process_type"]) => {
		setValue("crew_process_type", type, { shouldValidate: true });
	};

	return {
		form,
		currentType,
		estimatedCost,
		handleTypeChange,
	};
};
