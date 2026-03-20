'use client';

import { useMemo } from "react";
import { useReactFlow, Node } from "@xyflow/react";
import { TemplateArtefact } from "../../domain/types";

export const useSpaceZoneInspector = (data: any, nodeId: string, onPropertyChange: any, canvasNodes: Node[] = []) => {
    const { setNodes, fitView } = useReactFlow();

    const childArtefacts = useMemo(() => {
        const artefacts: { nodeId: string; nodeLabel: string; artefact: TemplateArtefact }[] = [];
        
        canvasNodes.filter(n => n.parentId === nodeId).forEach(childNode => {
            const nodeData = childNode.data as Record<string, unknown>;
            const nodeArtefacts = nodeData.artefacts as TemplateArtefact[] | undefined;
            
            if (nodeArtefacts && Array.isArray(nodeArtefacts)) {
                nodeArtefacts.forEach((art: TemplateArtefact) => {
                    if (art.isOutput) {
                        const label = (nodeData.label as string) || childNode.id;
                        artefacts.push({
                            nodeId: childNode.id,
                            nodeLabel: label,
                            artefact: art
                        });
                    }
                });
            }
        });
        
        return artefacts;
    }, [canvasNodes, nodeId]);

    const handleNavigateToNode = (targetNodeId: string) => {
        setNodes((nds) => nds.map(n => ({
            ...n,
            selected: n.id === targetNodeId
        })));
        
        setTimeout(() => {
            fitView({ nodes: [{ id: targetNodeId }], duration: 800, padding: 2 });
        }, 50);
    };

    return {
        state: {
            label: data.label,
            requiredContext: data.requiredContext || "",
            childArtefacts,
            hasInReview: childArtefacts.some(entry => entry.artefact.status === 'in_review')
        },
        actions: {
            handleNavigateToNode,
            onPropertyChange: (val: string) => onPropertyChange('requiredContext', val)
        }
    };
};
