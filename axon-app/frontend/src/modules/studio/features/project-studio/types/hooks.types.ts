import type * as React from "react";
import { ProjectStudioSectionId } from "./project-studio.types";

export interface ProjectSectionConfig {
	readonly id: ProjectStudioSectionId;
	readonly number: number;
	readonly label: string;
	readonly icon?: React.ElementType;
}
