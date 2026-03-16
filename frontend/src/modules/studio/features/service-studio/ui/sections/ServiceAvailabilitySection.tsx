import { SharedAvailabilitySection } from "@/modules/studio/ui/shared/SharedAvailabilitySection";

/**
 * ServiceAvailabilitySection: Access control for services.
 * Now using shared component for consistency across all studios.
 */
export const ServiceAvailabilitySection = () => {
	return <SharedAvailabilitySection name="availability" number={4} />;
};
