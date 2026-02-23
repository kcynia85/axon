// frontend/src/modules/spaces/ui/inspectors/SpaceAgentNodeInspector.tsx

import React from "react";
import {
  CardBody,
  Tabs,
  Tab,
  Button,
  Input,
  Textarea,
  Chip,
  ScrollShadow,
  Select,
  SelectItem,
} from "@heroui/react";
import { 
  Play, 
  Settings2,
  Terminal,
  Database,
  MessageSquare
} from "lucide-react";
import { SpaceAgentInspectorProperties } from "../../domain/types";
import { LIST_OF_AVAILABLE_AGENT_EXECUTION_STATUSES } from "../../domain/constants";

export const SpaceAgentNodeInspector = ({ 
    data, 
    onStatusChange 
}: SpaceAgentInspectorProperties) => (
    <CardBody className="p-0 flex flex-col h-full bg-black">
        {/* Actions Section */}
        <div className="p-6 border-b border-zinc-200 flex gap-3">
            <Button 
                size="sm" 
                className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all" 
                startContent={<Play size={12} fill="currentColor" />}
            >
                Run Task
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
            <Tab key="config" title={<div className="flex items-center gap-2"><Terminal size={12}/> Config</div>}>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Instructions</label>
                        <Textarea 
                            minRows={6} 
                            variant="bordered"
                            defaultValue="You are an expert User Researcher. Your goal is to synthesize qualitative data into actionable insights." 
                            classNames={{
                                input: "text-xs font-mono text-zinc-300 leading-relaxed",
                                inputWrapper: "bg-black border-zinc-200 hover:border-zinc-600 focus-within:!border-zinc-200 rounded-lg"
                            }}
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tools</label>
                        <div className="flex flex-wrap gap-2">
                            <Chip size="sm" radius="sm" classNames={{base: "bg-zinc-900 border border-zinc-200", content: "text-[10px] font-mono text-zinc-300"}}>SearchKnowledge</Chip>
                            <Chip size="sm" radius="sm" classNames={{base: "bg-zinc-900 border border-zinc-200", content: "text-[10px] font-mono text-zinc-300"}}>SummarizeText</Chip>
                            <Button size="sm" variant="flat" className="h-6 bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold px-2 rounded-sm border border-zinc-200 hover:text-white hover:border-zinc-500">+ Add</Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Agent Status</label>
                        <Select
                            selectedKeys={[data.state || "pending"]}
                            onSelectionChange={onStatusChange}
                            variant="bordered"
                            size="sm"
                            aria-label="Agent Status"
                            classNames={{
                                trigger: "bg-black border-zinc-200 hover:border-zinc-600 rounded-lg h-9 min-h-9",
                                value: "text-xs font-mono text-zinc-300 font-bold uppercase",
                                popoverContent: "bg-black border border-zinc-200 rounded-lg"
                            }}
                        >
                            {LIST_OF_AVAILABLE_AGENT_EXECUTION_STATUSES.map((status) => (
                                <SelectItem key={status.statusKey} value={status.statusKey} className="text-xs font-mono text-zinc-400 uppercase data-[hover=true]:bg-zinc-900 data-[hover=true]:text-white">
                                    {status.statusDisplayName}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
            </Tab>
            <Tab key="memory" title={<div className="flex items-center gap-2"><Database size={12}/> Memory</div>}>
                <div className="p-6">
                     <div className="text-center border-2 border-dashed border-zinc-200 rounded-xl py-12 bg-zinc-900/20">
                         <p className="text-xs font-mono text-zinc-600">Short-term memory empty.</p>
                     </div>
                </div>
            </Tab>
        </Tabs>
    </CardBody>
);
