import { LucideIcon } from "lucide-react";

export interface Scenario {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    category: "Marketing" | "Development" | "Product" | "Sales";
    promptTemplate: string;
}
