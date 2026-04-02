"use client";

import React from "react";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";

export type StudioNavSection = {
    readonly id: string;
    readonly label: string;
};

export type GenericStudioSectionNavProps = {
    readonly sections: readonly StudioNavSection[];
    readonly activeSection: string;
    readonly onSectionClick: (id: string) => void;
};

/**
 * GenericStudioSectionNav: A reusable navigation component for Studio environments.
 */
export const GenericStudioSectionNav = ({
    sections,
    activeSection,
    onSectionClick,
}: GenericStudioSectionNavProps) => {
    return (
        <FormNavContainer>
            <FormNavList>
                {sections.map((section, index) => (
                    <li key={section.id}>
                        <FormNavItem
                            number={index + 1}
                            title={section.label}
                            currentProgress={0} // Can be extended to track real progress
                            totalProgress={0}
                            isActive={activeSection === section.id}
                            onClick={() => onSectionClick(section.id)}
                        />
                    </li>
                ))}
            </FormNavList>
        </FormNavContainer>
    );
};
