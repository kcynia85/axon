import { Scenario } from "../../../domain";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    FileSearch, 
    Code2, 
    Megaphone, 
    Mail, 
    PenTool,
    Bug,
    Search
} from "lucide-react";

// Helper to map icons since we can't store components in JSON easily
const getIcon = (id: string) => {
    switch(id) {
        case 'seo-report': return FileSearch;
        case 'code-review': return Code2;
        case 'social-post': return Megaphone;
        case 'cold-email': return Mail;
        case 'product-desc': return PenTool;
        case 'bug-report': return Bug;
        default: return Search;
    }
};

interface ScenarioListProps {
    items: Scenario[];
}

export const ScenarioList = ({ items }: ScenarioListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((scenario) => {
                const Icon = getIcon(scenario.id);
                return (
                    <Card key={scenario.id} className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <Badge variant="outline">{scenario.category}</Badge>
                            </div>
                            <CardTitle className="text-lg">{scenario.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {scenario.description}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-0">
                            <Button className="w-full" variant="secondary">Use Template</Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};
