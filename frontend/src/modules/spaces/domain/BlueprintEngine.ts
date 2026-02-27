// frontend/src/modules/spaces/domain/BlueprintEngine.ts

import type { Node, Edge } from '@xyflow/react';
import { SpacePatternBlueprint, PatternInterfacePort, PatternExternalDependency } from './types';

/**
 * BlueprintEngine handles the deep serialization and automatic interface mapping
 * for Patterns and Super Patterns.
 */
export const BlueprintEngine = {
  /**
   * Analyzes a selection to create a blueprint with automatic interface detection.
   */
  serializeSelection: (
    selectedNodes: readonly Node[],
    allNodes: readonly Node[],
    allEdges: readonly Edge[],
    metadata: { name: string; description: string; type?: 'pattern' | 'super-pattern' }
  ): SpacePatternBlueprint => {
    const zonesInSelection = selectedNodes.filter(n => n.type === 'zone');
    const isSuperPattern = metadata.type ? metadata.type === 'super-pattern' : zonesInSelection.length > 1;

    const expandedNodesSet = new Set<string>();
    const addNodeAndChildren = (nodeId: string) => {
      if (expandedNodesSet.has(nodeId)) return;
      expandedNodesSet.add(nodeId);
      allNodes.filter(n => n.parentId === nodeId).forEach(child => addNodeAndChildren(child.id));
    };
    selectedNodes.forEach(node => addNodeAndChildren(node.id));

    const finalNodes = allNodes.filter(n => expandedNodesSet.has(n.id));
    const finalNodeIds = new Set(finalNodes.map(n => n.id));

    const internalEdges = allEdges.filter(edge => 
      finalNodeIds.has(edge.source) && finalNodeIds.has(edge.target)
    );

    const interfacePorts: PatternInterfacePort[] = [];
    
    allEdges.forEach(edge => {
      const isSourceInside = finalNodeIds.has(edge.source);
      const isTargetInside = finalNodeIds.has(edge.target);

      if (isSourceInside && !isTargetInside) {
        const targetNode = allNodes.find(n => n.id === edge.target);
        if (targetNode?.type === 'zone' && edge.targetHandle?.endsWith('-int')) {
          const zonePortId = edge.targetHandle.replace('-int', '');
          const zoneData = targetNode.data as any;
          const portDef = zoneData.ports?.find((p: any) => p.id === zonePortId);

          interfacePorts.push({
            id: zonePortId,
            label: portDef?.label || 'Output Port',
            type: 'output',
            dataType: portDef?.dataType || 'any',
            sourceNodeId: edge.source
          });
        }
      }

      if (!isSourceInside && isTargetInside) {
        const sourceNode = allNodes.find(n => n.id === edge.source);
        if (sourceNode?.type === 'zone' && edge.sourceHandle?.endsWith('-int')) {
          const zonePortId = edge.sourceHandle.replace('-int', '');
          const zoneData = sourceNode.data as any;
          const portDef = zoneData.ports?.find((p: any) => p.id === zonePortId);

          interfacePorts.push({
            id: zonePortId,
            label: portDef?.label || 'Input Port',
            type: 'input',
            dataType: portDef?.dataType || 'any'
          });
        }
      }
    });

    const dependencies: PatternExternalDependency[] = [];
    const dependencyMap = new Map<string, Set<string>>();

    allEdges.forEach(edge => {
      const isSourceInside = finalNodeIds.has(edge.source);
      const isTargetInside = finalNodeIds.has(edge.target);

      if (isSourceInside && !isTargetInside) {
        const targetNode = allNodes.find(n => n.id === edge.target);
        if (targetNode && targetNode.type !== 'zone') {
          const externalZoneId = targetNode.parentId;
          if (externalZoneId) {
            if (!dependencyMap.has(externalZoneId)) dependencyMap.set(externalZoneId, new Set());
            dependencyMap.get(externalZoneId)!.add(targetNode.id);
          }
        }
      }
    });

    dependencyMap.forEach((nodeIds, zoneId) => {
      const zoneNode = allNodes.find(n => n.id === zoneId);
      dependencies.push({
        zoneId,
        zoneLabel: (zoneNode?.data?.label as string) || 'External Zone',
        connectedNodeIds: Array.from(nodeIds)
      });
    });

    return {
      name: metadata.name,
      description: metadata.description,
      version: '1.0.0',
      type: isSuperPattern ? 'super-pattern' : 'pattern',
      createdAt: new Date().toISOString(),
      structure: {
        nodes: finalNodes,
        edges: internalEdges,
      },
      interface: {
        ports: interfacePorts,
      },
      dependencies,
    };
  },

  instantiatePattern: (
    blueprint: SpacePatternBlueprint,
    dropPosition: { x: number; y: number }
  ): { nodes: Node[]; edges: Edge[] } => {
    const idMap = new Map<string, string>();
    blueprint.structure.nodes.forEach(node => {
      idMap.set(node.id, `node_${Math.random().toString(36).substring(2, 11)}`);
    });

    const minX = Math.min(...blueprint.structure.nodes.map(n => n.position.x));
    const minY = Math.min(...blueprint.structure.nodes.map(n => n.position.y));

    const instantiatedNodes = blueprint.structure.nodes.map(node => {
      const newId = idMap.get(node.id)!;
      return {
        ...node,
        id: newId,
        parentId: node.parentId ? idMap.get(node.parentId) : undefined,
        position: {
          x: node.position.x - minX + dropPosition.x,
          y: node.position.y - minY + dropPosition.y,
        },
        selected: false,
      };
    });

    const instantiatedEdges = blueprint.structure.edges.map(edge => ({
      ...edge,
      id: `edge_${Math.random().toString(36).substring(2, 11)}`,
      source: idMap.get(edge.source)!,
      target: idMap.get(edge.target)!,
    }));

    return {
      nodes: instantiatedNodes,
      edges: instantiatedEdges,
    };
  }
};
