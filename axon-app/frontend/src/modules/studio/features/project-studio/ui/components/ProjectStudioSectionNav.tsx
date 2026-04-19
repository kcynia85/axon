"use client";

import React from "react";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";

export type ProjectStudioSectionNavProps = {
    readonly sections: readonly { id: string; label: string; number: number }[];
    readonly activeSection: string;
    readonly onSectionClick: (id: string) => void;
    readonly onExitToLibrary: () => void;
};

export const ProjectStudioSectionNav = ({
    sections,
    activeSection,
    onSectionClick,
    onExitToLibrary
}: ProjectStudioSectionNavProps) => {
    return (
        <FormNavContainer>
            <FormNavList>
                {sections.map((section) => (
                    <li key={section.id}>
                        <FormNavItem
                            number={section.number}
                            title={section.label}
                            currentProgress={0}
                            totalProgress={0}
                            isActive={activeSection.toUpperCase() === section.id.toUpperCase()}
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
