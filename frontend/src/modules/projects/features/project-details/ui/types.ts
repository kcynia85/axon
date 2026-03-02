import { Project, Artifact, KeyResource } from "@/modules/projects/domain";
import { ProjectViewModel, ArtifactViewModel } from "../../browse-projects/ui/types";

export type ProjectDetailsViewProps = {
    readonly project: Project;
    readonly artifacts: readonly Artifact[];
    readonly activeTab?: string;
    readonly onTabChange?: (tab: string) => void;
    readonly isLoadingArtifacts?: boolean;
}

// --- Tab Components Props ---

export type ProjectOverviewTabProps = {
    readonly viewModel: ProjectViewModel;
    readonly onDelete: () => void;
    readonly isDeleting: boolean;
}

export type ProjectResourcesTabProps = {
    readonly keyResources: readonly KeyResource[];
}

export type ProjectArtifactsTabProps = {
    readonly artifacts: readonly ArtifactViewModel[];
    readonly isLoading: boolean;
}

export type ProjectActivityTabProps = object;

// --- Layout & Atom Props ---

export type ProjectDetailsContainerProps = {
    readonly children: React.ReactNode;
}

export type ProjectDetailsSectionProps = {
    readonly label: string;
    readonly children: React.ReactNode;
}

export type ProjectDetailsLinkProps = {
    readonly href: string;
    readonly children: React.ReactNode;
}
