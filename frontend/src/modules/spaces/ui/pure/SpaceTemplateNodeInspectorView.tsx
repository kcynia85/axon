// frontend/src/modules/spaces/ui/pure/SpaceTemplateNodeInspectorView.tsx

import React from "react";
import dynamic from "next/dynamic";
import {
  CardBody,
  Button,
  ScrollShadow,
  Checkbox,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import { 
  Plus,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Archive,
} from "lucide-react";
import { SpaceTemplateDomainData, TemplateAction } from "../../domain/types";
import { cn } from "@/shared/lib/utils";

const SpaceTemplateCustomActionsEditor = dynamic(
  () => import("../inspectors/components/SpaceTemplateCustomActionsEditor").then(mod => mod.SpaceTemplateCustomActionsEditor),
  { ssr: false }
);

type SpaceTemplateNodeInspectorViewProps = {
    readonly data: SpaceTemplateDomainData;
    readonly isAllDone: boolean;
    readonly groupedActions: Record<string, TemplateAction[]>;
    readonly onActionToggle: (id: string) => void;
    readonly onCustomActionsChange: (content: string) => void;
};

export const SpaceTemplateNodeInspectorView = ({
    data,
    isAllDone,
    groupedActions,
    onActionToggle,
    onCustomActionsChange,
}: SpaceTemplateNodeInspectorViewProps) => {
    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <Tabs 
                aria-label="Template Sections" 
                variant="underlined"
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors"
                }}
            >
                <Tab 
                    key="actions" 
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12}/> 
                            Actions
                            {isAllDone && <CheckCircle2 size={10} className="text-green-500" />}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
                        <div className="space-y-12">
                            {Object.entries(groupedActions).map(([sectionName, actions]) => (
                                <div key={sectionName} className="space-y-5">
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-sm font-black text-white">{sectionName}</h4>
                                        <Divider className="bg-zinc-800/50" />
                                    </div>
                                    <div className="flex flex-col gap-3.5 pl-1">
                                        {actions.map((action) => (
                                            <Checkbox 
                                                key={action.id}
                                                size="sm" 
                                                radius="full"
                                                isSelected={action.isCompleted}
                                                onValueChange={() => onActionToggle(action.id)}
                                                classNames={{
                                                    label: cn(
                                                        "text-xs font-bold transition-all", 
                                                        action.isCompleted ? "text-zinc-500 line-through" : "text-zinc-300"
                                                    ),
                                                    wrapper: "after:bg-zinc-200"
                                                }}
                                            >
                                                {action.label}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Additional Actions Section with BlockNote */}
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Notatki</h4>
                                        
                                    </div>
                                    
                                </div>
                                <div>
                                    <SpaceTemplateCustomActionsEditor 
                                        initialContent={data.customActionsContent}
                                        onChange={onCustomActionsChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollShadow>
                </Tab>

                <Tab key="context" title={<div className="flex items-center gap-2"><LinkIcon size={12}/> Context</div>}>
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
                        <div className="space-y-8">
                            {data.contexts?.map((context) => (
                                <div key={context.id} className="space-y-2">
                                    <h4 className="text-xs font-black text-white tracking-tight">{context.label}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 cursor-pointer hover:bg-zinc-800 transition-colors">
                                        <LinkIcon size={10} />
                                        <span>[ Link ]</span>
                                    </div>
                                </div>
                            ))}
                            {(!data.contexts || data.contexts.length === 0) && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No context links provided.</p>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>

                <Tab key="artefacts" title={<div className="flex items-center gap-2"><Archive size={12}/> Artefacts</div>}>
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
                        <div className="space-y-10">
                            {data.artefacts?.map((art) => (
                                <div key={art.id} className="space-y-2.5">
                                    <h4 className="text-xs font-black text-white tracking-tight">{art.label}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors">
                                        <Plus size={10} />
                                        <span>[ Wklej link ]</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 ml-1">
                                        {art.status === 'completed' ? (
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-green-500 uppercase tracking-wider">
                                                <div className="w-1 h-1 rounded-full bg-green-500" />
                                                Completed
                                            </div>
                                        ) : art.status === 'in_progress' ? (
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-400 uppercase tracking-wider">
                                                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                                                In Progress
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                                                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                                Pending
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            <Button 
                                size="sm" 
                                variant="flat"
                                className="w-full h-11 bg-zinc-900 text-zinc-400 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-800 border border-zinc-800 transition-colors mt-4"
                                startContent={<Plus size={14}/>}
                            >
                                Dodaj Artefakt
                            </Button>
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>
        </CardBody>
    );
};
