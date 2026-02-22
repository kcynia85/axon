import { useCallback, useState } from "react";
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
  Search
} from "lucide-react";
import React from "react";

// Standard Workspace Colors mapping
const workspaceColorMap: Record<string, string> = {
    product: "blue",
    discovery: "purple",
    design: "pink",
    delivery: "green",
    growth: "yellow",
};

// Workspace Data
const workspaces = [
    { id: "product", name: "Product Management" },
    { id: "discovery", name: "Discovery" },
    { id: "design", name: "Design" },
    { id: "delivery", name: "Delivery" },
    { id: "growth", name: "Growth & Market" },
];

// Components Data (Mock)
type ComponentItem = { id: string; name: string; type: string };
type ComponentsMap = Record<string, ComponentItem[]>;

const components: ComponentsMap = {
    patterns: [
        { id: "interview", name: "Interview Analysis", type: "pattern" },
    ],
    crews: [
        { id: "design-crew", name: "Design Crew", type: "crew" },
    ],
    agents: [
        { id: "researcher", name: "User Researcher", type: "agent" },
        { id: "analyst", name: "Data Analyst", type: "agent" },
    ],
    templates: [
        { id: "prd", name: "PRD Template", type: "template" },
    ],
    services: [
        { id: "jira", name: "Jira Integration", type: "service" },
    ],
    automations: [
        { id: "notify", name: "Slack Notify", type: "automation" },
    ]
};

const componentConfig = [
    { key: "patterns", title: "Patterns", icon: Box },
    { key: "crews", title: "Crews", icon: Users },
    { key: "agents", title: "Agents", icon: UserRound },
    { key: "templates", title: "Templates", icon: FileText },
    { key: "services", title: "Services", icon: Globe },
    { key: "automations", title: "Automations", icon: Zap },
];

export const LeftSidebar: React.FC = () => {
    const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleWorkspaceClick = useCallback((id: string) => {
        setSelectedWorkspace(id);
        setSearchQuery(""); // Reset search when switching workspaces
    }, []);

    const handleBack = useCallback(() => {
        setSelectedWorkspace(null);
        setSearchQuery("");
    }, []);

    const onDragStart = useCallback((event: React.DragEvent<HTMLElement>, nodeType: string, data: unknown) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/axon-data', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    }, []);

    const filteredComponents: ComponentsMap = searchQuery.trim() === ""
        ? components
        : Object.entries(components).reduce<ComponentsMap>((acc, [key, list]) => {
            acc[key] = list.filter((componentItem) =>
                componentItem.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return acc;
        }, {} as ComponentsMap);

    const getWorkspaceHeaderClasses = (id: string) => {
        const color = workspaceColorMap[id] || 'blue';
        const colors: Record<string, string> = {
            blue: "bg-blue-600",
            purple: "bg-purple-600",
            pink: "bg-pink-600",
            green: "bg-green-600",
            yellow: "bg-yellow-500",
        };
        return colors[color];
    };

    const getWorkspaceHoverClasses = (id: string) => {
        const color = workspaceColorMap[id] || 'blue';
        const colors: Record<string, string> = {
            blue: "hover:bg-blue-600",
            purple: "hover:bg-purple-600",
            pink: "hover:bg-pink-600",
            green: "hover:bg-green-600",
            yellow: "hover:bg-yellow-500",
        };
        return colors[color];
    };

    return (
        <div className="h-[calc(100vh-280px)] mt-40 ml-8 pointer-events-auto flex flex-col select-none">
            
            {/* Level 1: Workspaces List */}
            {!selectedWorkspace && (
                <Card className="bg-black border border-zinc-200 shadow-2xl w-72 h-full rounded-2xl flex flex-col overflow-hidden">
                     <div className="px-6 py-4 border-b border-zinc-200">
                         <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">Workspaces</h2>
                     </div>
                    
                     <ScrollShadow className="flex-1">
                         <div className="flex flex-col py-3 px-3 gap-1">
                             {workspaces.map((workspaceItem) => (
                                <button
                                    key={workspaceItem.id}
                                    className={`flex items-center h-12 w-full px-4 text-sm font-black text-zinc-300 hover:text-white transition-all rounded-xl ${getWorkspaceHoverClasses(workspaceItem.id)}`}
                                    onClick={() => handleWorkspaceClick(workspaceItem.id)}
                                    draggable
                                    onDragStart={(event) => onDragStart(event as unknown as React.DragEvent<HTMLElement>, 'zone', {
                                        label: workspaceItem.name,
                                        type: workspaceItem.id,
                                        color: workspaceColorMap[workspaceItem.id]
                                    })}
                                >
                                    {workspaceItem.name}
                                </button>
                             ))}
                         </div>
                     </ScrollShadow>
                </Card>
            )}

            {/* Level 2: Components */}
            {selectedWorkspace && (
                <Card className="bg-black border border-zinc-200 shadow-2xl w-72 h-full rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
                    <CardBody className="p-0 flex flex-col h-full">
                        <div className={`p-6 border-b border-zinc-200 ${getWorkspaceHeaderClasses(selectedWorkspace)}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="solid" 
                                    onPress={handleBack}
                                    className="min-w-6 w-6 h-6 rounded-full bg-white/20 text-white hover:bg-white/40 border border-white/30"
                                >
                                    <ChevronLeft size={14} strokeWidth={3} />
                                </Button>
                                <span className="text-[10px] text-white/80 uppercase tracking-widest font-black">Back to Units</span>
                            </div>
                            <h3 className="font-black text-2xl leading-tight tracking-tight text-white">
                                {workspaces.find((w) => w.id === selectedWorkspace)?.name}
                            </h3>
                        </div>

                        <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-900/30">
                            <Input
                                size="sm"
                                variant="bordered"
                                placeholder="Search components..."
                                startContent={<Search size={14} className="text-zinc-500" />}
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                isClearable
                                classNames={{
                                    input: "text-xs font-bold text-zinc-300",
                                    inputWrapper: "h-9 rounded-lg border-zinc-200 bg-black shadow-sm",
                                }}
                            />
                        </div>
                        
                        <ScrollShadow className="flex-1">
                            <Accordion 
                                selectionMode="multiple" 
                                defaultExpandedKeys={["patterns", "crews", "agents"]}
                                itemClasses={{
                                    base: "w-full",
                                    title: "text-[10px] font-black uppercase tracking-widest text-zinc-500",
                                    trigger: "px-6 py-4 transition-colors hover:bg-zinc-900/50 border-b border-zinc-900",
                                    content: "px-4 pb-5 pt-2 bg-zinc-900/20"
                                }}
                            >
                                {componentConfig.map(({ key, title, icon: Icon }) => (
                                    <AccordionItem key={key} title={title}>
                                        <div className="flex flex-col gap-2 mt-1">
                                            {filteredComponents[key]?.map((comp) => (
                                                <div
                                                    key={comp.id}
                                                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 transition-all bg-black hover:border-zinc-600 cursor-grab active:cursor-grabbing group shadow-lg"
                                                    draggable
                                                    onDragStart={(event) => onDragStart(event as unknown as React.DragEvent<HTMLElement>, 'entity', {
                                                        label: comp.name,
                                                        type: comp.type,
                                                        zoneColor: workspaceColorMap[selectedWorkspace]
                                                    })}
                                                >
                                                    <GripVertical size={14} className="text-zinc-700 group-hover:text-zinc-500" />
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-200 text-zinc-400 group-hover:text-white transition-colors">
                                                        <Icon size={16} />
                                                    </div>
                                                    <span className="text-xs font-black text-zinc-300 group-hover:text-white">{comp.name}</span>
                                                </div>
                                            ))}
                                            {filteredComponents[key]?.length === 0 && (
                                                <p className="text-[10px] text-zinc-600 italic text-center py-2">No results found</p>
                                            )}
                                        </div>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </ScrollShadow>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};
