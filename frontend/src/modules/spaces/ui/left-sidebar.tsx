import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  ScrollShadow,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { 
  Box, 
  Users, 
  Bot, 
  FileText, 
  Globe, 
  Zap,
  GripVertical,
  ChevronLeft
} from "lucide-react";

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
const components = {
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
    { key: "patterns", title: "Patterns", icon: Box, color: "text-purple-700", darkColor: "dark:text-purple-400", bg: "bg-purple-100", darkBg: "dark:bg-purple-900/40" },
    { key: "crews", title: "Crews", icon: Users, color: "text-orange-700", darkColor: "dark:text-orange-400", bg: "bg-orange-100", darkBg: "dark:bg-orange-900/40" },
    { key: "agents", title: "Agents", icon: Bot, color: "text-blue-700", darkColor: "dark:text-blue-400", bg: "bg-blue-100", darkBg: "dark:bg-blue-900/40" },
    { key: "templates", title: "Templates", icon: FileText, color: "text-default-800", darkColor: "dark:text-default-200", bg: "bg-default-100", darkBg: "dark:bg-default-800" },
    { key: "services", title: "Services", icon: Globe, color: "text-cyan-700", darkColor: "dark:text-cyan-400", bg: "bg-cyan-100", darkBg: "dark:bg-cyan-900/40" },
    { key: "automations", title: "Automations", icon: Zap, color: "text-yellow-700", darkColor: "dark:text-yellow-400", bg: "bg-yellow-100", darkBg: "dark:bg-yellow-900/40" },
];

export const LeftSidebar = () => {
    const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

    const handleWorkspaceClick = (id: string) => {
        setSelectedWorkspace(id);
    };

    const handleBack = () => {
        setSelectedWorkspace(null);
    };

    const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/axon-data', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    const getWorkspaceColorClasses = (id: string) => {
        const color = workspaceColorMap[id] || 'blue';
        const hoverClasses: Record<string, string> = {
            blue: "hover:bg-blue-600 dark:hover:bg-blue-500",
            purple: "hover:bg-purple-600 dark:hover:bg-purple-500",
            pink: "hover:bg-pink-600 dark:hover:bg-pink-500",
            green: "hover:bg-green-600 dark:hover:bg-green-500",
            yellow: "hover:bg-yellow-500 dark:hover:bg-yellow-400",
        };
        return `text-default-700 dark:text-default-200 hover:text-white font-bold transition-all ${hoverClasses[color]}`;
    };

    const getWorkspaceHeaderClasses = (id: string) => {
        const color = workspaceColorMap[id] || 'blue';
        const colors: Record<string, string> = {
            blue: "bg-blue-600 text-white",
            purple: "bg-purple-600 text-white",
            pink: "bg-pink-600 text-white",
            green: "bg-green-600 text-white",
            yellow: "bg-yellow-500 text-white",
        };
        return colors[color];
    };

    return (
        <div className="h-[calc(100vh-150px)] mt-24 ml-6 pointer-events-auto flex flex-col">
            
            {/* Level 1: Workspaces List */}
            {!selectedWorkspace && (
                <Card className="bg-background border border-default-200 shadow-xl w-64 h-full rounded-2xl flex flex-col py-4 animate-in fade-in slide-in-from-left-4 duration-200">
                     <div className="px-5 pb-3 border-b border-default-200 mb-3">
                         <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-default-900 dark:text-default-100">Workspaces</h2>
                     </div>
                     
                     <ScrollShadow className="flex-1 px-3">
                         <div className="flex flex-col gap-1.5">
                             {workspaces.map((ws) => (
                                <Button
                                    key={ws.id}
                                    variant="light"
                                    className={`justify-start h-12 w-full px-4 rounded-xl text-sm ${getWorkspaceColorClasses(ws.id)}`}
                                    onPress={() => handleWorkspaceClick(ws.id)}
                                    draggable
                                    onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, 'zone', { 
                                        label: ws.name, 
                                        type: ws.id, 
                                        color: workspaceColorMap[ws.id] 
                                    })}
                                >
                                    {ws.name}
                                </Button>
                             ))}
                         </div>
                     </ScrollShadow>
                </Card>
            )}

            {/* Level 2: Components */}
            {selectedWorkspace && (
                <Card className="bg-background border border-default-300 dark:border-default-700 shadow-2xl w-64 h-full rounded-2xl flex flex-col animate-in fade-in slide-in-from-right-4 duration-200">
                    <CardBody className="p-0 overflow-hidden flex flex-col h-full">
                        <div className={`p-5 border-b border-black/10 dark:border-white/10 ${getWorkspaceHeaderClasses(selectedWorkspace)}`}>
                            <div className="flex items-center gap-1 mb-3">
                                <Button 
                                    isIconOnly 
                                    size="sm" 
                                    variant="solid" 
                                    onPress={handleBack}
                                    className="min-w-6 w-6 h-6 rounded-full bg-white text-black dark:bg-black dark:text-white hover:scale-110 transition-transform shadow-md"
                                >
                                    <ChevronLeft size={14} strokeWidth={3} />
                                </Button>
                                <span className="text-[10px] text-white/80 dark:text-white/70 uppercase tracking-widest font-black ml-1">Back</span>
                            </div>
                            <h3 className="font-black text-xl leading-tight tracking-tight capitalize text-white">
                                {workspaces.find(w => w.id === selectedWorkspace)?.name}
                            </h3>
                        </div>
                        
                        <ScrollShadow className="flex-1">
                            <Accordion 
                                selectionMode="multiple" 
                                defaultExpandedKeys={["patterns", "crews", "agents"]}
                                itemClasses={{
                                    title: "text-[11px] font-black uppercase tracking-widest text-default-900 dark:text-default-100",
                                    trigger: "px-5 py-4 transition-colors border-b border-default-100 dark:border-default-800",
                                    content: "px-4 pb-5"
                                }}
                            >
                                {componentConfig.map((config) => (
                                    <AccordionItem key={config.key} title={config.title}>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {/* @ts-ignore */}
                                            {components[config.key]?.map((comp: any) => (
                                                <div 
                                                    key={comp.id}
                                                    className="flex items-center gap-3 p-3 rounded-xl border border-default-200 dark:border-default-800 transition-all bg-white dark:bg-[#1a1a1a] shadow-sm cursor-grab active:cursor-grabbing group hover:border-default-400 dark:hover:border-default-500"
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, 'entity', { 
                                                        label: comp.name, 
                                                        type: comp.type,
                                                        zoneColor: workspaceColorMap[selectedWorkspace]
                                                    })}
                                                >
                                                    <GripVertical size={14} className="text-default-300 group-hover:text-default-500" />
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${config.bg} ${config.darkBg} ${config.color} ${config.darkColor} shadow-sm group-hover:scale-110 transition-transform`}>
                                                        <config.icon size={18} />
                                                    </div>
                                                    <span className="text-xs font-black text-default-900 dark:text-default-50">{comp.name}</span>
                                                </div>
                                            ))}
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
