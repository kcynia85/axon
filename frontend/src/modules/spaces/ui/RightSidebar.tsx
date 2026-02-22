import {
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import { AgentInspector } from "./inspectors/AgentInspector";
import { CrewInspector } from "./inspectors/CrewInspector";
import { PatternInspector } from "./inspectors/PatternInspector";
import { AutomationInspector } from "./inspectors/AutomationInspector";
import { ServiceInspector } from "./inspectors/ServiceInspector";
import { TemplateInspector } from "./inspectors/TemplateInspector";
import { ZoneInspector } from "./inspectors/ZoneInspector";
import React from "react";

type NodeData = {
    label?: string;
    type?: string;
    [key: string]: unknown;
};

type SpaceNode = {
    id: string;
    type: string;
    data: NodeData;
};

interface RightSidebarProps {
    selectedNode: SpaceNode | null;
    onNodeDataChange: (nodeId: string, data: Record<string, unknown>) => void;
}

// Fallback Inspector
const DefaultInspector = ({ node }: { node: SpaceNode }) => (
    <CardBody className="p-8">
        <h3 className="font-black text-xl mb-2 text-white">{node.data.label}</h3>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type: {node.type} / {node.data.type as string}</p>
        <Divider className="my-6 bg-zinc-700" />
        <p className="text-xs text-zinc-400 italic">Select a specific component to view its detailed properties and runtime control.</p>
    </CardBody>
);

export const RightSidebar = ({ selectedNode, onNodeDataChange }: RightSidebarProps) => {
    if (!selectedNode) {
        return null;
    }

    const type = selectedNode.type === 'entity' ? (selectedNode.data.type as string) : selectedNode.type;
    const isZone = selectedNode.type === 'zone';

    return (
        <div className="h-[calc(100vh-160px)] mt-24 mr-8 pointer-events-auto flex flex-col items-end select-none">
            <Card className="bg-black border border-zinc-200 shadow-[0_0_40px_rgba(0,0,0,0.7)] w-[380px] h-full rounded-2xl overflow-hidden">
                 {isZone ? (
                     <ZoneInspector node={selectedNode} onNodeDataChange={onNodeDataChange} />
                 ) : type === 'agent' ? (
                     <AgentInspector node={selectedNode} onNodeDataChange={onNodeDataChange} />
                 ) : type === 'crew' ? (
                     <CrewInspector node={selectedNode} onNodeDataChange={onNodeDataChange} />
                 ) : type === 'pattern' ? (
                     <PatternInspector node={selectedNode} />
                 ) : type === 'automation' ? (
                     <AutomationInspector node={selectedNode} onNodeDataChange={onNodeDataChange} />
                 ) : type === 'service' ? (
                     <ServiceInspector node={selectedNode} onNodeDataChange={onNodeDataChange} />
                 ) : type === 'template' ? (
                     <TemplateInspector node={selectedNode} onNodeDataChange={onNodeDataChange} />
                 ) : (
                     <DefaultInspector node={selectedNode} />
                 )}
            </Card>
        </div>
    );
};
