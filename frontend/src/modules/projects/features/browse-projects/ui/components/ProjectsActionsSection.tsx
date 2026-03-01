import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { ProjectsActionsSectionProps } from "../types";
import { ProjectsActionsGroup, ProjectsViewSwitcherLayout } from "./ProjectsActionsLayout";
import { ProjectsViewModeButton } from "./ProjectActionAtoms";

export const ProjectsActionsSection: React.FC<ProjectsActionsSectionProps> = ({
    sortBy,
    onSortByChange,
    viewMode,
    onViewModeChange,
    sortOptions
}) => {
    return (
        <ProjectsActionsGroup>
            <SortMenu 
                options={sortOptions}
                activeOptionId={sortBy}
                onSelect={onSortByChange}
            />
            <ProjectsViewSwitcherLayout>
                <ProjectsViewModeButton 
                    onClick={() => onViewModeChange('grid')}
                    isActive={viewMode === 'grid'}
                >
                    <LayoutGrid size={14} />
                    Grid
                </ProjectsViewModeButton>
                <ProjectsViewModeButton 
                    onClick={() => onViewModeChange('list')}
                    isActive={viewMode === 'list'}
                >
                    <List size={14} />
                    List
                </ProjectsViewModeButton>
            </ProjectsViewSwitcherLayout>
        </ProjectsActionsGroup>
    );
};
