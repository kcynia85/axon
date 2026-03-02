import React from "react";
import { ProjectListItemInfoProps } from "../types";
import { ProjectListItemInfoLayout, ProjectListItemTitleRow, ProjectListItemTagsRow } from "./ProjectListItemLayout";
import { ProjectTitle, ProjectStatusText, ProjectTagText } from "./ProjectTypography";

export const ProjectListItemInfo = ({ 
    title, 
    statusLabel, 
    tags,
    hasMoreTags,
    remainingTagsCount
}: ProjectListItemInfoProps) => {
    return (
        <ProjectListItemInfoLayout>
            <ProjectListItemTitleRow>
                <ProjectTitle>{title}</ProjectTitle>
                <ProjectStatusText>{statusLabel}</ProjectStatusText>
            </ProjectListItemTitleRow>
            
            <ProjectListItemTagsRow>
                {tags.map((formattedTag, i) => (
                    <ProjectTagText key={i}>{formattedTag}</ProjectTagText>
                ))}
                {hasMoreTags && <ProjectTagText>+{remainingTagsCount}</ProjectTagText>}
            </ProjectListItemTagsRow>
        </ProjectListItemInfoLayout>
    );
};
