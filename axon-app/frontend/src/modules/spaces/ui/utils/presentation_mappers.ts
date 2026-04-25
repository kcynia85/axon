// frontend/src/modules/spaces/domain/presentation_mappers.ts

import { VisualStyleForZoneColor, SpaceCanvasNodeInformation } from "../types";

export const MAP_OF_VISUAL_ZONE_COLORS_TO_CSS_CLASSES: Record<string, VisualStyleForZoneColor> = {
    purple: { 
        borderClassName: 'border-purple-900', 
        shadowClassName: 'shadow-none', 
        handleBackgroundClassName: '!bg-purple-900',
        backgroundClassName: 'bg-transparent',
        iconBackgroundClassName: "bg-zinc-900 text-purple-400 dark:bg-zinc-800 dark:text-purple-400",
        borderSelectedClassName: "!border-purple-500",
        textClassName: 'text-purple-400',
        resizerLineClassName: 'border-purple-900',
        resizerHandleClassName: 'border-purple-900',
        hoverBackgroundClassName: 'bg-purple-950',
        level1HoverBackgroundClassName: 'hover:bg-purple-950',
        labelBorderClassName: 'border-purple-900',
    },
    blue: { 
        borderClassName: 'border-blue-900', 
        shadowClassName: 'shadow-none', 
        handleBackgroundClassName: '!bg-blue-900',
        backgroundClassName: 'bg-transparent',
        iconBackgroundClassName: "bg-zinc-900 text-blue-400 dark:bg-zinc-800 dark:text-blue-400",
        borderSelectedClassName: "!border-blue-500",
        textClassName: 'text-blue-400',
        resizerLineClassName: 'border-blue-900',
        resizerHandleClassName: 'border-blue-900',
        hoverBackgroundClassName: 'bg-blue-950',
        level1HoverBackgroundClassName: 'hover:bg-blue-950',
        activeOutputClassName: "!bg-blue-900 !border-blue-800",
        labelBorderClassName: 'border-blue-900',
    },
    pink: { 
        borderClassName: 'border-pink-900', 
        shadowClassName: 'shadow-none', 
        handleBackgroundClassName: '!bg-pink-900',
        backgroundClassName: 'bg-transparent',
        iconBackgroundClassName: "bg-zinc-900 text-pink-400 dark:bg-zinc-800 dark:text-pink-400",
        borderSelectedClassName: "!border-pink-500",
        textClassName: 'text-pink-400',
        resizerLineClassName: 'border-pink-900',
        resizerHandleClassName: 'border-pink-900',
        hoverBackgroundClassName: 'bg-pink-950',
        level1HoverBackgroundClassName: 'hover:bg-pink-950',
        activeOutputClassName: "!bg-pink-900 !border-pink-800",
        labelBorderClassName: 'border-pink-900',
    },
    green: { 
        borderClassName: 'border-green-900', 
        shadowClassName: 'shadow-none', 
        handleBackgroundClassName: '!bg-green-900',
        backgroundClassName: 'bg-transparent',
        iconBackgroundClassName: "bg-zinc-900 text-green-400 dark:bg-zinc-800 dark:text-green-400",
        borderSelectedClassName: "!border-green-500",
        textClassName: 'text-green-400',
        resizerLineClassName: 'border-green-900',
        resizerHandleClassName: 'border-green-900',
        hoverBackgroundClassName: 'bg-green-950',
        level1HoverBackgroundClassName: 'hover:bg-green-950',
        activeOutputClassName: "!bg-green-900 !border-green-800",
        labelBorderClassName: 'border-green-900',
    },
    yellow: { 
        borderClassName: 'border-yellow-900', 
        shadowClassName: 'shadow-none', 
        handleBackgroundClassName: '!bg-yellow-900',
        backgroundClassName: 'bg-transparent',
        iconBackgroundClassName: "bg-zinc-900 text-yellow-400 dark:bg-zinc-800 dark:text-yellow-400",
        borderSelectedClassName: "!border-yellow-500",
        textClassName: 'text-yellow-400',
        resizerLineClassName: 'border-yellow-900',
        resizerHandleClassName: 'border-yellow-900',
        hoverBackgroundClassName: 'bg-yellow-950',
        level1HoverBackgroundClassName: 'hover:bg-yellow-950',
        activeOutputClassName: "!bg-yellow-900 !border-yellow-800",
        labelBorderClassName: 'border-yellow-900',
    },
    orange: { 
        borderClassName: 'border-orange-900', 
        shadowClassName: 'shadow-none', 
        handleBackgroundClassName: '!bg-orange-900',
        backgroundClassName: 'bg-transparent',
        iconBackgroundClassName: "bg-zinc-900 text-orange-400 dark:bg-zinc-800 dark:text-orange-400",
        borderSelectedClassName: "!border-orange-500",
        textClassName: 'text-orange-400',
        resizerLineClassName: 'border-orange-900',
        resizerHandleClassName: 'border-orange-900',
        hoverBackgroundClassName: 'bg-orange-950',
        level1HoverBackgroundClassName: 'hover:bg-orange-950',
        activeOutputClassName: "!bg-orange-900 !border-orange-800",
        labelBorderClassName: 'border-orange-900',
    },
    default: {
        borderClassName: 'border-zinc-800',
        shadowClassName: 'shadow-none',
        handleBackgroundClassName: '!bg-zinc-800',
        backgroundClassName: 'bg-black',
        iconBackgroundClassName: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400",
        borderSelectedClassName: "!border-zinc-500",
        textClassName: 'text-zinc-400',
        resizerLineClassName: 'border-zinc-800',
        resizerHandleClassName: 'border-zinc-800',
        hoverBackgroundClassName: 'bg-zinc-900', 
        level1HoverBackgroundClassName: 'hover:bg-zinc-900',
        activeOutputClassName: "!bg-zinc-800",
        labelBorderClassName: 'border-zinc-800',
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
