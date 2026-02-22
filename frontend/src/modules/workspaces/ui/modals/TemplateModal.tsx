"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TemplateSchema } from "@/shared/domain/workspaces";
import { useCreateTemplate } from "@/modules/workspaces/application/useTemplates";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/Dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { FileText, ListTodo, Plus, Trash2 } from "lucide-react";

const CreateTemplateFormSchema = TemplateSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});

type FormData = z.infer<typeof CreateTemplateFormSchema>;

export const TemplateModal = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const workspaceId = params.workspace as string;
    const isOpen = searchParams.get("modal") === "new-template";

    const { mutateAsync: createTemplate, isPending } = useCreateTemplate(workspaceId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm<any>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(CreateTemplateFormSchema) as any,
        defaultValues: {
            template_name: "",
            template_description: "",
            template_markdown_content: "",
            template_checklist_items: [],
            template_keywords: [],
            availability_workspace: [workspaceId],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "template_checklist_items"
    });

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        router.replace(`?${params.toString()}`, { scroll: false });
        form.reset();
    };

    const onSubmit = async (data: FormData) => {
        try {
            await createTemplate(data);
            closeModal();
        } catch (error) {
            console.error("Failed to create template:", error);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Operations</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">Manual SOP Template</DialogTitle>
                    <DialogDescription className="text-xs">
                        Define a Standard Operating Procedure with tasks and context for human or AI execution.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[70vh]">
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <FormField
                                control={form.control}
                                name="template_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold">Template Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. QBR Document Preparation" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="template_markdown_content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold">Execution Context (Markdown)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="# Guidelines\n\n- Step 1...\n- Step 2..."
                                                className="resize-none h-32 font-mono text-xs"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-xs uppercase font-bold flex items-center gap-2">
                                        <ListTodo className="w-3 h-3" /> Checklist Items
                                    </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-[10px] gap-1"
                                        onClick={() => append({ label: "", description: "" })}
                                    >
                                        <Plus className="w-3 h-3" /> Add Step
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-3 items-start p-3 rounded-lg border bg-muted/5 group">
                                            <div className="flex-1 space-y-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`template_checklist_items.${index}.label`}
                                                    render={({ field: inputField }) => (
                                                        <Input
                                                            {...inputField}
                                                            placeholder="Task Label"
                                                            className="h-8 text-xs font-bold"
                                                        />
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`template_checklist_items.${index}.description`}
                                                    render={({ field: inputField }) => (
                                                        <Input
                                                            {...inputField}
                                                            placeholder="Brief instruction..."
                                                            className="h-7 text-[10px] text-muted-foreground"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {fields.length === 0 && (
                                        <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground text-[10px]">
                                            No steps added. Define the workflow above.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button type="button" variant="ghost" size="sm" onClick={closeModal} className="text-xs">
                                Discard
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="text-xs gap-2"
                                disabled={isPending}
                            >
                                {isPending ? "Syncing..." : "Finalize Template"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
