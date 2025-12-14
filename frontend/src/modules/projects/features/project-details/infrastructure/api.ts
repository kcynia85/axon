import { Project } from "../../../domain";
import { Artifact, getProjectDetailsMock, getProjectArtifactsMock } from "./mock-api";
import { isMockMode } from "@/shared/infrastructure/mock-adapter";

export const getProjectDetails = async (id: string): Promise<Project | null> => {
    if (isMockMode()) {
        return getProjectDetailsMock(id);
    }
    return null;
};

export const getProjectArtifacts = async (projectId: string): Promise<Artifact[]> => {
    if (isMockMode()) {
        return getProjectArtifactsMock(projectId);
    }
    return [];
};
