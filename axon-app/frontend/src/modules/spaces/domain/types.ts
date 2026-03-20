// frontend/src/modules/spaces/domain/types.ts

import { WorkspaceColor } from './constants';
import { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';

export type PatternInterfacePort = {
  readonly id: string;
  readonly label: string;
  readonly type: 'input' | 'output';
  readonly dataType: string;
  readonly sourceNodeId?: string;
};

export type PatternExternalDependency = {
  readonly zoneId: string;
  readonly zoneLabel: string;
  readonly connectedNodeIds: readonly string[];
};

/**
 * Generic Node structure for domain-level operations.
 * Decoupled from any specific UI library.
 */
export type DomainNode = {
  readonly id: string;
  readonly type?: string;
  readonly parentId?: string;
  readonly position: { readonly x: number; readonly y: number };
  readonly data: Record<string, unknown>;
  readonly measured?: { readonly width?: number; readonly height?: number };
  readonly style?: Record<string, unknown>;
  readonly selected?: boolean;
};

/**
 * Generic Edge structure for domain-level operations.
 */
export type DomainEdge = {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly sourceHandle?: string;
  readonly targetHandle?: string;
  readonly type?: string;
  readonly style?: Record<string, unknown>;
};

export type SpacePatternBlueprint = {
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly type: 'pattern' | 'super-pattern';
  readonly createdAt: string;
  readonly structure: {
    readonly nodes: readonly DomainNode[];
    readonly edges: readonly DomainEdge[];
  };
  readonly interface: {
    readonly ports: readonly PatternInterfacePort[];
  };
  readonly dependencies: readonly PatternExternalDependency[];
};

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
  readonly thought?: string;
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
  readonly expectedType?: 'json' | 'csv' | 'zip' | 'image' | 'any';
  readonly sourceNodeLabel?: string;
  readonly sourceArtifactLabel?: string;
};

export type TemplateArtefact = {
  readonly id: string;
  readonly label: string;
  readonly link?: string;
  readonly content?: string;
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

export type ZoneInterfacePort = {
  readonly id: string;
  readonly label: string;
  readonly type: 'input' | 'output';
  readonly dataType: string;
  readonly status?: 'idle' | 'data_ready' | 'error';
};

export type PortMapping = {
  readonly childNodeId: string;
  readonly portId: string;
};

export type SpaceZoneDomainData = {
  readonly label: string;
  readonly type: string;
  readonly color?: WorkspaceColor;
  readonly requiredContext?: string;
  readonly outputArtifact?: string;
  readonly ports?: readonly ZoneInterfacePort[];
  readonly mappings?: readonly PortMapping[];
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

export type SpaceCanvasNodeProperties = {
    readonly id: string;
    readonly data: Record<string, unknown>;
    readonly selected?: boolean;
};

export type SpaceCanvasConnectionManagementLogic = {
    readonly handleNewConnectionCreated: (connection: Connection) => void;
    readonly validateConnectionBetweenNodes: (connection: Connection) => boolean;
};

export type SpaceCanvasStateConfiguration = {
    readonly canvasNodes: Node[];
    readonly canvasEdges: Edge[];
    readonly updateCanvasNodes: (nodes: Node[] | ((current: Node[]) => Node[])) => void;
    readonly updateCanvasEdges: (edges: Edge[] | ((current: Edge[]) => Edge[])) => void;
    readonly handleCanvasNodesChange: OnNodesChange;
    readonly handleCanvasEdgesChange: OnEdgesChange;
    readonly currentlySelectedNode: Node | null;
};

// UI Models
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
    readonly isMissingContext?: boolean;
    readonly zoneColor?: string;
    readonly artifactLabel?: string;
    readonly artifactStatusText?: string;
    readonly hasArtifact?: boolean;
    readonly teamRoles?: readonly string[];
    readonly activeAgentTitle?: string;
    readonly categoryText?: string;
    readonly iconBackgroundClassName?: string;
    readonly artefacts?: readonly { id: string; label: string; status: string }[];
    readonly isProcessing?: boolean;
    readonly hasOutputArtefacts?: boolean;
    readonly activeOutputClassName?: string;
    readonly progressText?: string;
    readonly isSelected?: boolean;
    readonly containerClassName?: string;
    readonly labelClassName?: string;
    readonly resizerLineClassName?: string;
    readonly resizerHandleClassName?: string;
    readonly ports?: readonly any[];
    readonly componentType?: string;
    readonly description?: string;
    readonly statusLabel?: string;
    readonly isStatusActive?: boolean;
    readonly VisualIcon?: any;
};

export type SpaceAgentViewModel = SpaceNodeViewModel;
export type SpaceAutomationViewModel = SpaceNodeViewModel;
export type SpaceCrewViewModel = SpaceNodeViewModel;
export type SpacePatternViewModel = SpaceNodeViewModel;
export type SpaceServiceViewModel = SpaceNodeViewModel;
export type SpaceTemplateViewModel = SpaceNodeViewModel;
export type SpaceZoneViewModel = SpaceNodeViewModel;
export type SpaceEntityViewModel = SpaceNodeViewModel;
