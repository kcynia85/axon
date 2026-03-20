"use client";

import * as React from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PromptArchetypeSchema } from "@/shared/domain/resources";
import { useCreatePromptArchetype } from "../application/usePromptArchetypes";
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
    FormDescription,
} from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Button } from "@/shared/ui/ui/Button";
import { Sparkles, Save, X, Brain, Shield, Tags } from "lucide-react";

const CreateArchetypeFormSchema = PromptArchetypeSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});

type FormData = z.infer<typeof CreateArchetypeFormSchema>;

export const PromptArchetypeEditor = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void
}) => {
    const { mutateAsync: createArchetype, isPending } = useCreatePromptArchetype();

    const form = useForm<FormData>({
        resolver: zodResolver(CreateArchetypeFormSchema) as unknown as Resolver<FormData>,
        defaultValues: {
            archetype_name: "",
            archetype_description: "",
            archetype_role: "",
            archetype_goal: "",
            archetype_backstory: "",
            archetype_guardrails: {
                instructions: [],
                constraints: [],
            },
            archetype_keywords: [],
            workspace_domain: "General",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createArchetype(data);
            onOpenChange(false);
            form.reset();
        } catch (error) {
            console.error("Failed to create archetype:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 flex flex-col h-[85vh]">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Laboratory</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">Prompt Archetype Blueprint</DialogTitle>
                    <DialogDescription className="text-xs">
                        Architect a persistent persona and capability set that can be inherited by any agent.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Identity Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Brain className="w-3 h-3" /> Core Identity
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="archetype_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] uppercase font-bold">Callsign</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Master Strategist" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="workspace_domain"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] uppercase font-bold">Domain</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Finance, QA, R&D" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="archetype_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold">Brief Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Used for tactical decision making in complex scenarios..." {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Behavioral Logic Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Behavioral Logic
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="archetype_backstory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold">Base Prompt (Backstory)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Define the core logic and instruction set..."
                                                    className="h-32 resize-none text-xs font-mono"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Categorization Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Tags className="w-3 h-3" /> Categorization
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="archetype_keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] uppercase font-bold">Search Keywords</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Comma separated: tactical, logic, synthesis"
                                                    onChange={(event) => field.onChange(event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))}
                                                    value={field.value?.join(", ")}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-[10px]">These tags help filter archetypes during agent creation.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs gap-2">
                                <X className="w-3 h-3" /> Abort
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="text-xs gap-2 px-6"
                                disabled={isPending}
                            >
                                <Save className="w-3 h-3" />
                                {isPending ? "Indexing..." : "Register Archetype"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
