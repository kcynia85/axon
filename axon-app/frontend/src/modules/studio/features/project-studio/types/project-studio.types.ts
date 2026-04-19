export type ProjectStudioSectionId = "IDENTITY" | "SPACE" | "RESOURCES" | "ARTEFACTS";

export type ProjectStudioStep = "design";

export type ProjectStudioSection = {
    id: ProjectStudioSectionId;
    label: string;
    icon?: string;
};
