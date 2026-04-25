import { Space } from "../domain";
import { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from "@xyflow/react";
import { 
    SpaceCanvasNodeInformation,
    SpaceAgentDomainData,
    SpaceCrewDomainData,
    SpaceAutomationDomainData,
    SpaceServiceDomainData,
    SpaceTemplateDomainData,
    SpaceZoneDomainData,
    SpacePatternBlueprint,
    SpaceCanvasNodeProperties
} from "../domain/types";

export type { SpaceCanvasNodeInformation, SpaceCanvasNodeProperties };

export type SpaceListProperties = {
  readonly spaces: readonly Space[];
  readonly viewMode: "grid" | "list";
};

export type SpacesBrowserProperties = {
  readonly initialSpaces: readonly Space[];
  readonly isLoading?: boolean;
};

export type RecentlyUsedProperties = {
  readonly spaces: readonly Space[];
  readonly className?: string;
};

export type SpaceListItemProperties = {
  readonly space: Space;
};

export type SpaceCardProperties = {
  readonly space: Space;
};

export type SpaceCanvasHeaderProperties = {
    readonly spaceIdentifier: string;
    readonly activeSpaceDisplayName: string;
    readonly parentProjectDisplayName: string;
    readonly parentProjectIdentifier?: string;
    readonly isSaving?: boolean;
    readonly isEditing?: boolean;
    readonly temporarySpaceDisplayName?: string;
    readonly showSuccessFeedback?: boolean;
    readonly onRenameSpace?: (newName: string) => void;
    readonly onToggleEditing?: () => void;
    readonly onCancelEditing?: () => void;
    readonly onChangeTemporaryDisplayName?: (newName: string) => void;
    readonly onKeyDown?: (event: React.KeyboardEvent) => void;
};

export type SpaceCanvasSidebarProperties = {
  readonly className?: string;
  readonly children?: React.ReactNode;
  readonly currentlySelectedNodeInformation: SpaceCanvasNodeInformation | null;
  readonly handleNodeDataPropertyChange: (nodeId: string, updatedInformation: any) => void;
  readonly canvasNodes: Node[];
};

export type SpaceCanvasRightSidebarViewProperties = {
    readonly currentlySelectedNodeInformation: SpaceCanvasNodeInformation | null;
    readonly effectiveNodeType: string;
    readonly isNodeSelectedRepresentingAZone: boolean;
    readonly handleStatusChange: (nodeId: string, status: string) => void;
    readonly handleArtifactStatusChange: (nodeId: string, artifactId: string, status: string) => void;
    readonly handlePropertyChange: (propertyName: string, value: any) => void;
    readonly canvasNodes: Node[];
};

export type SpaceAgentInspectorProperties = {
    readonly agentData: SpaceAgentDomainData;
    readonly nodeId: string;
    readonly onStatusChange: (nodeId: string, status: string) => void;
    readonly onPropertyChange: (propertyName: string, value: any) => void;
    readonly canvasNodes: Node[];
};

export type SpaceCrewInspectorProperties = {
    readonly crewData: SpaceCrewDomainData;
    readonly nodeId: string;
    readonly onStatusChange: (nodeId: string, status: string) => void;
    readonly onPropertyChange: (propertyName: string, value: any) => void;
    readonly canvasNodes: Node[];
};

export type SpaceAutomationInspectorProperties = {
    readonly automationData: SpaceAutomationDomainData;
    readonly nodeId: string;
    readonly onPropertyChange: (propertyName: string, value: any) => void;
    readonly canvasNodes: Node[];
};

export type SpaceServiceInspectorProperties = {
    readonly serviceData: SpaceServiceDomainData;
    readonly nodeId: string;
    readonly onArtifactStatusChange: (nodeId: string, artifactId: string, status: string) => void;
    readonly onPropertyChange: (propertyName: string, value: any) => void;
    readonly canvasNodes: Node[];
};

export type SpaceTemplateInspectorProperties = {
    readonly templateData: SpaceTemplateDomainData;
    readonly nodeId: string;
    readonly onPropertyChange: (propertyName: string, value: any) => void;
    readonly canvasNodes: Node[];
};

export type SpacePatternInspectorProperties = {
    readonly patternData: any;
    readonly onPropertyChange: (propertyName: string, value: any) => void;
};

export type SpaceZoneInspectorProperties = {
    readonly zoneData: SpaceZoneDomainData;
    readonly nodeId: string;
    readonly onPropertyChange: (propertyName: string, value: any) => void;
    readonly canvasNodes: Node[];
};

export type SpaceCanvasOrchestrationLogic = {
    readonly canvasNodes: Node[];
    readonly canvasEdges: Edge[];
    readonly handleCanvasNodesChange: OnNodesChange;
    readonly handleCanvasEdgesChange: OnEdgesChange;
    readonly handleNewConnectionCreated: (connection: Connection) => void;
    readonly validateConnectionBetweenNodes: (connection: Connection) => boolean;
    readonly handleDragOverEvent: (event: React.DragEvent) => void;
    readonly handleDropEvent: (event: React.DragEvent) => void;
    readonly addNewNodeToCanvas: (nodeType: string, initialNodeData: Record<string, unknown>, targetWorkspaceId: string) => string;
    readonly addMultipleNodesToCanvas: (nodes: Array<{ type: string; data: Record<string, unknown>; workspaceId: string }>) => string[];
    readonly updateNodeDataOnCanvas: (nodeId: string, updatedInformation: any) => void;
    readonly currentlySelectedNode: Node | null;
    readonly duplicateNode: (node: Node) => void;
    readonly deleteNodes: (nodeIds: string[]) => void;
    readonly updateNodesStatus: (nodeIds: string[], status: string) => void;
    readonly copyNodes: (nodes: Node[]) => void;
    readonly cutNodes: (nodes: Node[]) => void;
    readonly pasteNodes: (position?: { x: number; y: number }) => void;
    readonly createPatternFromSelection: (name: string, description: string, type: 'pattern' | 'super-pattern') => SpacePatternBlueprint;
    readonly instantiatePatternFromBlueprint: (blueprint: SpacePatternBlueprint, position: { x: number; y: number }) => void;
    readonly handleKeyDown: (event: React.KeyboardEvent) => void;
};

export type SpaceCanvasPresentationViewProperties = SpaceCanvasOrchestrationLogic & {
    readonly workspaceId: string;
    readonly canvasViewProperties: any;
    readonly spaceData?: any;
    readonly isSaving: boolean;
    readonly availableAgents: any[];
    readonly availableCrews: any[];
    metaAgent?: {
        isPanelOpen: boolean;
        togglePanel: () => void;
        closePanel: () => void;
        drafts: any[];
        connections: any[];
        reasoning: string | null;
        contextStats: any | null;
        isProposing: boolean;
        error: Error | null;
        onPropose: (query: string) => void;
        onApproveDrafts: (drafts: any[], connections: any[]) => void;
        onRejectDraft: () => void;
        onNewChat: () => void;
        contextLabel: string;
        knowledgeEnabled: boolean;
        setKnowledgeEnabled: (enabled: boolean) => void;
        systemAwarenessEnabled: boolean;
        attachedFiles: any[];
        addFiles: (files: any[]) => void;
        removeFile: (name: string) => void;
        query: string;
        setQuery: (q: string) => void;
        isFocused: boolean;
        setIsFocused: (f: boolean) => void;
        isMaximized: boolean;
        setIsMaximized: (m: boolean) => void;
        hasProjectContext?: boolean;
        hasNotionContext?: boolean;
        activeStep: 'idle' | 'planner' | 'retriever' | 'drafter' | 'validator';
    };
};

export type SpaceCanvasViewProperties = {
    readonly initialConfiguration?: unknown;
    readonly workspaceId: string;
};

// UI Models
export type VisualStyleForZoneColor = {
    readonly borderClassName: string;
    readonly shadowClassName: string;
    readonly handleBackgroundClassName: string;
    readonly backgroundClassName: string;
    readonly iconBackgroundClassName: string;
    readonly borderSelectedClassName: string;
    readonly textClassName: string;
    readonly resizerLineClassName: string;
    readonly resizerHandleClassName: string;
    readonly hoverBackgroundClassName: string;
    readonly level1HoverBackgroundClassName: string;
    readonly activeOutputClassName: string;
};

export type NodeVisualProperties = {
    readonly containerClassName: string;
    readonly headerClassName: string;
    readonly iconClassName: string;
    readonly titleClassName: string;
    readonly subtitleClassName: string;
    readonly handleClassName: string;
};

export type SpaceNodeViewModel = {
    readonly visual: NodeVisualProperties;
    readonly displayName: string;
    readonly statusText?: string;
    readonly progressValue?: number;
    readonly progressLabel?: string;
    readonly isWorking?: boolean;
    readonly isDone?: boolean;
    readonly isConsultation?: boolean;
    readonly isBriefing?: boolean;
    readonly isAlignment?: boolean;
    readonly isCritique?: boolean;
    readonly isMissingContext?: boolean;
    readonly zoneColor?: string;
    readonly artifactLabel?: string;
    readonly artifactStatusText?: string;
    readonly hasArtifact?: boolean;
    readonly teamRoles?: readonly string[];
    readonly activeAgentTitle?: string;
    readonly alertMessage?: string;
    readonly categoryText?: string;
    readonly iconBackgroundClassName?: string;
    readonly artefacts?: readonly { id: string; label: string; status: string }[];
    readonly actionName?: string;
    readonly isProcessing?: boolean;
    readonly hasOutputArtefacts?: boolean;
    readonly activeOutputClassName?: string;
    readonly progressText?: string;
    readonly isSelected?: boolean;
    readonly containerClassName?: string;
    readonly labelClassName?: string;
    readonly resizerLineClassName?: string;
    readonly resizerHandleClassName?: string;
    readonly handleClassName?: string;
    readonly ports?: readonly any[];
    readonly componentType?: string;
    readonly description?: string;
    readonly statusLabel?: string;
    readonly isStatusActive?: boolean;
    readonly VisualIcon?: any;
    readonly visualUrl?: string | null;
    readonly managerVisualUrl?: string | null;
    readonly agents?: readonly { id: string; title: string; visualUrl?: string | null }[];
    readonly processType?: string;
};

export type SpaceAgentViewModel = SpaceNodeViewModel;
export type SpaceAutomationViewModel = SpaceNodeViewModel;
export type SpaceCrewViewModel = SpaceNodeViewModel;
export type SpacePatternViewModel = SpaceNodeViewModel;
export type SpaceServiceViewModel = SpaceNodeViewModel;
export type SpaceTemplateViewModel = SpaceNodeViewModel;
export type SpaceZoneViewModel = SpaceNodeViewModel;
export type SpaceEntityViewModel = SpaceNodeViewModel;

export type WorkspaceUnitDisplayItem = {
    readonly identifier: string;
    readonly displayName: string;
    readonly hoverClassName: string;
    readonly onClick: () => void;
    readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
};

export type ComponentCategoryDisplayItem = {
    readonly id: string;
    readonly name: string;
    readonly items: readonly {
        readonly identifier: string;
        readonly displayName: string;
        readonly type: string;
        readonly zoneColor: string;
        readonly hoverClassName: string;
        readonly rawData: Record<string, unknown>;
        readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
    }[];
};

export type SpaceCanvasLeftSidebarProperties = {
    readonly componentSearchQuery: string;
    readonly setComponentSearchQuery: (query: string) => void;
    readonly returnToWorkspaceSelection: () => void;
    readonly workspaceUnitsForDisplay: readonly WorkspaceUnitDisplayItem[];
    readonly activeWorkspaceDisplayName: string;
    readonly activeWorkspaceHeaderClassName: string;
    readonly filteredComponentCategoriesForDisplay: readonly ComponentCategoryDisplayItem[];
    readonly currentlySelectedWorkspaceIdentifier: string | null;
    readonly onAddComponent: (nodeType: string, initialNodeData: Record<string, unknown>, targetWorkspaceId: string) => void;
};
