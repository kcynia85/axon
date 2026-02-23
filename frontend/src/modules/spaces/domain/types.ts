// frontend/src/modules/spaces/domain/types.ts

import React from 'react';
import type { Node } from '@xyflow/react';
import { WorkspaceColor } from './constants';

// --- Domain Models (Raw Business Data) ---

export type SpaceAgentDomainData = {
  readonly label: string;
  readonly state: string;
  readonly progress: number;
  readonly zoneColor: WorkspaceColor;
};

export type SpaceAutomationDomainData = {
  readonly label: string;
  readonly state: string;
  readonly artifactName?: string;
  readonly artifactStatus?: string;
  readonly artifactLabel?: string;
  readonly zoneColor: WorkspaceColor;
};

export type SpaceCrewDomainData = {
  readonly label: string;
  readonly state: string;
  readonly zoneColor: WorkspaceColor;
  readonly roles: readonly string[];
};

export type SpacePatternDomainData = {
  readonly label: string;
  readonly zoneColor: WorkspaceColor;
};

export type SpaceServiceDomainData = {
  readonly label: string;
  readonly actionName: string;
  readonly status?: string;
  readonly artifactStatus?: string;
  readonly zoneColor: WorkspaceColor;
};

export type SpaceTemplateDomainData = {
  readonly label: string;
  readonly status: string;
  readonly completedActions: number;
  readonly totalActions: number;
  readonly zoneColor: WorkspaceColor;
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
};

export type SpaceAutomationViewModel = {
    readonly visual: NodeVisualProperties;
    readonly displayName: string;
    readonly statusText: string;
    readonly artifactLabel: string;
    readonly artifactStatusText: string;
    readonly hasArtifact: boolean;
};

export type SpaceCrewViewModel = {
    readonly visual: NodeVisualProperties;
    readonly displayName: string;
    readonly statusText: string;
    readonly teamRoles: readonly string[];
    readonly alertMessage?: string;
    readonly isWorking: boolean;
    readonly isDone: boolean;
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
    readonly statusText: string;
    readonly actionName: string;
    readonly isProcessing: boolean;
};

export type SpaceTemplateViewModel = {
    readonly visual: NodeVisualProperties;
    readonly displayName: string;
    readonly statusText: string;
    readonly progressText: string;
    readonly progressValue: number;
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
};

export type SpaceAutomationInspectorProperties = {
    readonly data: SpaceAutomationDomainData;
    readonly nodeId: string;
    readonly onArtifactStatusChange: SelectionChangeHandler;
};

export type SpaceCrewInspectorProperties = {
    readonly data: SpaceCrewDomainData;
    readonly nodeId: string;
    readonly onStatusChange: SelectionChangeHandler;
};

export type SpaceTemplateInspectorProperties = {
    readonly data: SpaceTemplateDomainData;
    readonly nodeId: string;
    readonly onPropertyChange: (name: string, value: unknown) => void;
};

export type SpaceZoneInspectorProperties = {
    readonly data: SpaceZoneDomainData;
    readonly nodeId: string;
    readonly onPropertyChange: (name: string, value: string) => void;
};

export type SpacePatternNodeInspectorProperties = {
    readonly patternNodeInformation: SpaceCanvasNodeInformation;
};
