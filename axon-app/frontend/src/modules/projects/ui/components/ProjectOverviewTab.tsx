import React from "react";
import { ProjectOverviewTabProps } from "../types";
import { ProjectDetailsSection, ProjectDetailsContentGroup } from "./ProjectDetailsLayout";
import { 
    ProjectDetailsTitle, 
    ProjectDetailsValue, 
    ProjectDetailsSecondaryValue,
    ProjectDetailsActionGroup,
    ProjectDetailsEditButton,
    ProjectDetailsOpenSpaceButton,
    ProjectDetailsDeleteButton
} from "./ProjectDetailsAtoms";

/**
 * ProjectOverviewTab - Presentation component for project overview information.
 */
export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ 
    viewModel, 
    onDelete, 
    isDeleting 
}) => {
    return (
        <ProjectDetailsContentGroup>
            <ProjectDetailsSection sectionLabel="Project name">
                <ProjectDetailsTitle>{viewModel.title}</ProjectDetailsTitle>
            </ProjectDetailsSection>

            <ProjectDetailsSection sectionLabel="Status">
                <ProjectDetailsValue>{viewModel.statusLabel}</ProjectDetailsValue>
            </ProjectDetailsSection>

            <ProjectDetailsSection sectionLabel="Active workspaces">
                <ProjectDetailsContentGroup>
                    {(viewModel.workspaces || []).map((workspaceName, index) => (
                        <ProjectDetailsValue key={index} className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                            {workspaceName}
                        </ProjectDetailsValue>
                    ))}
                </ProjectDetailsContentGroup>
            </ProjectDetailsSection>

            <ProjectDetailsSection sectionLabel="Keywords">
                <ProjectDetailsSecondaryValue>
                    {(viewModel.displayTags || []).join(", ") || "No keywords"}
                </ProjectDetailsSecondaryValue>
            </ProjectDetailsSection>

            <ProjectDetailsActionGroup>
                <ProjectDetailsEditButton />
                <ProjectDetailsOpenSpaceButton href={viewModel.spaceUrl} />
                <ProjectDetailsDeleteButton onClick={onDelete} disabled={isDeleting} />
            </ProjectDetailsActionGroup>
        </ProjectDetailsContentGroup>
    );
};
