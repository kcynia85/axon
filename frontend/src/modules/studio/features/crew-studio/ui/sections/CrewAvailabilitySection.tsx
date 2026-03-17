import { SharedAvailabilitySection } from "@/modules/studio/ui/shared/SharedAvailabilitySection";

interface Props {
	onSyncDraft: () => void;
}

/**
 * CrewAvailabilitySection: Access control for crews.
 * Now using shared component for consistency across all studios.
 */
export const CrewAvailabilitySection = ({ onSyncDraft }: Props) => {
	return (
		<div onBlur={onSyncDraft}>
			<SharedAvailabilitySection name="availability_workspace" number={6} />
		</div>
	);
};
