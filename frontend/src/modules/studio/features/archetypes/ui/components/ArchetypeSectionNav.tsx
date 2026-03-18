import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import type { ArchetypeStudioSectionId } from "../../types/archetype-studio.types";

interface ArchetypeSectionNavProps {
	sections: {
		id: ArchetypeStudioSectionId;
		title: string;
		number: number;
	}[];
	activeSection: ArchetypeStudioSectionId;
	onSectionClick: (id: ArchetypeStudioSectionId) => void;
	onExitToLibrary: () => void;
}

export const ArchetypeSectionNav = ({
	sections,
	activeSection,
	onSectionClick,
	onExitToLibrary,
}: ArchetypeSectionNavProps) => {
	return (
		<FormNavContainer>
			<FormNavList>
				{sections.map((section) => (
					<li key={section.id}>
						<FormNavItem
							number={section.number}
							title={section.title}
							currentProgress={0} // Can be wired to form validation later
							totalProgress={0}
							isActive={activeSection === section.id}
							onClick={() => onSectionClick(section.id)}
						/>
					</li>
				))}
			</FormNavList>
			<FormNavFooter>
				<FormNavLibraryButton onClick={onExitToLibrary} />
			</FormNavFooter>
		</FormNavContainer>
	);
};
