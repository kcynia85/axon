import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Button } from "@/shared/ui/ui/button";
import { Badge } from "@/shared/ui/ui/badge";
import { Plus, FileText, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ hubId: string }>;
}

// Mock data - replace with actual API call
const hubSources: Record<string, { id: string; name: string; type: string; status: string; lastUpdated: string }[]> = {
    "1": [
        { id: "s1", name: "API Reference v2.0", type: "markdown", status: "ready", lastUpdated: "2 days ago" },
        { id: "s2", name: "User Guide", type: "pdf", status: "ready", lastUpdated: "1 week ago" },
        { id: "s3", name: "Product Spec", type: "notion", status: "pending", lastUpdated: "Just now" },
    ],
    "2": [
        { id: "s4", name: "Architecture Overview", type: "markdown", status: "ready", lastUpdated: "3 days ago" },
        { id: "s5", name: "Deployment Guide", type: "code", status: "error", lastUpdated: "1 month ago" },
    ],
    "3": [
        { id: "s6", name: "Brand Guidelines", type: "pdf", status: "ready", lastUpdated: "2 weeks ago" },
        { id: "s7", name: "Campaign Q1", type: "notion", status: "ready", lastUpdated: "5 days ago" },
    ],
    "4": [
        { id: "s8", name: "Privacy Policy", type: "pdf", status: "ready", lastUpdated: "6 months ago" },
        { id: "s9", name: "Terms of Service", type: "pdf", status: "ready", lastUpdated: "6 months ago" },
    ],
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "ready": return <CheckCircle className="w-4 h-4 text-green-500" />;
        case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
        case "error": return <AlertCircle className="w-4 h-4 text-red-500" />;
        default: return <FileText className="w-4 h-4" />;
    }
};

const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
        ready: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        error: "bg-red-100 text-red-700",
    };
    return variants[status] || "bg-gray-100 text-gray-700";
};

const KnowledgeHubPage = async ({ params }: PageProps) => {
    const { hubId } = await params;
    const sources = hubSources[hubId] || [];

    return (
        <PageContainer>
            <PageHeader
                title="Knowledge Hub"
                description={`Hub ID: ${hubId}`}
            >
                <div className="flex gap-2">
                    <Link href="/resources/knowledge">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Hubs
                        </Button>
                    </Link>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Source
                    </Button>
                </div>
            </PageHeader>
            <PageContent>
                <div className="space-y-4">
                    {sources.map((source) => (
                        <Link key={source.id} href={`/resources/knowledge/${hubId}/${source.id}`}>
                            <Card className="hover:border-primary/50 transition-all cursor-pointer">
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        {getStatusIcon(source.status)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-base">{source.name}</CardTitle>
                                            <Badge variant="outline" className="text-xs uppercase">
                                                {source.type}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Last updated: {source.lastUpdated}
                                        </CardDescription>
                                    </div>
                                    <Badge className={getStatusBadge(source.status)}>
                                        {source.status}
                                    </Badge>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                    {sources.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No sources found in this hub.
                        </div>
                    )}
                </div>
            </PageContent>
        </PageContainer>
    );
};

export default KnowledgeHubPage;
