import { useState, useCallback } from "react";
import {
  CardBody,
  Button,
  ScrollShadow,
  Select,
  SelectItem,
} from "@heroui/react";
import { 
  FileJson,
  Plus,
  Webhook
} from "lucide-react";

interface AutomationInspectorProps {
  node: {
      id: string;
      data: {
          artifactName?: string;
          artifactStatus?: string;
          [key: string]: unknown;
      };
  };
  onNodeDataChange: (nodeId: string, data: Record<string, unknown>) => void;
}

const artifactStatuses = [
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
  { key: "failed", label: "Failed" },
  { key: "in_review", label: "In Review" },
];

export const AutomationInspector = ({ node, onNodeDataChange }: AutomationInspectorProps) => {
    const [artifactStatus, setArtifactStatus] = useState(node.data.artifactStatus || "pending");

    const handleStatusChange = useCallback((newStatus: string) => {
      setArtifactStatus(newStatus);
      onNodeDataChange(node.id, { artifactStatus: newStatus });
    }, [node.id, onNodeDataChange]);

    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <ScrollShadow className="flex-1 p-6 space-y-8">
                
                {/* Trigger Button */}
                <Button 
                    className="w-full font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all" 
                    startContent={<Webhook size={14} />}
                >
                    Trigger (Webhook)
                </Button>

                {/* Context */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Context</h4>
                    <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-400 italic">
                        [ File ]
                    </div>
                </div>

                {/* Artefacts */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Artefacts</h4>
                    <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-800 rounded-lg">
                                <FileJson size={16} className="text-zinc-400" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-black text-white">{node.data.artifactName || 'data.json'}</div>
                                <Select
                                    selectedKeys={[artifactStatus]}
                                    onSelectionChange={(keys) => handleStatusChange(Array.from(keys)[0] as string)}
                                    variant="bordered"
                                    size="sm"
                                    aria-label="Artifact Status"
                                    classNames={{
                                      trigger: "h-6 min-h-6 border-zinc-700 bg-black rounded-md",
                                      value: "text-[10px] font-black text-zinc-400 uppercase",
                                    }}
                                >
                                    {artifactStatuses.map((status) => (
                                        <SelectItem key={status.key} value={status.key} className="text-[10px] uppercase font-bold">
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    <Button 
                        size="sm" 
                        variant="flat" 
                        className="w-full h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-800 border border-zinc-700" 
                        startContent={<Plus size={14}/>}
                    >
                        New Artifact (Ręcznie)
                    </Button>
                    <Button 
                        size="sm" 
                        variant="flat" 
                        className="w-full h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-800 border border-zinc-700" 
                        startContent={<Webhook size={14}/>}
                    >
                        Open n8n Workflow
                    </Button>
                </div>

            </ScrollShadow>
        </CardBody>
    );
};
