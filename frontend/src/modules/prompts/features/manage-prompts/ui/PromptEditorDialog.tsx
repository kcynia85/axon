"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Prompt } from "../../../domain";
import { createPrompt, updatePrompt } from "../infrastructure/api";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Plus } from "lucide-react";
import React from "react";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    slug: z.string().min(1, "Slug is required"),
});

interface PromptEditorDialogProps {
    prompt?: Prompt;
    onSaved: () => void;
    trigger?: React.ReactNode;
}

export const PromptEditorDialog = ({ prompt, onSaved, trigger }: PromptEditorDialogProps) => {
    const [open, setOpen] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            slug: "",
        },
    });

    // Reset form when prompt changes or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                title: prompt?.title || "",
                content: prompt?.content || "",
                slug: prompt?.slug || "",
            });
        }
    }, [prompt, open, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (prompt) {
                await updatePrompt(prompt.id, values);
            } else {
                await createPrompt(values);
            }
            onSaved();
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error("Failed to save prompt", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> New Prompt</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{prompt ? "Edit Prompt" : "Create Prompt"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
