import { AgentRole, AgentConfig } from "../../../domain";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Bot } from "lucide-react";

const MOCK_AGENTS: AgentConfig[] = [
    {
        role: AgentRole.MANAGER,
        description: "Orchestrates complex tasks and delegates to other agents.",
        tools: ["delegate_task", "review_plan"],
        model: "gemini-1.5-pro"
    },
    {
        role: AgentRole.RESEARCHER,
        description: "Searches knowledge base and internet for information.",
        tools: ["search_knowledge", "find_asset"],
        model: "gemini-1.5-flash"
    },
    {
        role: AgentRole.BUILDER,
        description: "Writes code and implements solutions.",
        tools: ["write_code", "read_code"],
        model: "claude-3-5-sonnet" // Fallback example
    },
    {
        role: AgentRole.WRITER,
        description: "Creates content and documentation.",
        tools: ["write_markdown"],
        model: "gemini-1.5-flash"
    }
];

export const AgentList = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_AGENTS.map((agent) => (
                <Card key={agent.role} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Bot className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{agent.role}</CardTitle>
                                    <CardDescription className="text-xs font-mono mt-1">{agent.model}</CardDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Settings2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground mb-4">
                            {agent.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {agent.tools.map((tool) => (
                                <Badge key={tool} variant="secondary" className="text-xs">
                                    {tool}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full">Configure</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
