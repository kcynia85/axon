// frontend/src/modules/spaces/ui/mappers/SpaceNodeViewModelMapper.ts

import { Bot, Box, Cpu, FileText, Zap, LucideIcon } from "lucide-react";
import {
    SpaceAgentDomainData,
    SpaceAutomationDomainData,
    SpaceCrewDomainData,
    SpacePatternDomainData,
    SpaceServiceDomainData,
    SpaceTemplateDomainData,
    SpaceZoneDomainData,
    SpaceEntityNodeDomainData,
} from "../../domain/types";
import {
    SpaceAgentViewModel,
    SpaceAutomationViewModel,
    SpaceCrewViewModel,
    SpacePatternViewModel,
    SpaceServiceViewModel,
    SpaceTemplateViewModel,
    SpaceZoneViewModel,
    SpaceEntityViewModel,
    NodeVisualProperties
} from "../types";
import { getVisualStylesForZoneColor } from "../utils/presentation_mappers";

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
    const visualStyles = getVisualStylesForZoneColor(colorIdentifier);
    const handleBackgroundColor = isSelected ? visualStyles.handleBackgroundClassName : '!bg-zinc-700';

    return {
        containerClassName: `w-[280px] bg-black border-2 transition-all rounded-2xl node-container ${isSelected ? `${visualStyles.borderClassName} ${visualStyles.shadowClassName}` : 'border-zinc-700'}`,
        headerClassName: "p-4 flex items-start gap-3 node-header",
        iconClassName: `p-2 rounded-lg bg-zinc-900 border border-zinc-800 node-icon ${visualStyles.textClassName}`,
        titleClassName: "text-sm font-black text-white tracking-tight node-title",
        subtitleClassName: "text-[9px] font-black text-zinc-500 uppercase tracking-widest node-subtitle",
        handleClassName: `!w-3 !h-3 !border-zinc-800 ${handleBackgroundColor} hover:!bg-zinc-200 transition-colors !z-50 !cursor-pointer`,
    };
};

export const mapAgentToViewModel = (agentDomainData: SpaceAgentDomainData, isSelected: boolean): SpaceAgentViewModel => {
    return {
        visual: mapVisualProperties(agentDomainData.zoneColor as any, isSelected),
        zoneColor: agentDomainData.zoneColor,
        displayName: agentDomainData.label,
        statusText: agentDomainData.state.replace('_', ' ').toUpperCase(),
        progressValue: agentDomainData.progress,
        progressLabel: `${agentDomainData.progress}%`,
        isBriefing: agentDomainData.state === 'briefing',
        isWorking: agentDomainData.state === 'working',
        isDone: agentDomainData.state === 'done',
        isConsultation: agentDomainData.state === 'conversation',
        isAlignment: agentDomainData.state === 'alignment',
        isCritique: agentDomainData.state === 'critique',
        isMissingContext: agentDomainData.state === 'missing_context',
        VisualIcon: MAP_OF_NODE_TYPES_TO_VISUAL_ICONS.agent,
    };
};

export const mapAutomationToViewModel = (automationDomainData: SpaceAutomationDomainData, isSelected: boolean): SpaceAutomationViewModel => {
    const artefactsList = automationDomainData.artefacts || [];
    const outputArtefactItem = artefactsList.find(artefactItem => artefactItem.isOutput) || artefactsList[0];

    const hasOutputArtefacts = artefactsList.some(artefactItem => artefactItem.isOutput);
    const visualStyles = getVisualStylesForZoneColor(automationDomainData.zoneColor);

    return {
        visual: mapVisualProperties(automationDomainData.zoneColor as any, isSelected),
        displayName: automationDomainData.label,
        statusText: automationDomainData.state.toUpperCase(),
        artifactLabel: outputArtefactItem?.label || 'no results',
        artifactStatusText: (outputArtefactItem?.status || 'in_review').replace('_', ' ').toUpperCase(),
        hasArtifact: !!outputArtefactItem,
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        VisualIcon: MAP_OF_NODE_TYPES_TO_VISUAL_ICONS.automation,
    };
};

export const mapCrewToViewModel = (crewDomainData: SpaceCrewDomainData, isSelected: boolean): SpaceCrewViewModel => {
    const visualProperties = mapVisualProperties(crewDomainData.zoneColor as any, isSelected);
    // Overriding container width for Crew
    const crewVisualProperties = { ...visualProperties, containerClassName: visualProperties.containerClassName.replace('w-[280px]', 'w-[320px]') };

    const totalTasksCount = crewDomainData.tasks?.length || 0;
    const completedTasksCount = crewDomainData.tasks?.filter(taskItem => taskItem.status === 'done').length || 0;
    const progressPercentageValue = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    const activeTaskItem = crewDomainData.tasks?.find(taskItem => taskItem.status === 'working');
    const activeAgentTitleText = activeTaskItem?.assignedAgentTitle;

    const statusDisplayMap: Record<string, string> = {
        'missing_context': 'Context Missing',
        'briefing': 'Briefing...',
        'working': 'Working...',
        'done': 'Done',
        'conversation': 'Needs Input'
    };

    return {
        visual: crewVisualProperties,
        zoneColor: crewDomainData.zoneColor,
        displayName: crewDomainData.label,
        statusText: statusDisplayMap[crewDomainData.state] || crewDomainData.state.replace('_', ' ').toUpperCase(),
        teamRoles: crewDomainData.roles || ['Web Researcher', 'Content Writer'],
        activeAgentTitle: activeAgentTitleText,
        alertMessage: crewDomainData.state === 'missing_context' ? 'Missing required context' : undefined,
        isWorking: crewDomainData.state === 'working',
        isConsultation: crewDomainData.state === 'conversation',
        isBriefing: crewDomainData.state === 'briefing',
        isMissingContext: crewDomainData.state === 'missing_context',
        isDone: crewDomainData.state === 'done',
        progressValue: progressPercentageValue,
        progressLabel: `${progressPercentageValue}%`,
        VisualIcon: MAP_OF_NODE_TYPES_TO_VISUAL_ICONS.crew,
    };
};

export const mapPatternToViewModel = (patternDomainData: SpacePatternDomainData, isSelected: boolean): SpacePatternViewModel => {
    const visualStyles = getVisualStylesForZoneColor(patternDomainData.zoneColor);
    return {
        visual: mapVisualProperties(patternDomainData.zoneColor as any, isSelected),
        displayName: patternDomainData.label,
        categoryText: 'STANDARD PATTERN',
        iconBackgroundClassName: visualStyles.iconBackgroundClassName || 'bg-zinc-900',
        VisualIcon: MAP_OF_NODE_TYPES_TO_VISUAL_ICONS.pattern,
    };
};

export const mapServiceToViewModel = (serviceDomainData: SpaceServiceDomainData, isSelected: boolean): SpaceServiceViewModel => {
    const hasOutputArtefacts = (serviceDomainData.artefacts || []).some(artefactItem => artefactItem.isOutput);
    const visualStyles = getVisualStylesForZoneColor(serviceDomainData.zoneColor);

    return {
        visual: mapVisualProperties(serviceDomainData.zoneColor as any, isSelected),
        displayName: serviceDomainData.label,
        actionName: serviceDomainData.actionName,
        isProcessing: serviceDomainData.status === 'in_progress',
        artefacts: (serviceDomainData.artefacts || []).map(artefactItem => ({
            id: artefactItem.id,
            label: artefactItem.label || 'no results',
            status: (artefactItem.status || 'in_review').replace('_', ' ').toUpperCase(),
        })),
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        VisualIcon: MAP_OF_NODE_TYPES_TO_VISUAL_ICONS.service,
    };
};

export const mapTemplateToViewModel = (templateDomainData: SpaceTemplateDomainData, isSelected: boolean): SpaceTemplateViewModel => {
    const totalActionsCount = templateDomainData.actions?.length || 0;
    const completedActionsCount = templateDomainData.actions?.filter((actionItem) => actionItem.isCompleted).length || 0;
    const progressPercentageValue = totalActionsCount > 0 ? (completedActionsCount / totalActionsCount) * 100 : 0;

    const artefactsList = templateDomainData.artefacts || [];
    const outputArtefactItem = artefactsList.find(artefactItem => artefactItem.isOutput) || artefactsList[0];

    const hasOutputArtefacts = artefactsList.some(artefactItem => artefactItem.isOutput);
    const visualStyles = getVisualStylesForZoneColor(templateDomainData.zoneColor);

    return {
        visual: mapVisualProperties(templateDomainData.zoneColor as any, isSelected),
        displayName: templateDomainData.label,
        statusText: (templateDomainData.status || 'Active').toUpperCase(),
        progressText: `${completedActionsCount}/${totalActionsCount} ACTIONS`,
        progressValue: progressPercentageValue,
        artifactLabel: outputArtefactItem?.label || 'no results',
        artifactStatusText: (outputArtefactItem?.status || 'in_review').replace('_', ' ').toUpperCase(),
        hasArtifact: !!outputArtefactItem,
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        VisualIcon: MAP_OF_NODE_TYPES_TO_VISUAL_ICONS.template,
    };
};

export const mapZoneToViewModel = (zoneDomainData: SpaceZoneDomainData, isSelected: boolean): SpaceZoneViewModel => {
    const colorIdentifier = zoneDomainData.color || 'blue';
    const visualStyles = getVisualStylesForZoneColor(colorIdentifier);

    return {
        visual: mapVisualProperties(colorIdentifier, isSelected),
        isSelected,
        displayName: (zoneDomainData.label || 'Unit').toUpperCase(),
        containerClassName: `h-full w-full rounded-[2rem] border-2 border-dashed transition-all p-8 flex flex-col relative group ${visualStyles.borderClassName?.split(' ')[0]} ${isSelected ? visualStyles.backgroundClassName : 'bg-transparent'}`,
        labelClassName: `text-[10px] font-black uppercase tracking-[0.25em] ${visualStyles.textClassName}`,
        resizerLineClassName: visualStyles.resizerLineClassName || 'border-blue-500',
        resizerHandleClassName: visualStyles.resizerHandleClassName || 'border-blue-500',
        handleClassName: `!w-6 !h-6 !border-2 !border-zinc-800 ${visualStyles.handleBackgroundClassName?.replace('border-', 'bg-')} !opacity-100 hover:scale-110 transition-all !z-50 !cursor-pointer`,
        ports: zoneDomainData.ports || [],
        VisualIcon: Box,
    };
};

export const mapEntityToViewModel = (entityDomainData: SpaceEntityNodeDomainData, isSelected: boolean): SpaceEntityViewModel => {
    const visualProperties = mapVisualProperties(entityDomainData.zoneColor, isSelected);
    // Entity nodes are slightly smaller in width by default in original code
    const entityVisualProperties = { ...visualProperties, containerClassName: visualProperties.containerClassName.replace('w-[280px]', 'w-[240px]') };
    const VisualIcon = MAP_OF_NODE_TYPES_TO_VISUAL_ICONS[entityDomainData.type] || Box;

    return {
        visual: entityVisualProperties,
        displayName: entityDomainData.label,
        componentType: entityDomainData.type.toUpperCase(),
        description: entityDomainData.description,
        statusLabel: entityDomainData.type === 'agent' ? (entityDomainData.status || 'Idle').toUpperCase() : undefined,
        isStatusActive: entityDomainData.status === 'active',
        VisualIcon,
    };
};
