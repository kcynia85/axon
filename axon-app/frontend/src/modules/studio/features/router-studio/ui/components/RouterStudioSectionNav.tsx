import React from "react";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import type { RouterSectionIdentifier } from "../../types/router.constants";
import type { NavSectionItem } from "../../application/hooks/useRouterStudioSectionNav";

interface Props {
	sections: NavSectionItem[];
	activeSection: RouterSectionIdentifier;
	onSectionClick: (id: RouterSectionIdentifier) => void;
	onExitToLibrary: () => void;
}

export const RouterStudioSectionNav = ({
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
