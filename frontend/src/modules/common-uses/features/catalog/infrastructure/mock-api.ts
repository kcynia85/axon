import { Scenario } from "../../../domain";
import { simulateDelay } from "@/shared/infrastructure/mock-adapter";

const MOCK_SCENARIOS: Scenario[] = [
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

export const getScenariosMock = async (): Promise<Scenario[]> => {
    return simulateDelay(MOCK_SCENARIOS);
};