import { SharedAvailabilitySection } from "@/modules/studio/ui/shared/SharedAvailabilitySection";

/**
 * AutomationAvailabilitySection: Access control for automations.
 * Now using shared component for consistency across all studios.
 */
export const AutomationAvailabilitySection = () => {
	return <SharedAvailabilitySection name="availability" number={4} />;
};
