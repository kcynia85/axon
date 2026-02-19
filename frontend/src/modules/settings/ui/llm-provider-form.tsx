"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LLMProviderSchema, ModelTierSchema } from "@/shared/domain/settings";
import { useCreateLLMProvider } from "../application/use-llm-providers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/shared/ui/ui/form";
import { Input } from "@/shared/ui/ui/input";
import { Button } from "@/shared/ui/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/ui/ui/select";
import { Cpu, Key, Save, X, Activity, Database } from "lucide-react";

const CreateProviderFormSchema = LLMProviderSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});

type FormData = z.infer<typeof CreateProviderFormSchema>;

export const LLMProviderForm = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void
}) => {
    const { mutateAsync: createProvider, isPending } = useCreateLLMProvider();

    const form = useForm<FormData>({
        resolver: zodResolver(CreateProviderFormSchema) as any,
        defaultValues: {
            provider_name: "",
            provider_api_key_required: true,
            provider_api_endpoint: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createProvider(data);
            onOpenChange(false);
            form.reset();
        } catch (error) {
            console.error("Failed to create provider:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Inference Node</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">Add LLM Provider</DialogTitle>
                    <DialogDescription className="text-xs">
                        Connect an external model provider to unblock advanced agentic reasoning.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        <FormField
                            control={form.control}
                            name="provider_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase font-bold">Provider Alias</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. OpenAI Production, Local Ollama" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="provider_api_endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase font-bold">API Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://api.openai.com/v1" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormDescription className="text-[10px]">Base URL for the provider's API.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center space-x-2">
                            <FormField
                                control={form.control}
                                name="provider_api_key_required"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold">Tier Strategy</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select tier" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Tier1">Tier 1 (High Reliability)</SelectItem>
                                                <SelectItem value="Tier2">Tier 2 (Batch/Economic)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormItem>
                                <FormLabel className="text-xs uppercase font-bold">Adapter Protocol</FormLabel>
                                <div className="flex items-center gap-2 h-10 px-3 rounded border bg-muted/30 text-[10px] text-muted-foreground italic">
                                    Auto-detected (OpenAI v1)
                                </div>
                            </FormItem>
                        </div>

                        <DialogFooter className="pt-4 border-t bg-muted/5 -mx-6 -mb-6 p-4">
                            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
                                <X className="w-3 h-3 mr-2" /> Cancel
                            </Button>
                            <Button type="submit" size="sm" className="text-xs gap-2 px-8" disabled={isPending}>
                                <Activity className="w-3 h-3" /> {isPending ? "Validating..." : "Connect Provider"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
