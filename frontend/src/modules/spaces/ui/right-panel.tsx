"use client";

import { useState } from "react";
import { Node } from "@xyflow/react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Button } from "@/shared/ui/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/tabs";
import { 
  X, 
  Bot, 
  Users, 
  Layers, 
  FileText, 
  Wrench, 
  Zap,
  Play,
  Square,
  Settings,
  Terminal,
  FileInput,
  FileOutput,
  Activity,
  ChevronDown,
  ChevronRight,
  Plus
} from "lucide-react";

interface RightPanelProps {
  selectedNode: Node | null;
  className?: string;
  onClose?: () => void;
}

const typeIcons: Record<string, React.ElementType> = {
  agent: Bot,
  crew: Users,
  pattern: Layers,
  template: FileText,
  service: Wrench,
  automation: Zap,
  note: FileText,
  shape: Activity,
};

const typeColors: Record<string, string> = {
  agent: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  crew: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  pattern: "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  template: "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
  service: "bg-cyan-100 text-cyan-700 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800",
  automation: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  note: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  shape: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function RightPanel({ selectedNode, className, onClose }: RightPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["details", "context"]);

  if (!selectedNode) {
    return (
      <div className={cn("border-l bg-muted/30 flex items-center justify-center", className)}>
        <div className="text-center p-6">
          <p className="text-sm text-muted-foreground">Select a node to view details</p>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.type || "unknown";
  const Icon = typeIcons[nodeType] || Bot;
  const colors = typeColors[nodeType] || "bg-muted text-muted-foreground";
  const data = selectedNode.data as { 
    label?: string; 
    status?: string; 
    runtime?: Record<string, unknown>;
    context?: Record<string, unknown>[];
    artifacts?: Record<string, unknown>[];
  };
  const processType = data.runtime?.process_type as string | undefined;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const SectionHeader = ({ 
    title, 
    icon: IconComponent, 
    section,
    badge
  }: { 
    title: string; 
    icon: React.ElementType; 
    section: string;
    badge?: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-2">
        <IconComponent className="w-5 h-5 text-muted-foreground" />
        <span className="font-semibold text-base">{title}</span>
        {badge && (
          <Badge variant="secondary" className="text-sm">{badge}</Badge>
        )}
      </div>
      {expandedSections.includes(section) ? (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className={cn("flex flex-col h-full bg-card text-card-foreground border-l shadow-lg w-96", className)}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("px-2 py-1", colors)}>
            <Icon className="w-3 h-3 mr-1" />
            {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </Badge>
          {processType && (
            <Badge variant="outline" className="text-xs capitalize border-muted-foreground/20">
              {processType}
            </Badge>
          )}
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Editable Node Name */}
      <div className="p-4 border-b">
        <input
          type="text"
          defaultValue={data.label || "Unnamed Node"}
          className="w-full font-bold text-lg bg-transparent border border-transparent hover:border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Section: Node Details */}
        <div className="border-b">
          <SectionHeader title="Node Details" icon={Settings} section="details" />
          {expandedSections.includes("details") && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex justify-between items-center text-base">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={data.status === "Working" ? "default" : "secondary"} className="text-sm">
                  {data.status || "Idle"}
                </Badge>
              </div>
              {processType && (
                <div className="flex justify-between items-center text-base">
                  <span className="text-muted-foreground">Process Type</span>
                  <span className="capitalize font-medium">{processType}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base">
                <span className="text-muted-foreground">Node ID</span>
                <span className="text-sm font-mono text-muted-foreground/70">
                  {selectedNode.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center text-base">
                <span className="text-muted-foreground">Position</span>
                <span className="text-sm text-muted-foreground/70 font-mono">
                  x: {Math.round(selectedNode.position.x)}, y: {Math.round(selectedNode.position.y)}
                </span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button size="sm" className="flex-1 gap-2">
                  <Play className="w-3.5 h-3.5" />
                  Run
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Square className="w-3.5 h-3.5" />
                  Stop
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Section: Context (Inputs) */}
        <div className="border-b">
          <SectionHeader 
            title="Context (Inputs)" 
            icon={FileInput} 
            section="context"
            badge={data.context ? `${data.context.length}` : "0"}
          />
          {expandedSections.includes("context") && (
            <div className="px-4 pb-4">
              {data.context && data.context.length > 0 ? (
                <div className="space-y-3">
                  {data.context.map((ctx, idx) => (
                    <Card key={idx} className="bg-muted/50 border-l-4 border-l-primary">
                      <CardContent className="p-3">
                        <div className="font-semibold text-primary mb-2 text-sm">Input {idx + 1}</div>
                        <pre className="text-xs overflow-x-auto text-muted-foreground">
                          {JSON.stringify(ctx, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed rounded-xl bg-muted/20">
                  <p className="text-sm text-muted-foreground">No context inputs defined</p>
                  <Button variant="ghost" size="sm" className="mt-3 gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Add Context
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section: Artifacts (Outputs) */}
        <div className="border-b">
          <SectionHeader 
            title="Artifacts (Outputs)" 
            icon={FileOutput} 
            section="artifacts"
            badge={data.artifacts ? `${data.artifacts.length}` : "0"}
          />
          {expandedSections.includes("artifacts") && (
            <div className="px-4 pb-4">
              {data.artifacts && data.artifacts.length > 0 ? (
                <div className="space-y-3">
                  {data.artifacts.map((artifact, idx) => (
                    <Card key={idx} className="bg-muted/50 border-l-4 border-l-green-500">
                      <CardContent className="p-3">
                        <div className="font-semibold text-green-600 dark:text-green-400 mb-2 text-sm">Output {idx + 1}</div>
                        <pre className="text-xs overflow-x-auto text-muted-foreground">
                          {JSON.stringify(artifact, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed rounded-xl bg-muted/20">
                  <p className="text-sm text-muted-foreground">No artifacts defined</p>
                  <Button variant="ghost" size="sm" className="mt-3 gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Add Artifact
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section: Execution Status (Logs, Outputs) */}
        <div className="border-b">
          <SectionHeader title="Execution Status" icon={Terminal} section="execution" />
          {expandedSections.includes("execution") && (
            <div className="px-4 pb-4">
              <Tabs defaultValue="logs" className="w-full">
                <TabsList className="w-full grid grid-cols-2 h-9">
                  <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
                  <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
                </TabsList>
                <TabsContent value="logs" className="mt-3">
                  <Card className="bg-slate-950 text-slate-100 border-none">
                    <CardContent className="p-4 font-mono text-[11px] space-y-1 leading-relaxed">
                      <p className="text-slate-400">[14:23:45] Node initialized</p>
                      <p className="text-slate-400">[14:23:46] Waiting for input...</p>
                      <p className="text-green-400">[14:23:50] Execution started</p>
                      <p className="text-blue-400">[14:24:05] Processing...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="output" className="mt-3">
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="p-4 flex items-center justify-center min-h-[100px]">
                      <p className="text-xs text-muted-foreground text-center">No output yet. Run node to see results.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
