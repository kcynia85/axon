import React from "react";
import { Input } from "@/shared/ui/ui/Input";
import { Search, Check } from "lucide-react";
import { ProjectSpaceSelectorProps } from "../types";
import { 
    ProjectSpaceContainer, 
    ProjectSpaceOptionsGrid, 
    ProjectSpaceOptionCard, 
    ProjectSpaceOptionLayout,
    ProjectSpaceOptionInfo,
    ProjectSpaceExistingSearchWrapper,
    ProjectSpaceCheckIconWrapper
} from "./ProjectSpaceLayout";
import { ProjectSpaceOptionTitle, ProjectSpaceOptionSubtitle } from "./ProjectFormAtoms";
import { MonoText } from "./ProjectTypography";

export const ProjectSpaceSelector: React.FC<ProjectSpaceSelectorProps> = ({ 
    form, 
    spaceMode, 
    projectName 
}) => {
    return (
        <ProjectSpaceContainer>
            <ProjectSpaceOptionsGrid>
                {/* Option 1: New Space */}
                <ProjectSpaceOptionCard 
                    isActive={spaceMode === "new"}
                    onClick={() => form.setValue("spaceMode", "new")}
                >
                    <ProjectSpaceOptionLayout>
                        <ProjectSpaceOptionInfo>
                            <ProjectSpaceOptionTitle isActive={spaceMode === "new"}>
                                Utwórz nowy space
                            </ProjectSpaceOptionTitle>
                            <ProjectSpaceOptionSubtitle isActive={spaceMode === "new"}>
                                Nazwa: <MonoText>{projectName || "Nazwa projektu"} space</MonoText>
                            </ProjectSpaceOptionSubtitle>
                        </ProjectSpaceOptionInfo>
                        {spaceMode === "new" && (
                            <ProjectSpaceCheckIconWrapper>
                                <Check className="h-5 w-5" />
                            </ProjectSpaceCheckIconWrapper>
                        )}
                    </ProjectSpaceOptionLayout>
                </ProjectSpaceOptionCard>

                {/* Option 2: Existing Space */}
                <ProjectSpaceOptionCard 
                    isActive={spaceMode === "existing"}
                    onClick={() => form.setValue("spaceMode", "existing")}
                >
                    <ProjectSpaceOptionLayout>
                        <ProjectSpaceOptionInfo className="flex-1 space-y-4">
                            <ProjectSpaceOptionTitle isActive={spaceMode === "existing"}>
                                Użyj istniejącego space&apos;a
                            </ProjectSpaceOptionTitle>
                            {spaceMode === "existing" && (
                                <ProjectSpaceExistingSearchWrapper>
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                                    <Input 
                                        placeholder="Wyszukaj space" 
                                        className="h-12 pl-12 bg-white dark:bg-black text-black dark:text-white border-none shadow-inner ring-1 ring-zinc-200 dark:ring-zinc-800"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </ProjectSpaceExistingSearchWrapper>
                            )}
                        </ProjectSpaceOptionInfo>
                        {spaceMode === "existing" && (
                            <ProjectSpaceCheckIconWrapper>
                                <Check className="h-5 w-5" />
                            </ProjectSpaceCheckIconWrapper>
                        )}
                    </ProjectSpaceOptionLayout>
                </ProjectSpaceOptionCard>
            </ProjectSpaceOptionsGrid>
        </ProjectSpaceContainer>
    );
};
