import { AgentConfig } from "../../../domain";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Bot } from "lucide-react";

interface AgentListProps {
    agents: AgentConfig[];
}

export const AgentList = ({ agents }: AgentListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => (
                <Card key={agent.role} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Bot className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{agent.role}</CardTitle>
                                    <CardDescription className="text-xs font-mono mt-1">{agent.model_tier}</CardDescription>
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
