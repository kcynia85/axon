import { Project, ProjectStatus, Artifact, ApprovalStatus } from "@/modules/projects/domain";
import { ProjectViewModel, ArtifactViewModel } from "../types";
import { StatusVariant } from "@/shared/ui/complex/StatusBadge";

export const mapProjectToViewModel = (project: Project): ProjectViewModel => {
    const status = project.project_status || project.status;
    const name = project.project_name || project.name || "Unnamed Project";
    
    let statusLabel = "Unknown";
    let statusVariant: StatusVariant = "default";

    if (status) {
        const lowercaseStatus = status.toLowerCase();
        if (lowercaseStatus === ProjectStatus.IN_PROGRESS || lowercaseStatus === 'in_progress') {
            statusLabel = "In Progress";
            statusVariant = "warning";
        } else if (lowercaseStatus === ProjectStatus.DONE || lowercaseStatus === 'done' || lowercaseStatus === 'completed') {
            statusLabel = "Completed";
            statusVariant = "success";
        } else if (lowercaseStatus === ProjectStatus.IDEA || lowercaseStatus === 'idea') {
            statusLabel = "Idea";
            statusVariant = "info";
        } else {
            statusLabel = status.toUpperCase();
        }
    }

    const rawTags = project.project_keywords || [];
    const displayTags = rawTags.slice(0, 3).map(tag => tag.startsWith('#') ? tag : `#${tag}`);
    const remainingTagsCount = Math.max(0, rawTags.length - 3);

    return {
        id: project.id,
        title: name,
        statusLabel,
        statusVariant,
        displayTags,
        hasMoreTags: remainingTagsCount > 0,
        remainingTagsCount,
        artifactsCount: project.artifacts?.length || 0,
        workspaces: project.workspaces || ["Design", "Product Management", "Discovery"],
        createdAt: project.created_at,
        spaceUrl: `/projects/${project.id}/space`,
    };
};

export const mapArtifactToViewModel = (artifact: Artifact): ArtifactViewModel => {
    const status = artifact.artifact_approval_status;
    
    return {
        id: artifact.id,
        name: artifact.artifact_name || artifact.title || "Unnamed Artifact",
        sourcePath: artifact.artifact_source_path || "unknown-path",
        statusLabel: status === ApprovalStatus.APPROVED ? "Approved" : "In review",
        statusVariant: status === ApprovalStatus.APPROVED ? "success" : "info",
    };
};
