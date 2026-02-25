// frontend/src/modules/spaces/ui/inspectors/SpaceAgentNodeInspector.tsx

import React from "react";
import {
  CardBody,
  Tabs,
  Tab,
  Input,
  ScrollShadow,
} from "@heroui/react";
import { 
  MessageSquare,
  Layers,
  FileText
} from "lucide-react";
import { SpaceAgentInspectorProperties } from "../../domain/types";

export const SpaceAgentNodeInspector = ({ 
    data, 
    onStatusChange 
}: SpaceAgentInspectorProperties) => (
    <CardBody className="p-0 flex flex-col h-full bg-black">
        <Tabs 
            aria-label="Inspector" 
            size="sm" 
            variant="underlined"
            classNames={{
                base: "w-full border-b border-zinc-200",
                tabList: "px-6 w-full gap-6",
                cursor: "w-full bg-zinc-200 h-[2px]",
                tab: "max-w-fit px-0 h-10 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                tabContent: "group-data-[selected=true]:text-white transition-colors"
            }}
        >
            <Tab key="chat" title={<div className="flex items-center gap-2"><MessageSquare size={12}/> Chat</div>}>
                <div className="flex flex-col h-[400px]">
                    <ScrollShadow className="flex-1 p-6 space-y-4">
                         <div className="flex gap-3">
                             <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-200"></div>
                             <div className="bg-zinc-900 border border-zinc-200 p-3 rounded-lg rounded-tl-none text-xs text-zinc-300 font-mono leading-relaxed">
                                 Analyze these user interviews.
                             </div>
                         </div>
                         <div className="flex gap-3 flex-row-reverse">
                             <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-200 flex items-center justify-center text-zinc-400 text-[8px] font-black">AG</div>
                             <div className="bg-zinc-900 border border-zinc-200 p-3 rounded-lg rounded-tr-none text-xs text-zinc-100 font-mono leading-relaxed shadow-none">
                                 Sure. Based on the 3 files provided, users are struggling with...
                             </div>
                         </div>
                    </ScrollShadow>
                    <div className="p-4 border-t border-zinc-200 bg-zinc-900/30">
                        <Input 
                            placeholder="Message agent..." 
                            size="sm" 
                            variant="bordered" 
                            classNames={{
                                input: "text-xs font-mono text-zinc-300 placeholder:text-zinc-600",
                                inputWrapper: "bg-black border-zinc-200 hover:border-zinc-500 focus-within:!border-zinc-200 rounded-lg h-9"
                            }}
                        />
                    </div>
                </div>
            </Tab>
            <Tab key="context" title={<div className="flex items-center gap-2"><Layers size={12}/> Context</div>}>
                <div className="p-6">
                     <div className="text-center border-2 border-dashed border-zinc-200 rounded-xl py-12 bg-zinc-900/20">
                         <p className="text-xs font-mono text-zinc-600">No context provided yet.</p>
                     </div>
                </div>
            </Tab>
            <Tab key="artefacts" title={<div className="flex items-center gap-2"><FileText size={12}/> Artefacts</div>}>
                <div className="p-6">
                     <div className="text-center border-2 border-dashed border-zinc-200 rounded-xl py-12 bg-zinc-900/20">
                         <p className="text-xs font-mono text-zinc-600">No artefacts generated yet.</p>
                     </div>
                </div>
            </Tab>
        </Tabs>
    </CardBody>
);
