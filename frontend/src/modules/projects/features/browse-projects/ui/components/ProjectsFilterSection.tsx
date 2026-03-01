import React from "react";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { ProjectsFilterSectionProps } from "../types";
import { ProjectsFilterGroup, ProjectsFilterDivider } from "./ProjectsFilterLayout";
import { FilterPill } from "@/shared/ui/complex/FilterPill";

export const ProjectsFilterSection: React.FC<ProjectsFilterSectionProps> = ({
    filterGroups,
    activeFilters,
    onToggleFilter,
    onApplyFilters,
    onClearAll,
    onPendingFilterIdsChange,
    resultsCount
}) => {
    return (
        <ProjectsFilterGroup>
            <FilterPill 
                label="By Workspace" 
                group={filterGroups.find(g => g.id === 'workspaces')} 
                activeFilters={activeFilters}
                onToggle={onToggleFilter}
            />
            <FilterPill 
                label="By Status" 
                group={filterGroups.find(g => g.id === 'status')} 
                activeFilters={activeFilters}
                onToggle={onToggleFilter}
            />
            <ProjectsFilterDivider />
            <FilterBigMenu 
                groups={filterGroups}
                resultsCount={resultsCount}
                onApply={onApplyFilters}
                onClearAll={onClearAll}
                onSelectionChange={onPendingFilterIdsChange}
            />
        </ProjectsFilterGroup>
    );
};
