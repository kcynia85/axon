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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/ui/Select";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { FileText, ListTodo, Plus, Trash2, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

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
            template_inputs: [],
            template_outputs: [],
            availability_workspace: [workspaceId],
        },
    });

    const { fields: checklistFields, append: appendChecklist, remove: removeChecklist } = useFieldArray({
        control: form.control,
        name: "template_checklist_items"
    });

    const { fields: inputFields, append: appendInput, remove: removeInput } = useFieldArray({
        control: form.control,
        name: "template_inputs"
    });

    const { fields: outputFields, append: appendOutput, remove: removeOutput } = useFieldArray({
        control: form.control,
        name: "template_outputs"
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
            <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden">
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-h-[75vh]">
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* --- Basic Info --- */}
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
                                                placeholder="# Guidelines&#10;&#10;- Step 1...&#10;- Step 2..."
                                                className="resize-none h-28 font-mono text-xs"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* --- Required Inputs (Context) --- */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-xs uppercase font-bold flex items-center gap-2">
                                        <ArrowDownToLine className="w-3 h-3 text-blue-500" />
                                        Required Inputs
                                        <span className="text-[9px] text-muted-foreground font-normal normal-case tracking-normal">(Context tab on canvas)</span>
                                    </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-[10px] gap-1"
                                        onClick={() => appendInput({ id: `input-${Date.now()}`, label: "", expectedType: "any" })}
                                    >
                                        <Plus className="w-3 h-3" /> Add Input
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {inputFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-center p-3 rounded-lg border bg-blue-500/5 border-blue-500/10 group">
                                            <FormField
                                                control={form.control}
                                                name={`template_inputs.${index}.label`}
                                                render={({ field: f }) => (
                                                    <Input {...f} placeholder="e.g. brand_guidelines" className="h-8 text-xs flex-1" />
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`template_inputs.${index}.expectedType`}
                                                render={({ field: f }) => (
                                                    <Select value={f.value} onValueChange={f.onChange}>
                                                        <SelectTrigger className="h-8 w-24 text-[10px]">
                                                            <SelectValue placeholder="type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(['any', 'json', 'csv', 'zip', 'image'] as const).map((t) => (
                                                                <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                onClick={() => removeInput(index)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {inputFields.length === 0 && (
                                        <div className="text-center py-4 border border-dashed rounded-lg text-muted-foreground text-[10px]">
                                            No inputs defined. This template has no required context.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* --- Required Outputs (Artefacts) --- */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-xs uppercase font-bold flex items-center gap-2">
                                        <ArrowUpFromLine className="w-3 h-3 text-orange-500" />
                                        Required Outputs
                                        <span className="text-[9px] text-muted-foreground font-normal normal-case tracking-normal">(Artefacts tab on canvas)</span>
                                    </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-[10px] gap-1"
                                        onClick={() => appendOutput({ id: `output-${Date.now()}`, label: "" })}
                                    >
                                        <Plus className="w-3 h-3" /> Add Output
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {outputFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-center p-3 rounded-lg border bg-orange-500/5 border-orange-500/10 group">
                                            <FormField
                                                control={form.control}
                                                name={`template_outputs.${index}.label`}
                                                render={({ field: f }) => (
                                                    <Input {...f} placeholder="e.g. competitors_report" className="h-8 text-xs flex-1" />
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                onClick={() => removeOutput(index)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {outputFields.length === 0 && (
                                        <div className="text-center py-4 border border-dashed rounded-lg text-muted-foreground text-[10px]">
                                            No outputs defined. This template produces no tracked artefacts.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* --- Checklist Items --- */}
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
                                        onClick={() => appendChecklist({ label: "", description: "" })}
                                    >
                                        <Plus className="w-3 h-3" /> Add Step
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {checklistFields.map((field, index) => (
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
                                                onClick={() => removeChecklist(index)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {checklistFields.length === 0 && (
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
