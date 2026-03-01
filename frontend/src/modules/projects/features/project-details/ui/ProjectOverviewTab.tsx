import React from "react";
import { ProjectOverviewTabProps } from "./types";
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

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ 
    viewModel, 
    onDelete, 
    isDeleting 
}) => {
    return (
        <ProjectDetailsContentGroup>
            <ProjectDetailsSection label="Project name">
                <ProjectDetailsTitle>{viewModel.title}</ProjectDetailsTitle>
            </ProjectDetailsSection>

            <ProjectDetailsSection label="Status">
                <ProjectDetailsValue>{viewModel.statusLabel}</ProjectDetailsValue>
            </ProjectDetailsSection>

            <ProjectDetailsSection label="Active workspaces">
                <ProjectDetailsContentGroup>
                    {(viewModel.workspaces || []).map((ws, i) => (
                        <ProjectDetailsValue key={i} className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                            {ws}
                        </ProjectDetailsValue>
                    ))}
                </ProjectDetailsContentGroup>
            </ProjectDetailsSection>

            <ProjectDetailsSection label="Keywords">
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
