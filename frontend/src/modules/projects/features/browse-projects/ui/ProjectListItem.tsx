import React from "react";
import { ProjectListItemProps } from "./types";
import { ProjectListItemInfo } from "./components/ProjectListItemInfo";
import { ProjectListItemStats } from "./components/ProjectListItemStats";
import { ProjectListItemActions } from "./components/ProjectListItemActions";
import { ProjectListItemContainer } from "./components/ProjectListItemContainer";
import { ProjectListItemActionsGroup } from "./components/ProjectListItemActionsGroup";

export const ProjectListItem: React.FC<ProjectListItemProps> = ({ viewModel, onViewDetails }) => {
    return (
        <ProjectListItemContainer>
            <ProjectListItemInfo 
                title={viewModel.title}
                statusLabel={viewModel.statusLabel}
                tags={viewModel.displayTags}
                hasMoreTags={viewModel.hasMoreTags}
                remainingTagsCount={viewModel.remainingTagsCount}
            />

            <ProjectListItemActionsGroup>
                <ProjectListItemStats artifactsCount={viewModel.artifactsCount} />
                
                <ProjectListItemActions 
                    spaceUrl={viewModel.spaceUrl}
                    onViewDetails={() => onViewDetails(viewModel.id)}
                />
            </ProjectListItemActionsGroup>
        </ProjectListItemContainer>
    );
};
