import { Tool } from "../../../domain";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Wrench, Database, Code2, Server } from "lucide-react";
import React from "react";

const getIcon = (type: string) => {
    switch(type) {
        case 'NATIVE': return Database;
        case 'MCP': return Server;
        case 'FUNCTION': return Code2;
        default: return Wrench;
    }
};

type ToolCatalogProps = {
    readonly tools: readonly Tool[];
}

export const ToolCatalog = ({ tools }: ToolCatalogProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
                const Icon = getIcon(tool.type);
                return (
                    <Card key={tool.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-muted rounded-lg">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <Badge variant="outline">{tool.type}</Badge>
                            </div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-0">
                            <div className="flex items-center gap-2 w-full">
                                <div className={`h-2 w-2 rounded-full ${tool.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`} 
/>
                                <span className="text-xs text-muted-foreground">{tool.status}</span>
                                <Button size="sm" variant="ghost" className="ml-auto">Details</Button>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};

