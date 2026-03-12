import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import {
	AUTOMATION_STUDIO_SECTIONS,
	type AutomationStudioSectionId,
} from "../../types/sections.constants";

interface Props {
	activeSection: AutomationStudioSectionId;
	onSectionClick: (id: AutomationStudioSectionId) => void;
	onExitToLibrary: () => void;
}

/**
 * AutomationSectionNav: Vertical navigation for the Automation Studio.
 * Matches Agent Studio and Service Studio styles.
 */
export const AutomationSectionNav = ({
	activeSection,
	onSectionClick,
	onExitToLibrary,
}: Props) => {
	return (
		<FormNavContainer>
			<FormNavList>
				{AUTOMATION_STUDIO_SECTIONS.map((section) => (
					<li key={section.id}>
						<FormNavItem
							number={section.number}
							title={section.title}
							currentProgress={0} // Can be connected to form validation state later
							totalProgress={0}
							isActive={activeSection === section.id}
							onClick={() => onSectionClick(section.id)}
						/>
					</li>
				))}
			</FormNavList>

			<FormNavFooter>
				<FormNavLibraryButton onClick={onExitToLibrary} label="Resources" />
			</FormNavFooter>
		</FormNavContainer>
	);
};
