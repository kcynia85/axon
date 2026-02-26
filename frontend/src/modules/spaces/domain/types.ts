// frontend/src/modules/spaces/domain/types.ts

import React from 'react';
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';
import { WorkspaceColor } from './constants';

// --- Domain Models (Raw Business Data) ---

export type AgentPlanStep = {
  readonly id: string;
  readonly label: string;
  readonly status: 'pending' | 'working' | 'done';
};

export type AgentMetrics = {
  readonly tokens?: number;
  readonly cost?: number;
  readonly duration?: string;
};

export type SpaceAgentDomainData = {
  readonly label: string;
  readonly state: string;
  readonly progress: number;
  readonly zoneColor: WorkspaceColor;
  readonly plan_steps?: readonly AgentPlanStep[];
  readonly metrics?: AgentMetrics;
  readonly pending_question?: string;
  readonly context_requirements?: readonly TemplateContext[];
  readonly execution_logs?: readonly string[];
  readonly artefacts?: readonly TemplateArtefact[];
  readonly requires_consultation?: boolean;
  readonly consultation_questions?: readonly {
    readonly id: string;
    readonly question: string;
    readonly answer?: string;
  }[];
  readonly requires_alignment?: boolean;
  readonly alignment_summary?: string;
  readonly requires_critique?: boolean;
  readonly critique_notes?: readonly string[];
};

export type SpaceAutomationDomainData = {
  readonly label: string;
  readonly state: string;
  readonly artifactName?: string;
  readonly artifactStatus?: string;
  readonly artifactLabel?: string;
  readonly zoneColor: WorkspaceColor;
  readonly actions: readonly TemplateAction[];
  readonly contexts: readonly TemplateContext[];
  readonly artefacts: readonly TemplateArtefact[];
  readonly customActionsContent?: string;
};

export type CrewTask = {
  readonly id: string;
  readonly label: string;
  readonly status: 'pending' | 'working' | 'done';
  readonly assignedAgentTitle: string;
  readonly output?: string;
  readonly thought?: string; // What the agent is currently thinking/doing
};

export type SharedMemoryEntry = {
  readonly id: string;
  readonly fact: string;
  readonly sourceAgentTitle: string;
  readonly timestamp: string;
};

export type SpaceCrewDomainData = {
  readonly label: string;
  readonly state: string;
  readonly zoneColor: WorkspaceColor;
  readonly roles: readonly string[];
  readonly process_type?: 'sequential' | 'hierarchical' | 'parallel';
  readonly manager_title?: string;
  readonly tasks?: readonly CrewTask[];
  readonly active_agent_id?: string;
  readonly shared_memory?: readonly SharedMemoryEntry[];
  readonly execution_logs?: readonly string[];
  readonly artefacts?: readonly TemplateArtefact[];
  readonly context_requirements?: readonly TemplateContext[];
  readonly requires_consultation?: boolean;
  readonly consultation_questions?: readonly {
    readonly id: string;
    readonly question: string;
    readonly answer?: string;
  }[];
  readonly metrics?: AgentMetrics;
};

export type SpacePatternDomainData = {
  readonly label: string;
  readonly zoneColor: WorkspaceColor;
};

export type SpaceServiceDomainData = {
  readonly label: string;
  readonly actionName: string;
  readonly capabilities?: readonly string[];
  readonly contexts?: readonly TemplateContext[];
  readonly artefacts?: readonly TemplateArtefact[];
  readonly status?: string;
  readonly artifactStatus?: string;
  readonly zoneColor: WorkspaceColor;
};

export type TemplateAction = {
  readonly id: string;
  readonly label: string;
  readonly isCompleted: boolean;
  readonly section?: string;
};

export type TemplateContext = {
  readonly id: string;
  readonly label: string;
  readonly link?: string;
  readonly expectedType?: 'json' | 'csv' | 'zip' | 'image' | 'any'; // Added type for filtering
  readonly sourceNodeLabel?: string;
  readonly sourceArtifactLabel?: string;
};

export type TemplateArtefact = {
  readonly id: string;
  readonly label: string;
  readonly link?: string;
  readonly content?: string; // Rich text content from BlockNote
  readonly status: 'in_review' | 'approved';
  readonly isOutput?: boolean;
};

export type SpaceTemplateDomainData = {
  readonly label: string;
  readonly status: string;
  readonly actions: readonly TemplateAction[];
  readonly contexts: readonly TemplateContext[];
  readonly artefacts: readonly TemplateArtefact[];
  readonly zoneColor: WorkspaceColor;
  readonly customActionsContent?: string;
};

export type SpaceZoneDomainData = {
  readonly label: string;
  readonly type: string;
  readonly color?: WorkspaceColor;
  readonly requiredContext?: string;
  readonly outputArtifact?: string;
};

export type SpaceEntityNodeDomainData = {
  readonly label: string;
  readonly type: string;
  readonly zoneColor: WorkspaceColor;
  readonly description?: string;
  readonly status?: string;
};

export type SpaceCanvasNodeInformation = {
  readonly id: string;
  readonly type: string;
  readonly data: Record<string, unknown>;
};

// --- View Models (Pure Presentation Data) ---

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

export type SpaceAgentViewModel = {
  readonly visual: NodeVisualProperties;
  readonly displayName: string;
  readonly statusText: string;
  readonly progressValue: number;
  readonly progressLabel: string;
  readonly isBriefing: boolean;
  readonly isWorking: boolean;
  readonly isDone: boolean;
  readonly isConsultation: boolean;
  readonly isAlignment: boolean;
  readonly isCritique: boolean;
  readonly isMissingContext: boolean;
};

export type SpaceAutomationViewModel = {
  readonly visual: NodeVisualProperties;
  readonly displayName: string;
  readonly statusText: string;
  readonly artifactLabel: string;
  readonly artifactStatusText: string;
  readonly hasArtifact: boolean;
  readonly hasOutputArtefacts: boolean;
  readonly activeOutputClassName: string;
};

export type SpaceCrewViewModel = {
  readonly visual: NodeVisualProperties;
  readonly displayName: string;
  readonly statusText: string;
  readonly teamRoles: readonly string[];
  readonly activeAgentTitle?: string;
  readonly alertMessage?: string;
  readonly isWorking: boolean;
  readonly isConsultation: boolean;
  readonly isBriefing: boolean;
  readonly isMissingContext: boolean;
  readonly isDone: boolean;
  readonly progressValue: number;
  readonly progressLabel: string;
};

export type SpacePatternViewModel = {
  readonly visual: NodeVisualProperties;
  readonly displayName: string;
  readonly categoryText: string;
  readonly iconBackgroundClassName: string;
};

export type SpaceServiceViewModel = {
  readonly visual: NodeVisualProperties;
  readonly displayName: string;
  readonly actionName: string;
  readonly isProcessing: boolean;
  readonly artefacts: readonly { readonly id: string; readonly label: string; readonly status: string }[];
  readonly hasOutputArtefacts: boolean;
  readonly activeOutputClassName: string;
};

export type SpaceTemplateViewModel = {
  readonly visual: NodeVisualProperties;
  readonly displayName: string;
  readonly statusText: string;
  readonly progressText: string;
  readonly progressValue: number;
  readonly artifactLabel: string;
  readonly artifactStatusText: string;
  readonly hasArtifact: boolean;
  readonly hasOutputArtefacts: boolean;
  readonly activeOutputClassName: string;
};

export type SpaceZoneViewModel = {
  readonly isSelected: boolean;
  readonly displayName: string;
  readonly containerClassName: string;
  readonly labelClassName: string;
  readonly resizerLineClassName: string;
  readonly resizerHandleClassName: string;
  readonly handleClassName: string;
};

export type SpaceEntityViewModel = {
  readonly visual: NodeVisualProperties;
  readonly displayName: string;
  readonly componentType: string;
  readonly description?: string;
  readonly statusLabel?: string;
  readonly isStatusActive: boolean;
  readonly VisualIcon: React.ComponentType<{ size?: number; className?: string }>;
};

// --- Component Property Types ---

export type SpaceCanvasNodeProperties = Node;

export type SpaceCanvasViewProperties = {
  readonly initialConfiguration?: unknown;
};

export type SpaceCanvasHeaderProperties = {
  readonly activeSpaceDisplayName: string;
  readonly parentProjectDisplayName: string;
  readonly parentProjectIdentifier?: string;
};

export type SpaceCanvasLeftSidebarProperties = {
  readonly onAddComponent?: (type: string, data: Record<string, unknown>, workspace: string) => void;
};

export type SpaceCanvasRightSidebarProperties = {
  readonly currentlySelectedNodeInformation: SpaceCanvasNodeInformation | null;
  readonly handleNodeDataPropertyChange: (nodeId: string, properties: Record<string, unknown>) => void;
};

// --- Inspector Properties ---

export type SelectionChangeHandler = (selection: unknown) => void;

export type SpaceAgentInspectorProperties = {
  readonly data: SpaceAgentDomainData;
  readonly nodeId: string;
  readonly onStatusChange: SelectionChangeHandler;
  readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceAutomationInspectorProperties = {
  readonly data: SpaceAutomationDomainData;
  readonly nodeId: string;
  readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceCrewInspectorProperties = {
  readonly data: SpaceCrewDomainData;
  readonly nodeId: string;
  readonly onStatusChange: SelectionChangeHandler;
  readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceTemplateInspectorProperties = {
  readonly data: SpaceTemplateDomainData;
  readonly nodeId: string;
  readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceZoneInspectorProperties = {
  readonly data: SpaceZoneDomainData;
  readonly nodeId: string;
  readonly onPropertyChange: (name: string, value: string) => void;
};

export type SpacePatternNodeInspectorProperties = {
  readonly patternNodeInformation: SpaceCanvasNodeInformation;
};
export type SpaceServiceInspectorProperties = {
  readonly data: SpaceServiceDomainData;
  readonly nodeId: string;
  readonly onArtifactStatusChange: SelectionChangeHandler;
  readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceCanvasStateConfiguration = {
  readonly canvasNodes: Node[];
  readonly canvasEdges: Edge[];
  readonly updateCanvasNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  readonly updateCanvasEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  readonly handleCanvasNodesChange: OnNodesChange;
  readonly handleCanvasEdgesChange: OnEdgesChange;
  readonly currentlySelectedNode: Node | null;
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
  readonly addNewNodeToCanvas: (type: string, data: Record<string, unknown>, workspace: string) => void;
  readonly updateNodeDataOnCanvas: (nodeId: string, data: Record<string, unknown>) => void;
  readonly currentlySelectedNode: Node | null;
  readonly duplicateNode: (node: Node) => void;
  readonly deleteNodes: (nodeIds: string[]) => void;
  readonly updateNodesStatus: (nodeIds: string[], status: string) => void;
  readonly copyNodes: (nodes: Node[]) => void;
  readonly cutNodes: (nodes: Node[]) => void;
  readonly pasteNodes: (position?: { x: number; y: number }) => void;
};
