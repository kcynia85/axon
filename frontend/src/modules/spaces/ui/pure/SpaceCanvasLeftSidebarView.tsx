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
  UserRound, 
  FileText, 
  Globe, 
  Zap,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus
} from "lucide-react";

const configurationForComponentSections = [
    { sectionKey: "patterns", sectionTitle: "Patterns", sectionIcon: Box },
    { sectionKey: "crews", sectionTitle: "Crews", sectionIcon: Users },
    { sectionKey: "agents", sectionTitle: "Agents", sectionIcon: UserRound },
    { sectionKey: "templates", sectionTitle: "Templates", sectionIcon: FileText },
    { sectionKey: "services", sectionTitle: "Services", sectionIcon: Globe },
    { sectionKey: "automations", sectionTitle: "Automations", sectionIcon: Zap },
];

type WorkspaceUnitDisplay = {
    readonly identifier: string;
    readonly displayName: string;
    readonly hoverClassName: string;
    readonly onClick: () => void;
    readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
};

type ComponentItemDisplay = {
    readonly identifier: string;
    readonly displayName: string;
    readonly type: string;
    readonly hoverClassName: string;
    readonly onDragStart: (event: React.DragEvent<HTMLElement>) => void;
};

type SpaceCanvasLeftSidebarViewProperties = {
    readonly currentlySelectedWorkspaceIdentifier: string | null;
    readonly componentSearchQuery: string;
    readonly setComponentSearchQuery: (value: string) => void;
    readonly returnToWorkspaceSelection: () => void;
    readonly workspaceUnitsForDisplay: readonly WorkspaceUnitDisplay[];
    readonly activeWorkspaceDisplayName: string;
    readonly activeWorkspaceHeaderClassName: string;
    readonly filteredComponentCategoriesForDisplay: Record<string, readonly ComponentItemDisplay[]>;
    readonly onAddComponent?: (type: string, data: Record<string, unknown>, workspace: string) => void;
};

export const SpaceCanvasLeftSidebarView: React.FC<SpaceCanvasLeftSidebarViewProperties> = ({
    currentlySelectedWorkspaceIdentifier,
    componentSearchQuery,
    setComponentSearchQuery,
    returnToWorkspaceSelection,
    workspaceUnitsForDisplay,
    activeWorkspaceDisplayName,
    activeWorkspaceHeaderClassName,
    filteredComponentCategoriesForDisplay,
    onAddComponent
}) => {
    return (
        <div className="h-[calc(100vh-192px)] mt-44 ml-8 mb-6 pointer-events-auto flex flex-col select-none">
            
            {/* Level 1: Workspaces Selection View */}
            {!currentlySelectedWorkspaceIdentifier && (
                <Card className="bg-black border border-zinc-200 shadow-2xl w-72 h-full rounded-2xl flex flex-col overflow-hidden">
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
                <Card className="bg-black border border-zinc-200 shadow-2xl w-72 h-full rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
                    <CardBody className="p-0 flex flex-col h-full">
                        <div className={`p-6 border-b border-zinc-200 ${activeWorkspaceHeaderClassName}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="solid" 
                                    onPress={returnToWorkspaceSelection}
                                    className="min-w-6 w-6 h-6 rounded-full bg-white/20 text-white hover:bg-white/40 border border-white/30"
                                >
                                    <ChevronLeft size={14} strokeWidth={3} />
                                </Button>
                                <span className="text-[10px] text-white/80 uppercase tracking-widest font-black">Back to Units</span>
                            </div>
                            <h3 className="font-black text-2xl leading-tight tracking-tight text-white">
                                {activeWorkspaceDisplayName}
                            </h3>
                        </div>

                        <div className="px-4 py-4 border-b border-zinc-800 bg-zinc-900/30">
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
                                    inputWrapper: "h-10 rounded-xl border-zinc-700 bg-zinc-950 shadow-sm hover:border-zinc-500 transition-colors",
                                }}
                            />
                        </div>
                        
                        <ScrollShadow className="flex-1">
                            <Accordion 
                                selectionMode="multiple" 
                                defaultExpandedKeys={["patterns", "crews", "agents"]}
                                itemClasses={{
                                    base: "w-full",
                                    title: "text-[10px] font-black uppercase tracking-widest text-white/90",
                                    trigger: "px-6 py-4 transition-colors hover:bg-zinc-900/50 border-b border-zinc-800",
                                    content: "px-4 pb-5 pt-4 bg-transparent",
                                    indicator: "text-zinc-500 transition-transform duration-200 data-[open=true]:rotate-90"
                                }}
                            >
                                {configurationForComponentSections.map(({ sectionKey, sectionTitle, sectionIcon: SectionIcon }) => (
                                    <AccordionItem 
                                        key={sectionKey} 
                                        indicator={<ChevronRight size={16} />}
                                        title={
                                            <div className="flex items-center gap-2">
                                                <span>{sectionTitle}</span>
                                                <span className="text-[9px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
                                                    {filteredComponentCategoriesForDisplay[sectionKey]?.length || 0}
                                                </span>
                                            </div>
                                        }
                                    >
                                        <div className="flex flex-col gap-2.5">
                                            {filteredComponentCategoriesForDisplay[sectionKey]?.map((component) => (
                                                <div
                                                    key={component.identifier}
                                                    className={`flex items-center gap-3 p-3 rounded-2xl border border-zinc-800 transition-all bg-zinc-900/40 cursor-grab active:cursor-grabbing group shadow-sm ${component.hoverClassName}`}
                                                    draggable
                                                    onDragStart={component.onDragStart}
                                                >
                                                    <GripVertical size={14} className="text-zinc-700 group-hover:text-zinc-500" />
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-white transition-colors">
                                                        <SectionIcon size={18} />
                                                    </div>
                                                    <span className="flex-1 text-xs font-black text-zinc-200 group-hover:text-white truncate tracking-tight">{component.displayName}</span>
                                                    
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="light"
                                                        className="w-7 h-7 min-w-7 rounded-lg text-zinc-600 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
                                                        onPress={() => onAddComponent?.(component.type, {
                                                            label: component.displayName,
                                                            type: component.type,
                                                        }, currentlySelectedWorkspaceIdentifier ?? "")}
                                                    >
                                                        <Plus size={14} strokeWidth={3} />
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
