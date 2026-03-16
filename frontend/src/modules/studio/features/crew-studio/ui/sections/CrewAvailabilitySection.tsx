import { SharedAvailabilitySection } from "@/modules/studio/ui/shared/SharedAvailabilitySection";

/**
 * CrewAvailabilitySection: Access control for crews.
 * Now using shared component for consistency across all studios.
 */
export const CrewAvailabilitySection = () => {
	return <SharedAvailabilitySection name="availability_workspace" number={6} />;
};
