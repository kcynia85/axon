import {
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import { AgentInspector } from "./inspectors/agent-inspector";
import { CrewInspector } from "./inspectors/crew-inspector";
import { PatternInspector } from "./inspectors/pattern-inspector";
import { AutomationInspector } from "./inspectors/automation-inspector";
import { ServiceInspector } from "./inspectors/service-inspector";
import { TemplateInspector } from "./inspectors/template-inspector";

interface RightSidebarProps {
    selectedNode: any;
}

// Fallback Inspector
const DefaultInspector = ({ node }: { node: any }) => (
    <CardBody className="p-6">
        <h3 className="font-bold text-lg mb-2">{node.data.label}</h3>
        <p className="text-sm text-default-500">Type: {node.type} / {node.data.type}</p>
        <Divider className="my-4" />
        <p className="text-xs text-default-400">Select a specific component to view its inspector.</p>
    </CardBody>
);

export const RightSidebar = ({ selectedNode }: RightSidebarProps) => {
    if (!selectedNode) {
        return null;
    }

    const type = selectedNode.type === 'entity' ? selectedNode.data.type : selectedNode.type;
    const isZone = selectedNode.type === 'zone';

    return (
        <div className="h-[calc(100vh-150px)] mt-24 mr-6 pointer-events-auto flex flex-col items-end">
            <Card className="bg-background/80 backdrop-blur-xl border border-default-200/50 shadow-lg w-80 h-full rounded-2xl">
                 {isZone ? (
                     <DefaultInspector node={selectedNode} />
                 ) : type === 'agent' ? (
                     <AgentInspector node={selectedNode} />
                 ) : type === 'crew' ? (
                     <CrewInspector node={selectedNode} />
                 ) : type === 'pattern' ? (
                     <PatternInspector node={selectedNode} />
                 ) : type === 'automation' ? (
                     <AutomationInspector node={selectedNode} />
                 ) : type === 'service' ? (
                     <ServiceInspector node={selectedNode} />
                 ) : type === 'template' ? (
                     <TemplateInspector node={selectedNode} />
                 ) : (
                     <DefaultInspector node={selectedNode} />
                 )}
            </Card>
        </div>
    );
};
