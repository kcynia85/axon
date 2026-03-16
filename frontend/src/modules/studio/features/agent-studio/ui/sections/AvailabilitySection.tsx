import { SharedAvailabilitySection } from "@/modules/studio/ui/shared/SharedAvailabilitySection";

/**
 * AvailabilitySection: Access control for agents.
 * Now using shared component for consistency across all studios.
 */
export const AvailabilitySection = () => {
	return <SharedAvailabilitySection name="availability_workspace" number={7} />;
};
