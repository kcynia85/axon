import { useState, useEffect } from 'react';
import { useReactFlow, useViewport, Node } from '@xyflow/react';
import { SpacePatternBlueprint } from '../../domain/types';
import { SpaceCanvasPresentationViewProperties } from '../types';
import { useCreatePattern } from '@/modules/workspaces/application/usePatterns';

export const useSpaceCanvasView = (properties: SpaceCanvasPresentationViewProperties) => {
    const {
        workspaceId,
        canvasNodes,
        handleCanvasNodesChange,
        updateNodesStatus,
        duplicateNode,
        deleteNodes,
        copyNodes,
        cutNodes,
        pasteNodes,
        createPatternFromSelection,
    } = properties;

    const [contextMenu, setContextMenu] = useState<{ id?: string; top: number; left: number; type: 'node' | 'pane' | 'selection' } | null>(null);
    const [analyzedBlueprint, setAnalyzedBlueprint] = useState<SpacePatternBlueprint | null>(null);
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFullscreenInspectorOpen, setIsFullscreenInspectorOpen] = useState(false);
    
    const { screenToFlowPosition, getNodes } = useReactFlow();
    const viewport = useViewport();
    const { mutateAsync: createPatternAction } = useCreatePattern(workspaceId);

    const toggleFullscreen = () => {
        setIsFullscreen((previousFullscreenState) => {
            const nextFullscreenState = !previousFullscreenState;
            if (!nextFullscreenState) {
                setIsFullscreenInspectorOpen(false);
            }
            return nextFullscreenState;
        });
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
        setIsFullscreenInspectorOpen(false);
    };

    // Keyboard shortcuts handler
    useEffect(() => {
        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

            if (event.code === 'Space') {
                setIsSpacePressed(true);
                event.preventDefault();
            }
            if (event.code === 'KeyF') {
                toggleFullscreen();
            }
            if (event.code === 'Escape' && isFullscreen) {
                closeFullscreen();
            }
        };
        
        const handleGlobalKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'Space') setIsSpacePressed(false);
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        window.addEventListener('keyup', handleGlobalKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
            window.removeEventListener('keyup', handleGlobalKeyUp);
        };
    }, [isFullscreen]);

    // Derived state - React Compiler handles optimization
    const selectedNodes = canvasNodes.filter((node) => node.selected);
    const zonesInSelection = selectedNodes.filter((node) => node.type === 'zone');
    const isSuperPatternSelection = zonesInSelection.length > 1;

    const calculateSelectionBounds = () => {
        if (selectedNodes.length === 0) return null;
        
        let minimumX = Infinity, minimumY = Infinity, maximumX = -Infinity, maximumY = -Infinity;
        
        selectedNodes.forEach((node) => {
            let absoluteX = node.position.x;
            let absoluteY = node.position.y;
            let parentIdentifier = node.parentId;
            
            while (parentIdentifier) {
                const parentNode = canvasNodes.find((canvasNode) => canvasNode.id === parentIdentifier);
                if (parentNode) {
                    absoluteX += parentNode.position.x;
                    absoluteY += parentNode.position.y;
                    parentIdentifier = parentNode.parentId;
                } else break;
            }

            const nodeWidth = node.measured?.width || (node.type === 'zone' ? 400 : 200);
            const nodeHeight = node.measured?.height || (node.type === 'zone' ? 300 : 100);
            
            if (absoluteX < minimumX) minimumX = absoluteX;
            if (absoluteY < minimumY) minimumY = absoluteY;
            if (absoluteX + nodeWidth > maximumX) maximumX = absoluteX + nodeWidth;
            if (absoluteY + nodeHeight > maximumY) maximumY = absoluteY + nodeHeight;
        });

        if (minimumX === Infinity) return null;

        const BOUNDS_PADDING = 40;
        const { x: viewportX, y: viewportY, zoom: viewportZoom } = viewport;
        
        return {
            x: (minimumX - BOUNDS_PADDING) * viewportZoom + viewportX,
            y: (minimumY - BOUNDS_PADDING) * viewportZoom + viewportY,
            width: (maximumX - minimumX + BOUNDS_PADDING * 2) * viewportZoom,
            height: (maximumY - minimumY + BOUNDS_PADDING * 2) * viewportZoom
        };
    };

    const selectionScreenBounds = calculateSelectionBounds();

    const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
        event.preventDefault();
        const currentSelectedNodes = getNodes().filter((canvasNode) => canvasNode.selected);
        if (currentSelectedNodes.length > 1 && currentSelectedNodes.some((canvasNode) => canvasNode.id === node.id)) {
            setContextMenu({ top: event.clientY, left: event.clientX, type: 'selection' });
        } else {
            setContextMenu({ id: node.id, top: event.clientY, left: event.clientX, type: 'node' });
        }
    };

    const onPaneContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        const currentSelectedNodes = getNodes().filter((canvasNode) => canvasNode.selected);
        if (currentSelectedNodes.length > 1) {
            setContextMenu({ top: event.clientY, left: event.clientX, type: 'selection' });
        } else {
            setContextMenu({ top: event.clientY, left: event.clientX, type: 'pane' });
        }
    };

    const handleCanvasAction = (actionIdentifier: string) => {
        const targetNode = contextMenu?.id ? getNodes().find((node) => node.id === contextMenu.id) : null;
        const currentSelectedNodes = getNodes().filter((node) => node.selected);
        
        switch (actionIdentifier) {
            case 'run':
                if (targetNode) updateNodesStatus([targetNode.id], targetNode.type === 'service' ? 'in_progress' : 'working');
                break;
            case 'stop':
                if (targetNode) updateNodesStatus([targetNode.id], targetNode.type === 'service' ? 'idle' : 'done');
                break;
            case 'duplicate':
                if (targetNode) duplicateNode(targetNode);
                break;
            case 'delete':
                deleteNodes(contextMenu?.type === 'selection' ? currentSelectedNodes.map((node) => node.id) : (targetNode ? [targetNode.id] : []));
                break;
            case 'copy':
                copyNodes(contextMenu?.type === 'selection' ? currentSelectedNodes : (targetNode ? [targetNode] : []));
                break;
            case 'cut':
                cutNodes(contextMenu?.type === 'selection' ? currentSelectedNodes : (targetNode ? [targetNode] : []));
                break;
            case 'paste':
                if (contextMenu) pasteNodes(screenToFlowPosition({ x: contextMenu.left, y: contextMenu.top }));
                break;
            case 'details':
                if (targetNode) handleCanvasNodesChange([{ id: targetNode.id, type: 'select', selected: true }]);
                break;
            case 'save-pattern':
                setAnalyzedBlueprint(createPatternFromSelection("New Pattern", "", 'pattern'));
                break;
            case 'save-super-pattern':
                setAnalyzedBlueprint(createPatternFromSelection("New Super Pattern", "", 'super-pattern'));
                break;
        }
        setContextMenu(null);
    };

    const handleSavePatternAction = async (patternName: string, patternDescription: string) => {
        if (!analyzedBlueprint) return;
        try {
            await createPatternAction({
                pattern_name: patternName,
                pattern_okr_context: patternDescription,
                pattern_graph_structure: {
                    ...analyzedBlueprint.structure,
                    interface: analyzedBlueprint.interface,
                    dependencies: analyzedBlueprint.dependencies,
                    blueprint_type: analyzedBlueprint.type
                } as any,
                pattern_keywords: [analyzedBlueprint.type, "Intelligent Mapping"],
                availability_workspace: [workspaceId],
                pattern_inputs: {},
                pattern_outputs: {}
            });
            setAnalyzedBlueprint(null);
        } catch (error) {
            console.error('Failed to save pattern:', error);
        }
    };

    const activeNode = contextMenu?.id ? getNodes().find((node) => node.id === contextMenu.id) : null;
    const isNodeWorking = activeNode ? (activeNode.type === 'service' ? activeNode.data.status === 'in_progress' : activeNode.data.state === 'working') : false;

    return {
        contextMenu,
        setContextMenu,
        analyzedBlueprint,
        setAnalyzedBlueprint,
        isSpacePressed,
        isFullscreen,
        setIsFullscreen,
        isFullscreenInspectorOpen,
        setIsFullscreenInspectorOpen,
        viewport,
        selectedNodes,
        isSuperPatternSelection,
        selectionScreenBounds,
        onNodeContextMenu,
        onPaneContextMenu,
        handleCanvasAction,
        handleSavePatternAction,
        targetNode: activeNode,
        isWorking: isNodeWorking
    };
};
