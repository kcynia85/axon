import { ServiceStudioFormData } from "./service-schema";
import { ServiceStudioSectionId } from "./sections.constants";

export type ServiceStudioProps = {
    readonly onSave: (data: ServiceStudioFormData) => void;
    readonly onCancel: () => void;
    readonly initialData?: Partial<ServiceStudioFormData>;
};

export type ServiceStudioViewProps = {
    readonly form: any;
    readonly activeSectionIdentifier: ServiceStudioSectionId;
    readonly onSectionClick: (sectionIdentifier: ServiceStudioSectionId) => void;
    readonly onCancel: () => void;
    readonly onSave: () => void;
    readonly setCanvasContainerReference: (scrollContainerNode: HTMLDivElement | null) => void;
};
