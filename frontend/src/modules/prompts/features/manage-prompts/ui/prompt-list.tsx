"use client";

import { useEffect, useState } from "react";
import { getPrompts, deletePrompt } from "../infrastructure/api";
import { Prompt } from "../../../domain";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PromptEditorDialog } from "./prompt-editor-dialog";
import { Trash2, Edit } from "lucide-react";

export const PromptList = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPrompts = async () => {
        setLoading(true);
        try {
            const data = await getPrompts();
            setPrompts(data);
        } catch (error) {
            console.error("Failed to fetch prompts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this prompt?")) {
            await deletePrompt(id);
            fetchPrompts();
        }
    };

    if (loading) return <div>Loading prompts...</div>;

    return (
        <div className="space-y-4">
             <div className="flex justify-end">
                <PromptEditorDialog onSaved={fetchPrompts} />
            </div>
            {prompts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No prompts found. Create your first one!</div>
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
                                    onSaved={fetchPrompts} 
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
