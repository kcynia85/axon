import React from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { PromptEditorDialog } from "./PromptEditorDialog";
import { Trash2, Edit } from "lucide-react";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { PromptListViewProps } from "./PromptListView.types";

export const PromptListView = ({
    prompts,
    isLoading,
    onSaved,
    onDeleteClick,
    promptToDeleteId,
    onConfirmDelete,
    onCancelDelete,
    promptToDeleteTitle,
}: PromptListViewProps) => {
    if (isLoading) return <div>Loading prompts...</div>;

    return (
        <>
            <div className="space-y-4">
                <div className="flex justify-end">
                    <PromptEditorDialog onSaved={onSaved} />
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
                                        onSaved={onSaved} 
                                        trigger={<Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>} 
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => onDeleteClick(prompt.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <DestructiveDeleteModal
                isOpen={!!promptToDeleteId}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                title="Delete Prompt"
                resourceName={promptToDeleteTitle || "this prompt"}
                affectedResources={[]}
            />
        </>
    );
};
