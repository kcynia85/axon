// frontend/src/modules/spaces/ui/inspectors/SpaceZoneNodeInspector.tsx

import React from "react";
import { Textarea, Divider } from "@heroui/react";
import { SpaceZoneInspectorProperties } from "../../domain/types";

export const SpaceZoneNodeInspector = ({ 
    data, 
    onPropertyChange 
}: SpaceZoneInspectorProperties) => (
    <div className="p-8 flex flex-col gap-8 bg-black h-full">
        <div>
            <h3 className="font-black text-2xl text-white mb-1 tracking-tight">{data.label}</h3>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type: Zone / {data.type}</p>
        </div>

        <Divider className="bg-zinc-800" />

        <div className="space-y-4">
            <label htmlFor="requiredContext" className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Required Context</label>
            <Textarea
                id="requiredContext"
                variant="bordered"
                placeholder="Define required context..."
                value={data.requiredContext || ""}
                onChange={(changeEvent) => onPropertyChange('requiredContext', changeEvent.target.value)}
                minRows={4}
                classNames={{
                    input: "text-xs font-mono text-zinc-300",
                    inputWrapper: "bg-black border-zinc-700 focus-within:!border-zinc-200 rounded-xl"
                }}
            />
        </div>

        <div className="space-y-4">
            <label htmlFor="outputArtifact" className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Output Artifact</label>
            <Textarea
                id="outputArtifact"
                variant="bordered"
                placeholder="Define output artifact..."
                value={data.outputArtifact || ""}
                onChange={(changeEvent) => onPropertyChange('outputArtifact', changeEvent.target.value)}
                minRows={4}
                classNames={{
                    input: "text-xs font-mono text-zinc-300",
                    inputWrapper: "bg-black border-zinc-700 focus-within:!border-zinc-200 rounded-xl"
                }}
            />
        </div>
    </div>
);
