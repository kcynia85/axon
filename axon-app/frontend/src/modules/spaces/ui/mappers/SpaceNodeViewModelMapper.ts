// frontend/src/modules/spaces/ui/mappers/SpaceNodeViewModelMapper.ts

import { Bot, Box, Users, FileText, Zap, LucideIcon, Cloud } from "lucide-react";
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

const mapVisualProperties = (
    colorIdentifier: string,
    isSelected: boolean
): NodeVisualProperties => {
    const visualStyles = getVisualStylesForZoneColor(colorIdentifier);
    const handleBackgroundColor = isSelected ? visualStyles.handleBackgroundClassName : '!bg-zinc-700';

    return {
        containerClassName: `w-[280px] bg-black border-2 transition-all rounded-2xl node-container ${isSelected ? `${visualStyles.borderSelectedClassName} ${visualStyles.shadowClassName}` : 'border-zinc-700'}`,
        headerClassName: "p-4 flex items-start gap-3 node-header",
        iconClassName: `p-2 rounded-lg bg-zinc-900 border border-zinc-800 node-icon text-zinc-400`,
        titleClassName: "text-sm font-black text-white tracking-tight node-title",
        subtitleClassName: "text-[9px] font-black text-zinc-500 uppercase tracking-widest node-subtitle",
        handleClassName: `!w-3 !h-3 !border-zinc-800 ${handleBackgroundColor} hover:!bg-zinc-200 transition-colors !z-50 !cursor-pointer`,
        borderSelectedClassName: visualStyles.borderSelectedClassName,
    };
};

export const mapAgentToViewModel = (agentDomainData: SpaceAgentDomainData, isSelected: boolean): SpaceAgentViewModel => {
    const artefactsList = agentDomainData.artefacts || [];
    const hasOutputArtefacts = artefactsList.some(artefactItem => artefactItem.isOutput);
    const visualStyles = getVisualStylesForZoneColor(agentDomainData.zoneColor);
    
    const stateValue = agentDomainData.state || (agentDomainData as any).status || 'idle';

    return {
        visual: mapVisualProperties(agentDomainData.zoneColor, isSelected),
        zoneColor: agentDomainData.zoneColor,
        displayName: agentDomainData.label || 'Agent',
        statusText: stateValue.replace('_', ' ').toUpperCase(),
        progressValue: agentDomainData.progress || 0,
        progressLabel: `${agentDomainData.progress || 0}%`,
        isBriefing: stateValue === 'briefing',
        isWorking: stateValue === 'working',
        isDone: stateValue === 'done',
        isConsultation: stateValue === 'conversation',
        isAlignment: stateValue === 'alignment',
        isCritique: stateValue === 'critique',
        isMissingContext: stateValue === 'missing_context',
        VisualIcon: Bot,
        visualUrl: agentDomainData.agent_visual_url,
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        knowledgeHubIds: agentDomainData.knowledge_hub_ids,
        llm_model_id: agentDomainData.llm_model_id,
    };
};

export const mapAutomationToViewModel = (automationDomainData: SpaceAutomationDomainData, isSelected: boolean): SpaceAutomationViewModel => {
    const artefactsList = automationDomainData.artefacts || [];
    const outputArtefactItem = artefactsList.find(artefactItem => artefactItem.isOutput) || artefactsList[0];

    const hasOutputArtefacts = artefactsList.some(artefactItem => artefactItem.isOutput);
    const visualStyles = getVisualStylesForZoneColor(automationDomainData.zoneColor);
    
    const stateValue = automationDomainData.state || (automationDomainData as any).status || 'idle';

    return {
        visual: mapVisualProperties(automationDomainData.zoneColor, isSelected),
        displayName: automationDomainData.label || 'Automation',
        statusText: stateValue.toUpperCase(),
        artifactLabel: outputArtefactItem?.label || 'no results',
        artifactStatusText: (outputArtefactItem?.status || 'in_review').replace('_', ' ').toUpperCase(),
        hasArtifact: !!outputArtefactItem,
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        VisualIcon: Zap,
    };
};

export const mapCrewToViewModel = (
    crewDomainData: SpaceCrewDomainData, 
    isSelected: boolean,
    availableCrews?: readonly any[]
): SpaceCrewViewModel => {
    const visualProperties = mapVisualProperties(crewDomainData.zoneColor, isSelected);
    // Overriding container width for Crew to accommodate badge and multiple avatars
    const crewVisualProperties = { ...visualProperties, containerClassName: visualProperties.containerClassName.replace('w-[280px]', 'w-[360px]') };

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

    const artefactsList = crewDomainData.artefacts || [];
    const hasOutputArtefacts = artefactsList.some(artefactItem => artefactItem.isOutput);
    const visualStyles = getVisualStylesForZoneColor(crewDomainData.zoneColor);

    // DENSE MAPPING: Try to get agents from all possible sources
    const rawMembers = crewDomainData.resolved_members || (crewDomainData as any)._resolved_members || (crewDomainData as any).members || [];
    const rawTasks = crewDomainData.tasks || [];
    const rawRoles = crewDomainData.roles || [];
    
    let agents: { id: string; title: string; visualUrl?: string | null }[] = [];
    
    // Attempt to hydrate from resolved members or task assignments
    if (rawMembers.length > 0) {
        agents = rawMembers.map((member: any) => ({
            id: member.id || member.agent_id || Math.random().toString(),
            title: member.role || member.title || member.agent_name || member.agent_role_text || "Agent",
            visualUrl: member.visualUrl || member.agent_visual_url || member.avatar_url
        }));
    } else if (rawTasks.length > 0) {
        agents = rawTasks.map((task: any) => ({
            id: task.id || Math.random().toString(),
            title: task.assignedAgentTitle || "Agent",
            visualUrl: task.visualUrl
        }));
    } else if (rawRoles.length > 0) {
        // Fallback: Use roles if agents list is empty
        agents = rawRoles.map((role: string) => ({
            id: Math.random().toString(),
            title: role,
        }));
    }

    const stateValue = crewDomainData.state || (crewDomainData as any).status || 'idle';
    const managerData = crewDomainData.resolved_manager || (crewDomainData as any)._resolved_manager;

    return {
        visual: crewVisualProperties,
        zoneColor: crewDomainData.zoneColor,
        displayName: crewDomainData.label || (crewDomainData as any).crew_name || 'Crew',
        statusText: (statusDisplayMap[stateValue] || stateValue.replace('_', ' ').toUpperCase()),
        teamRoles: rawRoles.length > 0 ? rawRoles : (agents.length > 0 ? agents.map((a: any) => a.title) : ['Pending...']),
        agents: agents.length > 0 ? agents : [{ id: 'fallback', title: 'Awaiting sync...' }],
        activeAgentTitle: activeAgentTitleText,
        processType: crewDomainData.process_type || (crewDomainData as any).crew_process_type || 'Sequential',
        managerVisualUrl: crewDomainData.manager_visual_url || managerData?.visualUrl || managerData?.agent_visual_url,
        alertMessage: stateValue === 'missing_context' ? 'Missing required context' : undefined,
        isWorking: stateValue === 'working',
        isConsultation: stateValue === 'conversation',
        isBriefing: stateValue === 'briefing',
        isMissingContext: stateValue === 'missing_context',
        isDone: stateValue === 'done',
        progressValue: progressPercentageValue,
        progressLabel: `${progressPercentageValue}%`,
        VisualIcon: Users,
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        knowledgeHubIds: crewDomainData.knowledge_hub_ids,
    };
};

export const mapPatternToViewModel = (patternDomainData: SpacePatternDomainData, isSelected: boolean): SpacePatternViewModel => {
    const visualStyles = getVisualStylesForZoneColor(patternDomainData.zoneColor);
    return {
        visual: mapVisualProperties(patternDomainData.zoneColor, isSelected),
        displayName: patternDomainData.label || 'Pattern',
        categoryText: 'STANDARD PATTERN',
        iconBackgroundClassName: visualStyles.iconBackgroundClassName || 'bg-zinc-900',
        VisualIcon: Box,
    };
};

export const mapServiceToViewModel = (serviceDomainData: SpaceServiceDomainData, isSelected: boolean): SpaceServiceViewModel => {
    const hasOutputArtefacts = (serviceDomainData.artefacts || []).some(artefactItem => artefactItem.isOutput);
    const visualStyles = getVisualStylesForZoneColor(serviceDomainData.zoneColor);

    const stateValue = serviceDomainData.status || (serviceDomainData as any).state || 'idle';

    return {
        visual: mapVisualProperties(serviceDomainData.zoneColor, isSelected),
        displayName: serviceDomainData.label || 'Service',
        actionName: serviceDomainData.actionName,
        isProcessing: stateValue === 'in_progress',
        artefacts: (serviceDomainData.artefacts || []).map(artefactItem => ({
            id: artefactItem.id,
            label: artefactItem.label || 'no results',
            status: (artefactItem.status || 'in_review').replace('_', ' ').toUpperCase(),
        })),
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        VisualIcon: Cloud,
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

    const stateValue = templateDomainData.status || (templateDomainData as any).state || 'Active';

    return {
        visual: mapVisualProperties(templateDomainData.zoneColor, isSelected),
        displayName: templateDomainData.label || 'Template',
        statusText: stateValue.toUpperCase(),
        progressText: `${completedActionsCount}/${totalActionsCount} ACTIONS`,
        progressValue: progressPercentageValue,
        artifactLabel: outputArtefactItem?.label || 'no results',
        artifactStatusText: (outputArtefactItem?.status || 'in_review').replace('_', ' ').toUpperCase(),
        hasArtifact: !!outputArtefactItem,
        hasOutputArtefacts,
        activeOutputClassName: visualStyles.activeOutputClassName,
        VisualIcon: FileText,
    };
};

export const mapZoneToViewModel = (zoneDomainData: SpaceZoneDomainData, isSelected: boolean): SpaceZoneViewModel => {
    const colorIdentifier = zoneDomainData.color || 'blue';
    const visualStyles = getVisualStylesForZoneColor(colorIdentifier);

    return {
        visual: mapVisualProperties(colorIdentifier, isSelected),
        isSelected,
        displayName: (zoneDomainData.label || 'Unit').toUpperCase(),
        containerClassName: `h-full w-full rounded-[2rem] border-2 transition-all p-8 flex flex-col relative group ${visualStyles.borderClassName} ${isSelected ? visualStyles.backgroundClassName : 'bg-transparent'}`,
        labelClassName: `text-[10px] font-black uppercase tracking-[0.25em] ${visualStyles.textClassName}`,
        labelBorderClassName: visualStyles.labelBorderClassName,
        resizerLineClassName: visualStyles.resizerLineClassName || 'border-blue-500',
        resizerHandleClassName: visualStyles.resizerHandleClassName || 'border-blue-500',
        handleClassName: `!w-6 !h-6 !border-2 !border-zinc-800 ${visualStyles.handleBackgroundClassName?.replace('border-', 'bg-')} !0 hover:scale-110 transition-all !z-50 !cursor-pointer`,
        ports: zoneDomainData.ports || [],
        VisualIcon: Box,
    };
};

export const mapEntityToViewModel = (entityDomainData: SpaceEntityNodeDomainData, isSelected: boolean): SpaceEntityViewModel => {
    const visualProperties = mapVisualProperties(entityDomainData.zoneColor, isSelected);
    // Entity nodes are slightly smaller in width by default in original code
    const entityVisualProperties = { ...visualProperties, containerClassName: visualProperties.containerClassName.replace('w-[280px]', 'w-[240px]') };
    
    const VisualIcon = (() => {
        if (entityDomainData.type === 'agent') return Bot;
        if (entityDomainData.type === 'crew') return Users;
        if (entityDomainData.type === 'template') return FileText;
        if (entityDomainData.type === 'automation') return Zap;
        if (entityDomainData.type === 'service') return Cloud;
        return Box;
    })();

    const stateValue = entityDomainData.status || (entityDomainData as any).state || 'idle';

    return {
        visual: entityVisualProperties,
        displayName: entityDomainData.label || 'Entity',
        componentType: entityDomainData.type.toUpperCase(),
        description: entityDomainData.description,
        statusLabel: entityDomainData.type === 'agent' ? stateValue.toUpperCase() : undefined,
        isStatusActive: stateValue === 'active',
        VisualIcon,
    };
};
