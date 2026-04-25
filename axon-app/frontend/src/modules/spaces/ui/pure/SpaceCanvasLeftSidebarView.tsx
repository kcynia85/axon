// frontend/src/modules/spaces/ui/pure/SpaceCanvasLeftSidebarView.tsx

import React from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  ScrollShadow,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { 
  Box, 
  Users, 
  Bot, 
  FileText, 
  Cloud, 
  Zap,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus
} from "lucide-react";
import { SpaceCanvasLeftSidebarProperties } from "../types";
import { cn } from "@/shared/lib/utils";

const configurationForComponentSections = [
    { sectionKey: "patterns", sectionTitle: "Patterns", sectionIcon: Box },
    { sectionKey: "crews", sectionTitle: "Crews", sectionIcon: Users },
    { sectionKey: "agents", sectionTitle: "Agents", sectionIcon: Bot },
    { sectionKey: "templates", sectionTitle: "Templates", sectionIcon: FileText },
    { sectionKey: "services", sectionTitle: "Services", sectionIcon: Cloud },
    { sectionKey: "automations", sectionTitle: "Automations", sectionIcon: Zap },
];

export const SpaceCanvasLeftSidebarView: React.FC<SpaceCanvasLeftSidebarProperties> = ({
    currentlySelectedWorkspaceIdentifier,
    componentSearchQuery,
    setComponentSearchQuery,
    returnToWorkspaceSelection,
    workspaceUnitsForDisplay,
    activeWorkspaceDisplayName,
    activeWorkspaceHeaderClassName,
    activeWorkspaceColor,
    filteredComponentCategoriesForDisplay,
    onAddComponent
}) => {
    return (
        <div className="h-[calc(100vh-192px)] mt-44 ml-8 mb-6 pointer-events-auto flex flex-col select-none">
            
            {/* Level 1: Workspaces Selection View */}
            {!currentlySelectedWorkspaceIdentifier && (
                <Card className="bg-black border border-zinc-200  w-64 h-full rounded-2xl flex flex-col overflow-hidden">
                     <div className="px-6 py-4 border-b border-zinc-200">
                         <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">Workspaces</h2>
                     </div>
                    
                     <ScrollShadow className="flex-1">
                         <div className="flex flex-col py-3 px-3 gap-1">
                             {workspaceUnitsForDisplay.map((unit) => (
                                <button
                                    key={unit.identifier}
                                    className={`flex items-center h-12 w-full px-4 text-sm font-black text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer ${unit.hoverClassName}`}
                                    onClick={unit.onClick}
                                    draggable
                                    onDragStart={unit.onDragStart}
                                >
                                    {unit.displayName}
                                </button>
                             ))}
                         </div>
                     </ScrollShadow>
                </Card>
            )}

            {/* Level 2: Components Catalog View */}
            {currentlySelectedWorkspaceIdentifier && (
                <Card className="bg-black border border-zinc-200  w-64 h-full rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
                    <CardBody className="p-0 flex flex-col h-full">
                        <div className={cn(
                            "p-6 border-b border-zinc-800",
                            activeWorkspaceColor === 'purple' ? 'bg-purple-950' :
                            activeWorkspaceColor === 'blue' ? 'bg-blue-950' :
                            activeWorkspaceColor === 'pink' ? 'bg-pink-950' :
                            activeWorkspaceColor === 'green' ? 'bg-green-950' :
                            activeWorkspaceColor === 'yellow' ? 'bg-yellow-950' :
                            activeWorkspaceColor === 'orange' ? 'bg-orange-950' :
                            'bg-zinc-950'
                        )}>
                            <div className="flex items-center gap-2 mb-4">
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="solid" 
                                    onPress={returnToWorkspaceSelection}
                                    className="min-w-6 w-6 h-6 rounded-full bg-white text-white hover:bg-white border border-white"
                                >
                                    <ChevronLeft 
                                        size={16} 
                                        strokeWidth={2} 
                                        style={{
                                            color: activeWorkspaceColor === 'purple' ? 'rgb(126, 34, 206)' : // purple-700
                                                   activeWorkspaceColor === 'blue' ? 'rgb(29, 78, 216)' :    // blue-700
                                                   activeWorkspaceColor === 'pink' ? 'rgb(190, 24, 93)' :    // pink-700
                                                   activeWorkspaceColor === 'green' ? 'rgb(21, 128, 61)' :   // green-700
                                                   activeWorkspaceColor === 'yellow' ? 'rgb(161, 98, 7)' :   // yellow-700
                                                   activeWorkspaceColor === 'orange' ? 'rgb(194, 65, 12)' :  // orange-700
                                                   'rgb(39, 39, 42)' // zinc-800
                                        }}
                                    />

                                </Button>
                                <span className="text-[10px] text-white uppercase tracking-widest font-black">Back to Units</span>
                            </div>
                            <h3 className="font-black text-2xl leading-tight tracking-tight text-white">
                                {activeWorkspaceDisplayName}
                            </h3>
                        </div>

                        <div className="px-4 py-4 border-b border-zinc-800 bg-zinc-900">
                            <Input
                                size="sm"
                                variant="bordered"
                                placeholder="Search components..."
                                startContent={<Search size={14} className="text-zinc-500" />}
                                value={componentSearchQuery}
                                onValueChange={setComponentSearchQuery}
                                isClearable
                                classNames={{
                                    input: "text-xs font-bold text-zinc-300",
                                    inputWrapper: "h-10 rounded-xl border-zinc-700 bg-zinc-950  hover:border-zinc-500 transition-colors",
                                }}
                            />
                        </div>
                        
                        <ScrollShadow className="flex-1">
                            <Accordion 
                                className="-ml-2"
                                selectionMode="multiple" 
                                defaultExpandedKeys={["patterns", "crews", "agents"]}
                                itemClasses={{
                                    base: "w-full",
                                    title: "text-[12px] font-black text-white",
                                    trigger: "px-6 py-4 transition-all hover:bg-zinc-900 rounded-xl mx-2 my-0.5",
                                    content: "px-4 pb-5 pt-4",
                                    indicator: "text-zinc-500 transition-transform duration-200 data-[open=true]:rotate-90"
                                }}
                            >
                                {configurationForComponentSections.map(({ sectionKey, sectionTitle, sectionIcon: SectionIcon }) => (
                                    <AccordionItem 
                                        key={sectionKey} 
                                        indicator={<ChevronRight size={16} />}

                                        title={
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16]">{sectionTitle}</span>
                                                <span className="text-[10px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
                                                    {filteredComponentCategoriesForDisplay[sectionKey]?.length || 0}
                                                </span>
                                            </div>
                                        }
                                    >
                                        <div className="flex flex-col gap-2.5">
                                            {filteredComponentCategoriesForDisplay[sectionKey]?.map((component) => (
                                                <div
                                                    key={component.identifier}
                                                    className={`flex items-center gap-3 p-3 rounded-2xl border border-zinc-800 transition-all bg-zinc-900 cursor-grab active:cursor-grabbing group  ${component.hoverClassName}`}
                                                    draggable
                                                    onDragStart={component.onDragStart}
                                                >
                                                    <GripVertical size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
                                                        <SectionIcon size={18} />
                                                    </div>
                                                    <span className="flex-1 text-xs font-black text-zinc-200 group-hover:text-white truncate tracking-tight">{component.displayName}</span>
                                                    
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="w-7 h-7 min-w-7 rounded-lg text-zinc-600 hover:text-white hover:bg-white transition-all"
                                                        onPress={() => onAddComponent?.(component.type, {
                                                            ...component.rawData,
                                                            label: component.displayName,
                                                            type: component.type,
                                                            zoneColor: component.zoneColor,
                                                        }, currentlySelectedWorkspaceIdentifier ?? "")}
                                                    >
                                                        <Plus size={14} strokeWidth={3} className="text-zinc-600 group-hover:text-white transition-colors" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {filteredComponentCategoriesForDisplay[sectionKey]?.length === 0 && (
                                                <p className="text-[10px] text-zinc-600 italic text-center py-2">No results found</p>
                                            )}
                                        </div>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            <div className="h-20 w-full" />
                        </ScrollShadow>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};
