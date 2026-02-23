// frontend/src/modules/spaces/ui/inspectors/SpaceServiceNodeInspector.tsx

import React from "react";
import {
  CardBody,
  Button,
  ScrollShadow,
  Select,
  SelectItem,
  Divider
} from "@heroui/react";
import { 
  Plus,
  Music,
  Play,
  Settings2,
  ExternalLink
} from "lucide-react";
import { SpaceServiceInspectorProperties } from "../../domain/types";
import { LIST_OF_AVAILABLE_SERVICE_ARTIFACT_STATUSES } from "../../domain/constants";

export const SpaceServiceNodeInspector = ({ 
    data, 
    onArtifactStatusChange 
}: SpaceServiceInspectorProperties) => (
    <CardBody className="p-0 flex flex-col h-full bg-black">
        {/* Action Buttons Section */}
        <div className="p-6 border-b border-zinc-200 flex gap-3">
            <Button 
                size="sm" 
                className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all" 
                startContent={<Play size={12} fill="currentColor" />}
            >
                Trigger
            </Button>
            <Button 
                size="sm" 
                variant="flat" 
                className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-200 hover:bg-zinc-800 hover:text-white transition-all rounded-md" 
                startContent={<Settings2 size={12} />}
            >
                Config
            </Button>
        </div>

        <ScrollShadow className="flex-1 p-8 space-y-10">
            {/* Capability Info Section */}
            <div className="space-y-2">
                <h3 className="font-black text-2xl text-white tracking-tight">{data.label}</h3>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Type: Service / Integration</p>
            </div>

            <Divider className="bg-zinc-800" />

            {/* Active Action Section */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">Active Task</h4>
                <p className="text-sm font-black text-white italic">{data.actionName}</p>
            </div>

            {/* Artefacts Section */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.3em]">Artefacts</h4>
                
                <div className="p-4 bg-zinc-900/50 border border-zinc-700 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                            <Music size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="text-[11px] font-black text-white truncate">Intro_Voiceover_v1.mp3</div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase">Audio Stream</span>
                        </div>
                    </div>

                    <Select
                        selectedKeys={[data.artifactStatus || "pending"]}
                        onSelectionChange={onArtifactStatusChange}
                        variant="bordered"
                        size="sm"
                        aria-label="Artifact Status"
                        classNames={{
                            trigger: "h-8 min-h-8 border-zinc-700 bg-black rounded-lg",
                            value: "text-[10px] font-black text-zinc-400 uppercase tracking-wider",
                        }}
                    >
                        {LIST_OF_AVAILABLE_SERVICE_ARTIFACT_STATUSES.map((status) => (
                            <SelectItem key={status.statusKey} value={status.statusKey} className="text-[10px] uppercase font-bold">
                                {status.statusDisplayName}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Footer Actions Section */}
            <div className="space-y-3 pt-4">
                <Button 
                    size="sm" 
                    variant="flat" 
                    className="w-full h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-800 border border-zinc-700" 
                    startContent={<Plus size={14}/>}
                >
                    Dodaj Artefakt
                </Button>
                <Button 
                    size="sm" 
                    variant="flat" 
                    className="w-full h-10 bg-zinc-900 text-zinc-300 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-800 border border-zinc-700" 
                    startContent={<ExternalLink size={14}/>}
                >
                    Open {data.label}
                </Button>
            </div>
        </ScrollShadow>
    </CardBody>
);
