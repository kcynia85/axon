import React from "react";
import { Button } from "@/shared/ui/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/ui/Dialog";
import { Input } from "@/shared/ui/ui/Input";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { Plus } from "lucide-react";
import { PromptEditorDialogViewProps } from "./PromptEditorDialogView.types";

export const PromptEditorDialogView = ({
    open,
    onOpenChange,
    prompt,
    trigger,
    form,
    onSubmit,
}: PromptEditorDialogViewProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> New Prompt</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{prompt ? "Edit Prompt" : "Create Prompt"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Prompt Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="unique-slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="System instruction..." className="h-[200px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
