import { SharedAvailabilitySection } from "@/modules/studio/ui/shared/SharedAvailabilitySection";

interface Props {
	onSyncDraft: () => void;
}

/**
 * AvailabilitySection: Access control for templates.
 * Now using shared component for consistency across all studios.
 */
export const AvailabilitySection = ({ onSyncDraft }: Props) => {
	return <SharedAvailabilitySection name="availability_workspace" number={5} onSyncDraft={onSyncDraft} />;
};
