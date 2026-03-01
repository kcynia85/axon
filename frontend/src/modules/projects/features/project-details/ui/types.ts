import { Project, Artifact, KeyResource } from "@/modules/projects/domain";
import { ProjectViewModel, ArtifactViewModel } from "../../browse-projects/ui/types";

export interface ProjectDetailsViewProps {
    readonly project: Project;
    readonly artifacts: readonly Artifact[];
    readonly activeTab?: string;
    readonly onTabChange?: (tab: string) => void;
    readonly isLoadingArtifacts?: boolean;
}

// --- Tab Components Props ---

export interface ProjectOverviewTabProps {
    readonly viewModel: ProjectViewModel;
    readonly onDelete: () => void;
    readonly isDeleting: boolean;
}

export interface ProjectResourcesTabProps {
    readonly keyResources: readonly KeyResource[];
}

export interface ProjectArtifactsTabProps {
    readonly artifacts: readonly ArtifactViewModel[];
    readonly isLoading: boolean;
}

export type ProjectActivityTabProps = object;

// --- Layout & Atom Props ---

export interface ProjectDetailsContainerProps {
    readonly children: React.ReactNode;
}

export interface ProjectDetailsSectionProps {
    readonly label: string;
    readonly children: React.ReactNode;
}

export interface ProjectDetailsLinkProps {
    readonly href: string;
    readonly children: React.ReactNode;
}
