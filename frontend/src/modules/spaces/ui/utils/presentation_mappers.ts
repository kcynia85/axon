// frontend/src/modules/spaces/domain/presentation_mappers.ts

import { VisualStyleForZoneColor, SpaceCanvasNodeInformation } from "../types";

export const MAP_OF_VISUAL_ZONE_COLORS_TO_CSS_CLASSES: Record<string, VisualStyleForZoneColor> = {
    purple: { 
        borderClassName: 'border-purple-500', 
        shadowClassName: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]', 
        handleBackgroundClassName: '!bg-purple-500',
        backgroundClassName: 'bg-purple-500/5',
        iconBackgroundClassName: "bg-zinc-900 text-purple-400 dark:bg-zinc-800 dark:text-purple-400",
        borderSelectedClassName: "!border-purple-500",
        textClassName: 'text-purple-400',
        resizerLineClassName: 'border-purple-500',
        resizerHandleClassName: 'border-purple-500',
        hoverBackgroundClassName: 'bg-purple-500',
        level1HoverBackgroundClassName: 'hover:bg-purple-500',
        activeOutputClassName: "!bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] !border-purple-400 animate-pulse",
    },
    blue: { 
        borderClassName: 'border-blue-500', 
        shadowClassName: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]', 
        handleBackgroundClassName: '!bg-blue-500',
        backgroundClassName: 'bg-blue-500/5',
        iconBackgroundClassName: "bg-zinc-900 text-blue-400 dark:bg-zinc-800 dark:text-blue-400",
        borderSelectedClassName: "!border-blue-500",
        textClassName: 'text-blue-400',
        resizerLineClassName: 'border-blue-500',
        resizerHandleClassName: 'border-blue-500',
        hoverBackgroundClassName: 'bg-blue-500',
        level1HoverBackgroundClassName: 'hover:bg-blue-500',
        activeOutputClassName: "!bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] !border-blue-400 animate-pulse",
    },
    pink: { 
        borderClassName: 'border-pink-500', 
        shadowClassName: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]', 
        handleBackgroundClassName: '!bg-pink-500',
        backgroundClassName: 'bg-pink-500/5',
        iconBackgroundClassName: "bg-zinc-900 text-pink-400 dark:bg-zinc-800 dark:text-pink-400",
        borderSelectedClassName: "!border-pink-500",
        textClassName: 'text-pink-400',
        resizerLineClassName: 'border-pink-500',
        resizerHandleClassName: 'border-pink-500',
        hoverBackgroundClassName: 'bg-pink-500',
        level1HoverBackgroundClassName: 'hover:bg-pink-500',
        activeOutputClassName: "!bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] !border-pink-400 animate-pulse",
    },
    green: { 
        borderClassName: 'border-green-500', 
        shadowClassName: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]', 
        handleBackgroundClassName: '!bg-green-500',
        backgroundClassName: 'bg-green-500/5',
        iconBackgroundClassName: "bg-zinc-900 text-green-400 dark:bg-zinc-800 dark:text-green-400",
        borderSelectedClassName: "!border-green-500",
        textClassName: 'text-green-400',
        resizerLineClassName: 'border-green-500',
        resizerHandleClassName: 'border-green-500',
        hoverBackgroundClassName: 'bg-green-500',
        level1HoverBackgroundClassName: 'hover:bg-green-500',
        activeOutputClassName: "!bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] !border-green-400 animate-pulse",
    },
    yellow: { 
        borderClassName: 'border-yellow-500', 
        shadowClassName: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', 
        handleBackgroundClassName: '!bg-yellow-500',
        backgroundClassName: 'bg-yellow-500/5',
        iconBackgroundClassName: "bg-zinc-900 text-yellow-400 dark:bg-zinc-800 dark:text-yellow-400",
        borderSelectedClassName: "!border-yellow-500",
        textClassName: 'text-yellow-400',
        resizerLineClassName: 'border-yellow-500',
        resizerHandleClassName: 'border-yellow-500',
        hoverBackgroundClassName: 'bg-yellow-500',
        level1HoverBackgroundClassName: 'hover:bg-yellow-500',
        activeOutputClassName: "!bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] !border-yellow-400 animate-pulse",
    },
    orange: { 
        borderClassName: 'border-orange-500', 
        shadowClassName: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]', 
        handleBackgroundClassName: '!bg-orange-500',
        backgroundClassName: 'bg-orange-500/5',
        iconBackgroundClassName: "bg-zinc-900 text-orange-400 dark:bg-zinc-800 dark:text-orange-400",
        borderSelectedClassName: "!border-orange-500",
        textClassName: 'text-orange-400',
        resizerLineClassName: 'border-orange-500',
        resizerHandleClassName: 'border-orange-500',
        hoverBackgroundClassName: 'bg-orange-500',
        level1HoverBackgroundClassName: 'hover:bg-orange-500',
        activeOutputClassName: "!bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] !border-orange-400 animate-pulse",
    },
    default: {
        borderClassName: 'border-zinc-700',
        shadowClassName: '',
        handleBackgroundClassName: '!bg-zinc-500',
        backgroundClassName: 'bg-transparent',
        iconBackgroundClassName: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400",
        borderSelectedClassName: "!border-blue-600",
        textClassName: 'text-blue-400',
        resizerLineClassName: 'border-blue-500',
        resizerHandleClassName: 'border-blue-500',
        hoverBackgroundClassName: 'bg-zinc-800', 
        level1HoverBackgroundClassName: 'hover:bg-zinc-800',
        activeOutputClassName: "!bg-zinc-500 animate-pulse",
    }
};

export const getVisualStylesForZoneColor = (visualZoneColorIdentifier: string): VisualStyleForZoneColor => {
    return MAP_OF_VISUAL_ZONE_COLORS_TO_CSS_CLASSES[visualZoneColorIdentifier] || MAP_OF_VISUAL_ZONE_COLORS_TO_CSS_CLASSES.default;
};

export const getEffectiveNodeType = (nodeInformation: SpaceCanvasNodeInformation): string => {
    return nodeInformation.type === 'entity' 
        ? (nodeInformation.data.type as string) 
        : nodeInformation.type;
};

export const isNodeRepresentingAZone = (nodeInformation: SpaceCanvasNodeInformation): boolean => {
    return nodeInformation.type === 'zone';
};
