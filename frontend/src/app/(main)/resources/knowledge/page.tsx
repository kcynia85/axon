import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Button } from "@/shared/ui/ui/button";
import { Plus, Database, FolderOpen } from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual API call
const knowledgeHubs = [
    { id: "1", name: "Product Documentation", description: "All product specs, user guides, and API docs", sourceCount: 12 },
    { id: "2", name: "Engineering Wiki", description: "Technical documentation and best practices", sourceCount: 45 },
    { id: "3", name: "Marketing Assets", description: "Brand guidelines, campaign materials, and content", sourceCount: 23 },
    { id: "4", name: "Legal & Compliance", description: "Contracts, policies, and regulatory documents", sourceCount: 8 },
];

const KnowledgeHubsPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Knowledge Base"
                description="Browse and manage knowledge hubs and sources."
            >
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Hub
                </Button>
            </PageHeader>
            <PageContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {knowledgeHubs.map((hub) => (
                        <Link key={hub.id} href={`/resources/knowledge/${hub.id}`}>
                            <Card className="hover:border-primary/50 transition-all cursor-pointer group h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Database className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                            <FolderOpen className="w-3 h-3" />
                                            {hub.sourceCount}
                                        </div>
                                    </div>
                                    <CardTitle className="text-base mt-3">{hub.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {hub.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </PageContent>
        </PageContainer>
    );
};

export default KnowledgeHubsPage;
