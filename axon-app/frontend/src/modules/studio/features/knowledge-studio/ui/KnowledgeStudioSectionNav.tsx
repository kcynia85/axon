import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import { KnowledgeResourceData } from "../types/knowledge-studio.types";

export type KnowledgeStudioSectionId = "RESOURCE" | "METADATA" | "STRATEGY" | "HUBS";

export type KnowledgeSectionConfig = {
    id: KnowledgeStudioSectionId;
    number: string;
    title: string;
};

const SECTIONS: KnowledgeSectionConfig[] = [
    { id: "RESOURCE", number: "01", title: "Wybierz Zasób" },
    { id: "METADATA", number: "02", title: "Metadane" },
    { id: "STRATEGY", number: "03", title: "Strategia Przetwarzania" },
    { id: "HUBS", number: "04", title: "Przypisanie do Hubów" },
];

interface KnowledgeStudioSectionNavProps {
    activeSection: KnowledgeStudioSectionId;
    onSectionClick: (id: KnowledgeStudioSectionId) => void;
    data: KnowledgeResourceData;
}

export const KnowledgeStudioSectionNav = ({ activeSection, onSectionClick, data }: KnowledgeStudioSectionNavProps) => {
    const getProgress = (id: KnowledgeStudioSectionId) => {
        switch (id) {
            case "RESOURCE":
                return data.fileName ? 1 : 0;
            case "METADATA":
                return data.metadata.length > 0 ? 1 : 0;
            case "STRATEGY":
                return (data.model && data.chunkType) ? 1 : 0;
            case "HUBS":
                return data.hubs.length > 0 ? 1 : 0;
            default:
                return 0;
        }
    };

    return (
        <FormNavContainer>
            <FormNavList>
                {SECTIONS.map((section) => (
                    <li key={section.id}>
                        <FormNavItem
                            number={section.number}
                            title={section.title}
                            currentProgress={getProgress(section.id)}
                            totalProgress={1}
                            isActive={section.id === activeSection}
                            onClick={() => onSectionClick(section.id)}
                        />
                    </li>
                ))}
            </FormNavList>
        </FormNavContainer>
    );
};
