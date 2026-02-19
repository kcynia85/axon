import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Button } from "@/shared/ui/ui/button";
import { Badge } from "@/shared/ui/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/ui/tabs";
import { ArrowLeft, FileText, Settings, Eye, Database } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ hubId: string; sourceId: string }>;
}

const KnowledgeSourcePage = async ({ params }: PageProps) => {
    const { hubId, sourceId } = await params;

    return (
        <PageContainer>
            <PageHeader
                title="Source Detail"
                description={`${hubId} / ${sourceId}`}
            >
                <div className="flex gap-2">
                    <Link href={`/resources/knowledge/${hubId}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Hub
                        </Button>
                    </Link>
                </div>
            </PageHeader>
            <PageContent>
                <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="chunks">Chunks</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Document Preview</CardTitle>
                                        <CardDescription>Source ID: {sourceId}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-muted-foreground">
                                        Document content would be displayed here with markdown rendering.
                                        This is a placeholder for the actual document preview.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="chunks" className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Database className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Chunk Inspector</CardTitle>
                                        <CardDescription>RAG chunks and metadata</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge>Chunk 1</Badge>
                                            <span className="text-xs text-muted-foreground">Tokens: 245</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            This is a preview of chunk content that would be indexed for RAG retrieval...
                                        </p>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge>Chunk 2</Badge>
                                            <span className="text-xs text-muted-foreground">Tokens: 189</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Another chunk preview with its associated metadata for semantic search...
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Settings className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Source Settings</CardTitle>
                                        <CardDescription>RAG and indexing configuration</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Chunking Strategy</p>
                                        <p className="font-medium">Recursive (500 tokens)</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Embedding Model</p>
                                        <p className="font-medium">text-embedding-3-large</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge variant="default">Ready</Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Chunks</p>
                                        <p className="font-medium">12</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </PageContent>
        </PageContainer>
    );
};

export default KnowledgeSourcePage;
