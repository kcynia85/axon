import { Space } from "../domain";

export type SpaceListProps = {
  readonly spaces: readonly Space[];
  readonly viewMode: "grid" | "list";
};

export type RecentlyUsedProps = {
  readonly spaces: readonly Space[];
  readonly className?: string;
};

export type SpaceListItemProps = {
  readonly space: Space;
};

export type SpaceCardProps = {
  readonly space: Space;
};

export type SpaceCanvasHeaderProps = {
  readonly spaceName: string;
};

export type SpaceCanvasSidebarProps = {
  readonly className?: string;
  readonly children?: React.ReactNode;
};

export type SpaceAgentInspectorProperties = {
    readonly data: any;
    readonly nodeId: string;
    readonly onPropertyChange: (props: any) => void;
};

export type SpaceCrewInspectorProperties = {
    readonly data: any;
    readonly nodeId: string;
    readonly onStatusChange?: (status: string) => void;
    readonly onPropertyChange: (props: any) => void;
};

export type SpaceAutomationInspectorProperties = {
    readonly data: any;
    readonly onPropertyChange: (props: any) => void;
};

export type SpaceServiceInspectorProperties = {
    readonly data: any;
    readonly onPropertyChange: (props: any) => void;
};

export type SpaceTemplateInspectorProperties = {
    readonly data: any;
    readonly onPropertyChange: (props: any) => void;
};

export type SpacePatternInspectorProperties = {
    readonly data: any;
    readonly onPropertyChange: (props: any) => void;
};

export type SpaceZoneInspectorProperties = {
    readonly data: any;
    readonly onPropertyChange: (props: any) => void;
};
