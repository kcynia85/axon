import { z } from "zod";

export const archetypeSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	role: z.string().min(1, "Role is required"),
	goal: z.string().min(1, "Goal is required"),
	backstory: z.string().min(1, "Backstory is required"),
	keywords: z.array(z.string()).default([]),
	knowledgeHubIds: z.array(z.string()).default([]),
	instructions: z.array(z.string()).default([]),
	constraints: z.array(z.string()).default([]),
	workspaceIds: z.array(z.string()).default(["Global Availability"]),
});

export type ArchetypeFormValues = z.infer<typeof archetypeSchema>;
