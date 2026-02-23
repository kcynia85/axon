// frontend/src/modules/spaces/ui/inspectors/SpaceAutomationNodeInspector.tsx

import React from "react";
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
import { SpaceAutomationInspectorProperties } from "../../domain/types";
import { LIST_OF_AVAILABLE_ARTIFACT_STATUSES } from "../../domain/constants";

export const SpaceAutomationNodeInspector = ({ 
    data, 
    onArtifactStatusChange 
}: SpaceAutomationInspectorProperties) => (
    <CardBody className="p-0 flex flex-col h-full bg-black">
        <ScrollShadow className="flex-1 p-6 space-y-8">
            
            {/* Trigger Button */}
            <Button 
                className="w-full font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all" 
                startContent={<Webhook size={14} />}
            >
                Trigger (Webhook)
            </Button>

            {/* Context Section */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Context</h4>
                <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-400 italic">
                    [ File ]
                </div>
            </div>

            {/* Artefacts Section */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Artefacts</h4>
                <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            <FileJson size={16} className="text-zinc-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-xs font-black text-white">{data.artifactLabel || 'data.json'}</div>
                            <Select
                                selectedKeys={[data.artifactStatus || "pending"]}
                                onSelectionChange={onArtifactStatusChange}
                                variant="bordered"
                                size="sm"
                                aria-label="Artifact Status"
                                classNames={{
                                  trigger: "h-6 min-h-6 border-zinc-700 bg-black rounded-md",
                                  value: "text-[10px] font-black text-zinc-400 uppercase",
                                }}
                            >
                                {LIST_OF_AVAILABLE_ARTIFACT_STATUSES.map((status) => (
                                    <SelectItem key={status.statusKey} value={status.statusKey} className="text-[10px] uppercase font-bold">
                                        {status.statusDisplayName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
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
