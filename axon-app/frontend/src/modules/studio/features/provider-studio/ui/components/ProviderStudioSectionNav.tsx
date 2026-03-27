import React from "react";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import { ProviderStudioSectionId } from "../../types/sections.constants";
import { NavSectionItem } from "../../application/hooks/useProviderStudioSectionNav";

interface Props {
	sections: NavSectionItem[];
	activeSection: ProviderStudioSectionId;
	onSectionClick: (id: ProviderStudioSectionId) => void;
	onExitToLibrary: () => void;
}

export const ProviderStudioSectionNav = ({
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
							title={section.title}
							currentProgress={section.progress.current}
							totalProgress={section.progress.total}
							isActive={section.isActive}
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
