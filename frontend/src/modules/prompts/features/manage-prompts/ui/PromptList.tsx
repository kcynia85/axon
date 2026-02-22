"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrompts, deletePrompt } from "../infrastructure/api";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { PromptEditorDialog } from "./PromptEditorDialog";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export const PromptList = () => {
    const { data: prompts = [], isLoading, refetch } = useQuery({
        queryKey: ["prompts"],
        queryFn: getPrompts,
    });

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this prompt?")) {
            try {
                await deletePrompt(id);
                toast.success("Prompt deleted");
                refetch();
            } catch (error) {
                console.error("Failed to delete prompt:", error);
                toast.error("Failed to delete prompt");
            }
        }
    };

    if (isLoading) return <div>Loading prompts...</div>;

    return (
        <div className="space-y-4">
             <div className="flex justify-end">
                <PromptEditorDialog onSaved={() => refetch()} />
            </div>
            {prompts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">No prompts found. Create your first one!</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {prompts.map((prompt) => (
                        <Card key={prompt.id}>
                            <CardHeader>
                                <CardTitle>{prompt.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                                    {prompt.content}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2">
                                <PromptEditorDialog 
                                    prompt={prompt} 
                                    onSaved={() => refetch()} 
                                    trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>} 
                                />
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(prompt.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};