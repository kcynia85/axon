import { Scenario } from "../types";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    FileSearch, 
    Code2, 
    Megaphone, 
    Mail, 
    Presentation, 
    Bug,
    PenTool,
    Search
} from "lucide-react";

const MOCK_SCENARIOS: Omit<Scenario, 'icon'>[] = [
    {
        id: "seo-report",
        title: "SEO Audit Report",
        description: "Generate a comprehensive SEO audit for a given URL, analyzing meta tags, performance, and keywords.",
        category: "Marketing",
        promptTemplate: "Analyze the SEO performance of {url}..."
    },
    {
        id: "code-review",
        title: "Code Review",
        description: "Review a code snippet for potential bugs, security issues, and style violations.",
        category: "Development",
        promptTemplate: "Review the following code for bugs..."
    },
    {
        id: "social-post",
        title: "Social Media Post",
        description: "Create engaging social media content for LinkedIn, Twitter, or Instagram based on a topic.",
        category: "Marketing",
        promptTemplate: "Write a LinkedIn post about {topic}..."
    },
    {
        id: "cold-email",
        title: "Cold Email Sequence",
        description: "Draft a 3-step cold email sequence for outreach to potential clients.",
        category: "Sales",
        promptTemplate: "Write a cold email sequence for..."
    },
    {
        id: "product-desc",
        title: "Product Description",
        description: "Generate persuasive product descriptions for e-commerce listings.",
        category: "Product",
        promptTemplate: "Describe a product with features..."
    },
    {
        id: "bug-report",
        title: "Bug Report Formatter",
        description: "Turn unstructured user feedback into a structured Jira bug report.",
        category: "Product",
        promptTemplate: "Format this feedback into a bug report..."
    }
];

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

export const ScenarioList = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SCENARIOS.map((scenario) => {
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
