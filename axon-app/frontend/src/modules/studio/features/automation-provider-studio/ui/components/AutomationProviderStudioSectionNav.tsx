import React from "react";
import { AutomationProviderStudioSectionId } from "../../types/sections.constants";
import { NavSectionItem } from "../../application/hooks/useAutomationProviderStudioSectionNav";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";

interface Props {
	readonly items: readonly NavSectionItem[];
	readonly activeSection: AutomationProviderStudioSectionId;
	readonly onSectionClick: (id: AutomationProviderStudioSectionId) => void;
	readonly onExitToLibrary: () => void;
}

export const AutomationProviderStudioSectionNav = ({
	items,
	activeSection,
	onSectionClick,
	onExitToLibrary,
}: Props) => {
	return (
		<FormNavContainer>
			<FormNavList>
				{items.map((section) => {
                    let current = 0;
                    if (section.progress === "complete") current = 1;
                    if (section.progress === "current") current = 1;

					return (
                        <li key={section.id}>
                            <FormNavItem
                                number={section.number}
                                title={section.title}
                                currentProgress={current}
                                totalProgress={1}
                                isActive={section.id === activeSection}
                                onClick={() => onSectionClick(section.id)}
                            />
                        </li>
                    );
                })}
			</FormNavList>
		</FormNavContainer>
	);
};

