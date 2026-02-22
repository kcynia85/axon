'use client';

import { Scenario } from "../../../domain";
import { ProjectStatus } from "@/modules/projects/domain";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { Badge } from "@/shared/ui/ui/Badge";
import { 
    FileSearch, 
    Code2, 
    Megaphone, 
    Mail, 
    PenTool,
    Bug,
    Search,
    Globe,
    FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject } from "@/modules/projects/features/browse-projects/infrastructure/api";

// Helper to map icons
const getIcon = (iconName?: string) => {
    switch(iconName) {
        case 'globe': return Globe;
        case 'code': return Code2;
        case 'pen': return PenTool;
        case 'file-text': return FileText;
        case 'seo-report': return FileSearch;
        case 'social-post': return Megaphone;
        case 'cold-email': return Mail;
        case 'bug-report': return Bug;
        default: return Search;
    }
};

interface ScenarioListProps {
    items: Scenario[];
}

export const ScenarioList = ({ items }: ScenarioListProps) => {
    const router = useRouter();

    const handleUseTemplate = async (scenario: Scenario) => {
        try {
            toast.message("Creating project from template...");
            // Create a new project based on the template
            // In a real app, this might open a dialog to let user rename the project first.
            // For now, we auto-generate a name.
            
            // Map category to domain or default to product
            let domain: HubType = HubType.PRODUCT;
            const categoryLower = scenario.category.toLowerCase();
            if (categoryLower.includes("research")) domain = HubType.DISCOVERY;
            if (categoryLower.includes("engineering") || categoryLower.includes("code")) domain = HubType.DELIVERY;
            if (categoryLower.includes("design")) domain = HubType.DESIGN;
            if (categoryLower.includes("marketing") || categoryLower.includes("growth")) domain = HubType.GROWTH;
            if (categoryLower.includes("content") || categoryLower.includes("writing")) domain = HubType.WRITING;

            const project = await createProject({
                name: `${scenario.title} Project`,
                description: `Created from template: ${scenario.title}`,
                domain: domain, 
                status: ProjectStatus.IDEA
            });

            
            toast.success("Project created!");
            router.push(`/projects/${project.id}`);
        } catch (error) {
            console.error("Failed to use template:", error);
            toast.error("Failed to use template");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((scenario) => {
                const Icon = getIcon(scenario.icon);
                return (
                    <Card key={scenario.id} className="flex flex-col hover:border-primary/50 transition-colors group">
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
                            <Button className="w-full" variant="secondary" onClick={() => handleUseTemplate(scenario)}>
                                Use Template
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};
