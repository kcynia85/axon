import { Project, ProjectStatus, Artifact, ApprovalStatus } from "@/modules/projects/domain";
import { ProjectViewModel, ArtifactViewModel } from "../types";
import { StatusVariant } from "@/shared/ui/complex/StatusBadge";
import { CreateProjectFormData } from "../../application/schemas";

export const mapProjectToViewModel = (project: Project): ProjectViewModel => {
    const status = project.project_status || project.status;
    const name = project.project_name || project.name || "Unnamed Project";
    
    let statusLabel = "Unknown";
    let statusVariant: StatusVariant = "default";

    if (status) {
        if (status === ProjectStatus.IN_PROGRESS) {
            statusLabel = "In Progress";
            statusVariant = "warning";
        } else if (status === ProjectStatus.COMPLETED) {
            statusLabel = "Completed";
            statusVariant = "success";
        } else if (status === ProjectStatus.IDEA) {
            statusLabel = "Idea";
            statusVariant = "info";
        } else {
            statusLabel = status.toUpperCase();
        }
    }

    const rawTags = project.project_keywords || [];
    const displayTags = rawTags.slice(0, 3).map(tag => tag.startsWith('#') ? tag : `#${tag}`);
    const remainingTagsCount = Math.max(0, rawTags.length - 3);

    // Use aggregated count from backend hydration if present
    const artifactsCount = project.aggregated_artifacts_count !== undefined 
        ? project.aggregated_artifacts_count 
        : (project.artifacts?.length || 0);

    return {
        id: project.id,
        title: name,
        statusLabel,
        statusVariant,
        displayTags,
        hasMoreTags: remainingTagsCount > 0,
        remainingTagsCount,
        artifactsCount,
        workspaces: project.workspaces || ["Design", "Product Management", "Discovery"],
        createdAt: project.created_at,
        spaceUrl: `/projects/${project.id}/space`,
    };
};

export const mapProjectToFormData = (project: Project): CreateProjectFormData => {
    const links = [];
    
    // Add strategy URL as first link if exists
    if (project.project_strategy_url) {
        links.push({ url: project.project_strategy_url });
    }
    
    // Add other key resources
    if (project.key_resources && project.key_resources.length > 0) {
        project.key_resources.forEach(res => {
            // Avoid duplicate if it matches strategy url
            if (res.resource_url !== project.project_strategy_url) {
                links.push({ url: res.resource_url });
            }
        });
    }

    // Ensure at least one empty link field if none exist
    if (links.length === 0) {
        links.push({ url: "" });
    }

    return {
        name: project.project_name || project.name || "",
        description: project.project_summary || "",
        status: project.project_status || project.status || "Idea",
        keywords: project.project_keywords || [],
        links: links,
        spaceIds: project.space_ids || [],
        generateNewSpace: false,
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
        spaceId: artifact.space_id,
        nodeId: artifact.node_id,
    };
};
