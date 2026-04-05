import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
import { CrewStudioFormSchema, type CrewStudioFormData } from "../types/crew-schema";

/**
 * useCrewForm: The main logical heart of Crew Studio.
 * Manages form state, validation, and derived calculations (e.g., cost).
 */
export const useCrewForm = (
	initialData?: Partial<CrewStudioFormData>,
	onSyncDraft?: (data: CrewStudioFormData) => void
) => {
	const getEffectiveData = () => {
		if (!initialData) return undefined;
		return {
			crew_process_type: initialData.crew_process_type || "Hierarchical",
			crew_name: initialData.crew_name || "",
			crew_description: initialData.crew_description || "",
			crew_keywords: initialData.crew_keywords || [],
			contexts: initialData.contexts || [],
			artefacts: initialData.artefacts || [],
			availability_workspace: initialData.availability_workspace || [],
			agent_member_ids: initialData.agent_member_ids || [],
			owner_agent_id: initialData.owner_agent_id || "",
			tasks: initialData.tasks || [{ description: "", specialist_id: "" }],
			cost: initialData.cost || 0,
		} as CrewStudioFormData;
	};

	const effectiveData = getEffectiveData();

	const form = useForm<CrewStudioFormData>({
		resolver: zodResolver(CrewStudioFormSchema) as unknown as Resolver<CrewStudioFormData>,
		mode: "onChange",
		values: effectiveData || {
			crew_process_type: "Hierarchical",
			crew_name: "",
			crew_description: "",
			crew_keywords: [],
			contexts: [],
			artefacts: [],
			availability_workspace: [],
			agent_member_ids: [],
			owner_agent_id: "",
			tasks: [{ description: "", specialist_id: "" }],
			cost: 0,
		} as any,
	});

	const { watch, setValue, getValues } = form;

	// Subscription to fields for dynamic calculations
	const formValues = watch();
	const currentType = formValues.crew_process_type;
	const members = formValues.agent_member_ids || [];
	const tasks = (formValues as any).tasks || [];

	/**
	 * Manual trigger for UI persistence
	 */
	const syncDraft = () => {
		if (onSyncDraft) {
			onSyncDraft(getValues());
		}
	};

	/**
	 * DERIVED STATE: Dynamic Cost Calculation
	 */
	const calculateEstimatedCost = () => {
		const BASE_AGENT_RATE = 45.0; // Sample fixed rate
		
		if (currentType === "Sequential") {
			return tasks.length * BASE_AGENT_RATE;
		}
		
		return members.length * BASE_AGENT_RATE;
	};

	const estimatedCost = calculateEstimatedCost();

	/**
	 * Action to change collaboration type
	 */
	const handleTypeChange = (type: CrewStudioFormData["crew_process_type"]) => {
		setValue("crew_process_type", type, { shouldValidate: true });
		
		// If switching to Sequential and tasks are empty, add an initial task
		if (type === "Sequential" && (!tasks || tasks.length === 0)) {
			setValue("tasks" as any, [{ description: "", specialist_id: "" }]);
		}
		
		syncDraft();
	};

	return {
		form,
		currentType,
		estimatedCost,
		handleTypeChange,
		syncDraft,
	};
};
