import React from "react";
import { ProjectListItemProps } from "../types";
import { ProjectListItemInfo } from "./ProjectListItemInfo";
import { ProjectListItemStats } from "./ProjectListItemStats";
import { ProjectListItemActions } from "./ProjectListItemActions";
import { ProjectListItemContainer } from "./ProjectListItemContainer";
import { ProjectListItemActionsGroup } from "./ProjectListItemActionsGroup";

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
