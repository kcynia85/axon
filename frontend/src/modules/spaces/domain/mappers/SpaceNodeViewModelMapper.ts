// frontend/src/modules/spaces/domain/mappers/SpaceNodeViewModelMapper.ts

import { Bot, Box, Cpu, FileText, Zap, LucideIcon } from "lucide-react";
import { 
    SpaceAgentDomainData, 
    SpaceAgentViewModel, 
    SpaceAutomationDomainData, 
    SpaceAutomationViewModel, 
    SpaceCrewDomainData, 
    SpaceCrewViewModel, 
    SpacePatternDomainData, 
    SpacePatternViewModel, 
    SpaceServiceDomainData, 
    SpaceServiceViewModel, 
    SpaceTemplateDomainData, 
    SpaceTemplateViewModel, 
    SpaceZoneDomainData, 
    SpaceZoneViewModel,
    SpaceEntityNodeDomainData,
    SpaceEntityViewModel,
    NodeVisualProperties
} from "../types";
import { getVisualStylesForZoneColor } from "../presentation_mappers";

const MAP_OF_NODE_TYPES_TO_VISUAL_ICONS: Record<string, LucideIcon> = {
    agent: Bot,
    pattern: Box,
    crew: Cpu,
    template: FileText,
    automation: Zap,
    service: Zap
};

const mapVisualProperties = (
    colorIdentifier: string, 
    isSelected: boolean
): NodeVisualProperties => {
    const styles = getVisualStylesForZoneColor(colorIdentifier);
    
    return {
        containerClassName: `w-[280px] bg-black border-2 transition-all rounded-2xl ${isSelected ? `${styles.borderClassName} ${styles.shadowClassName}` : 'border-zinc-700'}`,
        headerClassName: "p-4 flex items-start gap-3",
        iconClassName: "p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400",
        titleClassName: "text-sm font-black text-white tracking-tight",
        subtitleClassName: "text-[9px] font-black text-zinc-500 uppercase tracking-widest",
        handleClassName: "!w-2 !h-2 !border-zinc-800 !bg-zinc-500",
    };
};

export const mapAgentToViewModel = (data: SpaceAgentDomainData, isSelected: boolean): SpaceAgentViewModel => {
    return {
        visual: mapVisualProperties(data.zoneColor, isSelected),
        displayName: data.label,
        statusText: data.state.replace('_', ' ').toUpperCase(),
        progressValue: data.progress,
        progressLabel: `${data.progress}%`,
    };
};

export const mapAutomationToViewModel = (data: SpaceAutomationDomainData, isSelected: boolean): SpaceAutomationViewModel => {
    return {
        visual: mapVisualProperties(data.zoneColor, isSelected),
        displayName: data.label,
        statusText: data.state.toUpperCase(),
        artifactLabel: data.artifactName || 'data.json',
        artifactStatusText: data.state === 'completed' ? 'DONE' : 'IN PROGRESS',
        hasArtifact: !!data.artifactName,
    };
};

export const mapCrewToViewModel = (data: SpaceCrewDomainData, isSelected: boolean): SpaceCrewViewModel => {
    const visual = mapVisualProperties(data.zoneColor, isSelected);
    // Overriding container width for Crew
    const crewVisual = { ...visual, containerClassName: visual.containerClassName.replace('w-[280px]', 'w-[320px]') };

    return {
        visual: crewVisual,
        displayName: data.label,
        statusText: data.state.replace('_', ' ').toUpperCase(),
        teamRoles: data.roles || ['Web Researcher', 'Content Writer'],
        alertMessage: data.state === 'missing_context' ? 'Missing required context' : undefined,
        isWorking: data.state === 'working',
        isDone: data.state === 'done',
    };
};

export const mapPatternToViewModel = (data: SpacePatternDomainData, isSelected: boolean): SpacePatternViewModel => {
    const styles = getVisualStylesForZoneColor(data.zoneColor);
    return {
        visual: mapVisualProperties(data.zoneColor, isSelected),
        displayName: data.label,
        categoryText: 'STANDARD PATTERN',
        iconBackgroundClassName: styles.iconBackgroundClassName || 'bg-zinc-900',
    };
};

export const mapServiceToViewModel = (data: SpaceServiceDomainData, isSelected: boolean): SpaceServiceViewModel => {
    return {
        visual: mapVisualProperties(data.zoneColor, isSelected),
        displayName: data.label,
        statusText: (data.status || 'Active').toUpperCase(),
        actionName: data.actionName,
        isProcessing: data.status === 'in_progress',
    };
};

export const mapTemplateToViewModel = (data: SpaceTemplateDomainData, isSelected: boolean): SpaceTemplateViewModel => {
    const totalActions = data.actions?.length || 0;
    const completedActions = data.actions?.filter((action) => action.isCompleted).length || 0;
    const progressValue = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;

    return {
        visual: mapVisualProperties(data.zoneColor, isSelected),
        displayName: data.label,
        statusText: (data.status || 'Active').toUpperCase(),
        progressText: `${completedActions}/${totalActions} ACTIONS`,
        progressValue,
    };
};

export const mapZoneToViewModel = (data: SpaceZoneDomainData, isSelected: boolean): SpaceZoneViewModel => {
    const color = data.color || (data.type === 'discovery' ? 'purple' : 'blue');
    const styles = getVisualStylesForZoneColor(color);

    return {
        isSelected,
        displayName: (data.label || 'Unit').toUpperCase(),
        containerClassName: `h-full w-full rounded-[2rem] border-2 border-dashed transition-all p-8 flex flex-col relative group ${styles.borderClassName?.split(' ')[0]} ${isSelected ? styles.backgroundClassName : 'bg-transparent'}`,
        labelClassName: `text-[10px] font-black uppercase tracking-[0.25em] ${styles.textClassName}`,
        resizerLineClassName: styles.resizerLineClassName || 'border-blue-500',
        resizerHandleClassName: styles.resizerHandleClassName || 'border-blue-500',
        handleClassName: `!w-4 !h-4 !border-2 !border-zinc-800 ${styles.handleBackgroundClassName?.replace('border-', 'bg-')} !opacity-100 hover:scale-125 transition-all`,
    };
};

export const mapEntityToViewModel = (data: SpaceEntityNodeDomainData, isSelected: boolean): SpaceEntityViewModel => {
    const visual = mapVisualProperties(data.zoneColor, isSelected);
    // Entity nodes are slightly smaller in width by default in original code
    const entityVisual = { ...visual, containerClassName: visual.containerClassName.replace('w-[280px]', 'w-[240px]') };
    const VisualIcon = MAP_OF_NODE_TYPES_TO_VISUAL_ICONS[data.type] || Box;

    return {
        visual: entityVisual,
        displayName: data.label,
        componentType: data.type.toUpperCase(),
        description: data.description,
        statusLabel: data.type === 'agent' ? (data.status || 'Idle').toUpperCase() : undefined,
        isStatusActive: data.status === 'active',
        VisualIcon,
    };
};
