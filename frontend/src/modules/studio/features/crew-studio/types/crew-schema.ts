import { z } from "zod";
import { DataInterfaceItemSchema } from "@/shared/domain/workspaces";

/**
 * Base properties shared by ALL Crew types in the Studio Form.
 * We use names consistent with the domain (CrewSchema).
 */
const BaseCrewFormSchema = z.object({
	crew_name: z.string().min(1, "Crew name is required"),
	crew_description: z.string().min(1, "Goal/Description is required"),
	crew_keywords: z.array(z.string()).default([]),
	// Using existing DataInterface structure from domain for consistency
	contexts: z.array(DataInterfaceItemSchema).default([]),
	artefacts: z.array(DataInterfaceItemSchema).default([]),
	availability_workspace: z.array(z.string()).default([]),
	cost: z.number().default(0), // Derived state for UI feedback
});

/**
 * 1. Hierarchical Crew Configuration
 * Collaboration around a manager/owner agent.
 */
export const HierarchicalCrewFormSchema = z.object({
	crew_process_type: z.literal("Hierarchical"),
	owner_agent_id: z.string().min(1, "Manager/Owner Agent is required"),
	synthesis_instruction: z.string().optional(),
	agent_member_ids: z.array(z.string()).min(1, "At least one team member is required"),
});

/**
 * 2. Parallel Crew Configuration
 * Standard team structure where agents work in parallel.
 */
export const ParallelCrewFormSchema = z.object({
	crew_process_type: z.literal("Parallel"),
	agent_member_ids: z.array(z.string()).min(1, "At least one team member is required"),
});

/**
 * 3. Sequential Crew Configuration
 * Strictly ordered sequence of tasks.
 */
export const SequentialTaskFormSchema = z.object({
	id: z.string().optional(), // For stable rendering in useFieldArray
	description: z.string().min(1, "Task description is required"),
	specialist_id: z.string().min(1, "Specialist must be assigned"),
});

export const SequentialCrewFormSchema = z.object({
	crew_process_type: z.literal("Sequential"),
	tasks: z.array(SequentialTaskFormSchema).min(1, "At least one task is required"),
	// In sequential, members are derived from task specialists, but we keep the field for compatibility
	agent_member_ids: z.array(z.string()).default([]),
});

/**
 * FINAL CREW STUDIO FORM SCHEMA
 */
export const CrewStudioFormSchema = z.discriminatedUnion("crew_process_type", [
	BaseCrewFormSchema.merge(HierarchicalCrewFormSchema),
	BaseCrewFormSchema.merge(ParallelCrewFormSchema),
	BaseCrewFormSchema.merge(SequentialCrewFormSchema),
]);

export type CrewStudioFormData = z.infer<typeof CrewStudioFormSchema>;
export type SequentialTaskForm = z.infer<typeof SequentialTaskFormSchema>;
