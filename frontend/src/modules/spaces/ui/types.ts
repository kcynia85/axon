// frontend/src/modules/spaces/ui/types.ts

import React from 'react';
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';
import { 
    SpaceAgentDomainData, 
    SpaceAutomationDomainData, 
    SpaceCrewDomainData, 
    SpaceServiceDomainData, 
    SpaceTemplateDomainData, 
    SpaceZoneDomainData,
    SpaceCanvasNodeInformation,
    SpacePatternBlueprint,
    ZoneInterfacePort
} from '../domain/types';

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
  readonly zoneColor: string;
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
  readonly zoneColor: string;
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
  readonly ports: readonly ZoneInterfacePort[];
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

export type SpaceCanvasHeaderProperties = {
    readonly activeSpaceDisplayName: string;
    readonly parentProjectDisplayName: string;
    readonly parentProjectIdentifier?: string;
};

export type SpaceCanvasViewProperties = {
  readonly workspaceId: string;
  readonly initialConfiguration?: unknown;
};

export type SpaceCanvasConnectionManagementLogic = {
  readonly handleNewConnectionCreated: (connection: Connection) => void;
  readonly validateConnectionBetweenNodes: (connection: Connection) => boolean;
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

export type SpaceCanvasRightSidebarProperties = {
    readonly currentlySelectedNodeInformation: SpaceCanvasNodeInformation | null;
    readonly handleNodeDataPropertyChange: (nodeUniqueIdentifier: string, updatedProperties: Record<string, unknown>) => void;
    readonly canvasNodes: Node[];
};

export type SpaceAgentInspectorProperties = {
    readonly data: SpaceAgentDomainData;
    readonly nodeId: string;
    readonly onStatusChange: (selection: unknown) => void;
    readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceCrewInspectorProperties = {
    readonly data: SpaceCrewDomainData;
    readonly nodeId: string;
    readonly onStatusChange: (selection: unknown) => void;
    readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceAutomationInspectorProperties = {
    readonly data: SpaceAutomationDomainData;
    readonly nodeId: string;
    readonly onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export type SpaceServiceInspectorProperties = {
    readonly data: SpaceServiceDomainData;
    readonly nodeId: string;
    readonly onArtifactStatusChange: (selection: unknown) => void;
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
    readonly onPropertyChange: (propertyName: string, propertyValue: unknown) => void;
    readonly canvasNodes?: Node[];
};

export type SpaceCanvasNodeProperties = {
    readonly id: string;
    readonly data: Record<string, unknown>;
    readonly selected?: boolean;
};

export type SpaceCanvasLeftSidebarProperties = {
    readonly onAddComponent?: (type: string, data: Record<string, unknown>, workspace: string) => void;
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
    readonly createPatternFromSelection: (name: string, description: string, type?: 'pattern' | 'super-pattern') => SpacePatternBlueprint;
    readonly instantiatePatternFromBlueprint: (blueprint: SpacePatternBlueprint, position: { x: number; y: number }) => void;
    readonly handleKeyDown: (event: React.KeyboardEvent) => void;
};

export type SpaceCanvasPresentationViewProperties = {
    readonly workspaceId: string;
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
    readonly createPatternFromSelection: (name: string, description: string, type?: 'pattern' | 'super-pattern') => SpacePatternBlueprint;
    readonly instantiatePatternFromBlueprint: (blueprint: SpacePatternBlueprint, position: { x: number; y: number }) => void;
    readonly handleKeyDown: (event: React.KeyboardEvent) => void;
};
