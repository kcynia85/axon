import { SharedAvailabilitySection } from "@/modules/studio/ui/shared/SharedAvailabilitySection";

/**
 * ArchetypeAccessSection: Access control for archetypes.
 * Now using shared component for consistency across all studios.
 */
export const ArchetypeAccessSection = () => {
	// Note: We use 'workspaceIds' as the field name to match the existing archetype schema
	// but we could also migrate it to 'availability_workspace' later.
	return <SharedAvailabilitySection name="workspaceIds" number={3} />;
};
