import { useState, useCallback } from "react";
import { Textarea, Divider } from "@heroui/react";
import React from "react";

interface ZoneInspectorProps {
    node: {
        id: string;
        type: string;
        data: {
            label: string;
            type: string;
            requiredContext?: string;
            outputArtifact?: string;
        };
    };
    onNodeDataChange: (nodeId: string, data: Record<string, unknown>) => void;
}

export const ZoneInspector = ({ node, onNodeDataChange }: ZoneInspectorProps) => {
    const nodeTyped = node;
    const [requiredContext, setRequiredContext] = useState(nodeTyped.data.requiredContext || "");
    const [outputArtifact, setOutputArtifact] = useState(nodeTyped.data.outputArtifact || "");

    const handleRequiredContextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setRequiredContext(newValue);
      onNodeDataChange(nodeTyped.id, { requiredContext: newValue });
    }, [nodeTyped.id, onNodeDataChange]);

    const handleOutputArtifactChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setOutputArtifact(newValue);
      onNodeDataChange(nodeTyped.id, { outputArtifact: newValue });
    }, [nodeTyped.id, onNodeDataChange]);

    return (
        <div className="p-8 flex flex-col gap-8 bg-black h-full">
            <div>
                <h3 className="font-black text-2xl text-white mb-1 tracking-tight">{nodeTyped.data.label}</h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type: {nodeTyped.type} / {nodeTyped.data.type}</p>
            </div>

            <Divider className="bg-zinc-800" />

            <div className="space-y-4">
                <label htmlFor="requiredContext" className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Required Context</label>
                <Textarea
                    id="requiredContext"
                    variant="bordered"
                    placeholder="Define required context..."
                    value={requiredContext}
                    onChange={handleRequiredContextChange}
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
                    value={outputArtifact}
                    onChange={handleOutputArtifactChange}
                    minRows={4}
                    classNames={{
                        input: "text-xs font-mono text-zinc-300",
                        inputWrapper: "bg-black border-zinc-700 focus-within:!border-zinc-200 rounded-xl"
                    }}
                />
            </div>
        </div>
    );
};
