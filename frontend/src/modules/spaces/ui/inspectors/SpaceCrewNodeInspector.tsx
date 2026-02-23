// frontend/src/modules/spaces/ui/inspectors/SpaceCrewNodeInspector.tsx

import React from "react";
import {
  CardBody,
  Button,
  Input,
  ScrollShadow,
  Select,
  SelectItem,
} from "@heroui/react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Play,
  Settings,
} from "lucide-react";
import { SpaceCrewInspectorProperties } from "../../domain/types";
import { LIST_OF_AVAILABLE_CREW_EXECUTION_STATUSES } from "../../domain/constants";

export const SpaceCrewNodeInspector = ({ 
    data, 
    onStatusChange 
}: SpaceCrewInspectorProperties) => (
    <CardBody className="p-0 flex flex-col h-full bg-black">
        {/* Functional Header Section */}
        <div className="p-6 border-b border-zinc-200">
             <Button 
                size="sm" 
                className="w-full font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all" 
                startContent={<Play size={14} />}
            >
                Execute Crew
            </Button>
        </div>

        <ScrollShadow className="flex-1">
            {/* Crew Status Selection Section */}
            <div className="p-6 space-y-2 border-b border-zinc-700">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Crew Status</label>
                <Select
                    selectedKeys={[data.state || 'missing_context']}
                    onSelectionChange={onStatusChange}
                    variant="bordered"
                    size="sm"
                    aria-label="Crew Status"
                    classNames={{
                      trigger: "h-9 bg-black border-zinc-700 hover:border-zinc-500 rounded-lg",
                      value: "text-xs font-mono text-zinc-300 font-bold uppercase",
                    }}
                >
                    {LIST_OF_AVAILABLE_CREW_EXECUTION_STATUSES.map((status) => (
                        <SelectItem key={status.statusKey} value={status.statusKey} className="text-[10px] uppercase font-bold">
                            {status.statusDisplayName}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            {/* State-specific Content Section */}
            {data.state === 'missing_context' && (
                <div className="p-6 space-y-6">
                    <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl">
                        <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <AlertCircle size={12} className="text-zinc-400" /> Note
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed italic">
                            Fill in the required context. The Content Pipeline needs this data to execute the sequence.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Proposed Sequence</h4>
                        <div className="space-y-4 relative">
                            <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-zinc-800"></div>
                            <div className="relative pl-8">
                                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 absolute left-0 flex items-center justify-center text-[10px] font-black text-zinc-400">1</div>
                                <p className="text-xs font-black text-white">Web Researcher</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold mt-0.5">Goal: Gather data</p>
                            </div>
                            <div className="relative pl-8">
                                <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 absolute left-0 flex items-center justify-center text-[10px] font-black text-zinc-400">2</div>
                                <p className="text-xs font-black text-white">Content Writer</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold mt-0.5">Goal: Write content</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button size="sm" className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-200 text-black rounded-md hover:bg-white transition-all">Approve</Button>
                        <Button size="sm" variant="flat" className="flex-1 font-black uppercase tracking-widest text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-700 hover:bg-zinc-800 rounded-md" startContent={<Settings size={14}/>}>Goals</Button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Context</h4>
                        <Input 
                            placeholder="Enter topic..." 
                            size="sm" 
                            variant="bordered"
                            classNames={{
                                input: "text-xs font-mono text-zinc-300",
                                inputWrapper: "h-9 bg-black border-zinc-700 hover:border-zinc-500 rounded-lg"
                            }}
                        />
                    </div>
                </div>
            )}

            {data.state === 'working' && (
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Live Hierarchy</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-black text-white">1. Web Researcher</span>
                                    <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-black uppercase">Done</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-mono">trends_list.md</p>
                            </div>
                            <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-black text-white">2. Content Writer</span>
                                    <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-black uppercase animate-pulse">Working</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-mono italic">&quot;Generating headlines...&quot;</p>
                            </div>
                        </div>
                    </div>
                    <Button variant="flat" size="sm" className="w-full font-black uppercase tracking-widest text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-700 hover:bg-red-950/30 hover:text-red-500 hover:border-red-900 transition-all rounded-md">Stop Work</Button>
                </div>
            )}

            {data.state === 'done' && (
                <div className="p-6 space-y-6">
                    <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-zinc-200" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Ready</span>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Details</h4>
                        <div className="text-xs space-y-2 text-zinc-400 font-mono">
                            <p>• Article about AI in education</p>
                            <p>• Over 2,000 words</p>
                            <p>• Clear structure with headings</p>
                        </div>
                        <div className="text-[10px] text-zinc-600 font-mono mt-4 uppercase font-bold">
                            4 min | 6,800 tokens
                        </div>
                    </div>
                </div>
            )}
        </ScrollShadow>
    </CardBody>
);
