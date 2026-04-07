"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prompt } from "../domain";
import { createPrompt, updatePrompt } from "../infrastructure/api";
import { PromptFormSchema, PromptFormData } from "../application/schemas";
import { PromptEditorDialogView } from "./PromptEditorDialogView";

export type PromptEditorDialogProps = {
    readonly prompt?: Prompt;
    readonly onSaved: () => void;
    readonly trigger?: React.ReactNode;
};

export const PromptEditorDialog = ({ prompt, onSaved, trigger }: PromptEditorDialogProps) => {
    const [open, setOpen] = useState(false);
    
    const form = useForm<PromptFormData>({
        resolver: zodResolver(PromptFormSchema),
        values: {
            title: prompt?.title || "",
            content: prompt?.content || "",
            slug: prompt?.slug || "",
        },
    });

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            form.reset({
                title: prompt?.title || "",
                content: prompt?.content || "",
                slug: prompt?.slug || "",
            });
        }
    };

    const onSubmit = async (values: PromptFormData) => {
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
        <PromptEditorDialogView
            key={prompt?.id || "new"}
            open={open}
            onOpenChange={handleOpenChange}
            prompt={prompt}
            trigger={trigger}
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
        />
    );
};
