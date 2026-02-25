// frontend/src/modules/spaces/ui/pure/SpaceCanvasRightSidebarView.tsx

import React from "react";
import {
    Card,
    Divider,
} from "@heroui/react";
import { SpaceAgentNodeInspector } from "../inspectors/SpaceAgentNodeInspector";
import { SpaceCrewNodeInspector } from "../inspectors/SpaceCrewNodeInspector";
import { SpacePatternNodeInspector } from "../inspectors/SpacePatternNodeInspector";
import { SpaceAutomationNodeInspector } from "../inspectors/SpaceAutomationNodeInspector";
import { SpaceServiceNodeInspector } from "../inspectors/SpaceServiceNodeInspector";
import { SpaceTemplateNodeInspector } from "../inspectors/SpaceTemplateNodeInspector";
import { SpaceZoneNodeInspector } from "../inspectors/SpaceZoneNodeInspector";
import {
    SpaceCanvasNodeInformation,
    SpaceAgentDomainData,
    SpaceCrewDomainData,
    SpaceAutomationDomainData,
    SpaceServiceDomainData,
    SpaceTemplateDomainData,
    SpaceZoneDomainData
} from "../../domain/types";

const GenericNodeInspector = ({ nodeInformation }: { readonly nodeInformation: SpaceCanvasNodeInformation }) => (
    <div className="p-8">
        <h3 className="font-black text-xl mb-2 text-white">{nodeInformation.data.label as string}</h3>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type: {nodeInformation.type} / {nodeInformation.data.type as string}</p>
        <Divider className="my-6 bg-zinc-700" />
        <p className="text-xs text-zinc-400 italic">Select a specific component to view its detailed properties and runtime control.</p>
    </div>
);

type SpaceCanvasRightSidebarViewProperties = {
    readonly currentlySelectedNodeInformation: SpaceCanvasNodeInformation | null;
    readonly effectiveNodeType: string | null;
    readonly isNodeSelectedRepresentingAZone: boolean;
    readonly handleStatusChange: (selection: unknown) => void;
    readonly handleArtifactStatusChange: (selection: unknown) => void;
    readonly handlePropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void;
};

export const SpaceCanvasRightSidebarView = ({
    currentlySelectedNodeInformation,
    effectiveNodeType,
    isNodeSelectedRepresentingAZone,
    handleStatusChange,
    handleArtifactStatusChange,
    handlePropertyChange,
}: SpaceCanvasRightSidebarViewProperties) => {

    if (!currentlySelectedNodeInformation) {
        return null;
    }

    return (
        <div className="h-[calc(100vh-160px)] mt-24 mr-8 pointer-events-auto flex flex-col items-end select-none">
            <Card className="bg-black border border-zinc-200 shadow-[0_0_40px_rgba(0,0,0,0.7)] w-[380px] h-full rounded-2xl overflow-hidden">
                {isNodeSelectedRepresentingAZone ? (
                    <SpaceZoneNodeInspector
                        data={currentlySelectedNodeInformation.data as SpaceZoneDomainData}
                        nodeId={currentlySelectedNodeInformation.id}
                        onPropertyChange={(name, value) => handlePropertyChange(name, value)}
                    />
                ) : effectiveNodeType === 'agent' ? (
                    <SpaceAgentNodeInspector
                        data={currentlySelectedNodeInformation.data as SpaceAgentDomainData}
                        nodeId={currentlySelectedNodeInformation.id}
                        onStatusChange={handleStatusChange}
                        onPropertyChange={handlePropertyChange}
                    />
                ) : effectiveNodeType === 'crew' ? (
                    <SpaceCrewNodeInspector
                        data={currentlySelectedNodeInformation.data as SpaceCrewDomainData}
                        nodeId={currentlySelectedNodeInformation.id}
                        onStatusChange={handleStatusChange}
                        onPropertyChange={handlePropertyChange}
                    />
                ) : effectiveNodeType === 'pattern' ? (
                    <SpacePatternNodeInspector
                        patternNodeInformation={currentlySelectedNodeInformation}
                    />
                ) : effectiveNodeType === 'automation' ? (
                    <SpaceAutomationNodeInspector
                        data={currentlySelectedNodeInformation.data as SpaceAutomationDomainData}
                        nodeId={currentlySelectedNodeInformation.id}
                        onPropertyChange={handlePropertyChange}
                    />
                ) : effectiveNodeType === 'service' ? (
                    <SpaceServiceNodeInspector
                        data={currentlySelectedNodeInformation.data as SpaceServiceDomainData}
                        nodeId={currentlySelectedNodeInformation.id}
                        onArtifactStatusChange={handleArtifactStatusChange}
                        onPropertyChange={handlePropertyChange}
                    />
                ) : effectiveNodeType === 'template' ? (
                    <SpaceTemplateNodeInspector
                        data={currentlySelectedNodeInformation.data as SpaceTemplateDomainData}
                        nodeId={currentlySelectedNodeInformation.id}
                        onPropertyChange={handlePropertyChange}
                    />
                ) : (
                    <GenericNodeInspector nodeInformation={currentlySelectedNodeInformation} />
                )}
            </Card>
        </div>
    );
};
