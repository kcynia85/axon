import React from "react";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";

interface Props {
	sections: { id: string; label: string; number: number }[];
	activeSection: string;
	onSectionClick: (id: string) => void;
	onExitToLibrary: () => void;
}

export const ModelStudioSectionNav = ({
	sections,
	activeSection,
	onSectionClick,
	onExitToLibrary,
}: Props) => {
	return (
		<FormNavContainer>
			<FormNavList>
				{sections.map((section) => (
					<li key={section.id}>
						<FormNavItem
							number={section.number}
							title={section.label}
							isActive={activeSection === section.id}
							onClick={() => onSectionClick(section.id)}
                            // Minimal progress logic for now to match interface
                            currentProgress={activeSection === section.id ? 1 : 0}
                            totalProgress={1}
						/>
					</li>
				))}
			</FormNavList>
			<FormNavFooter>
				<FormNavLibraryButton onClick={onExitToLibrary} label="Wróć do Modeli" />
			</FormNavFooter>
		</FormNavContainer>
	);
};
