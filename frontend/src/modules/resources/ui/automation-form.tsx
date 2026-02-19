"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AutomationSchema, AutomationPlatformSchema } from "@/shared/domain/resources";
import { useCreateAutomation } from "@/modules/resources/application/use-automations";
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
import { Textarea } from "@/shared/ui/ui/textarea";
import { Button } from "@/shared/ui/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/ui/ui/select";
import { Checkbox } from "@/shared/ui/ui/checkbox";
import { Zap, Play, Terminal, Plus, X, ChevronRight, ChevronLeft, Save } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const CreateAutomationFormSchema = AutomationSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    automation_last_validated_at: true
});

type FormData = z.infer<typeof CreateAutomationFormSchema>;

type Step = "Definition" | "Connection" | "Data";

export const AutomationForm = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void
}) => {
    const [step, setStep] = React.useState<Step>("Definition");
    const { mutateAsync: createAutomation, isPending } = useCreateAutomation();

    const form = useForm<FormData>({
        resolver: zodResolver(CreateAutomationFormSchema) as any,
        defaultValues: {
            automation_name: "",
            automation_description: "",
            automation_platform: "n8n",
            automation_webhook_url: "",
            automation_http_method: "POST",
            automation_auth_config: {},
            automation_input_schema: {},
            automation_output_schema: {},
            automation_validation_status: "Untested",
            automation_keywords: [],
            availability_workspace: [],
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createAutomation(data);
            onOpenChange(false);
            form.reset();
            setStep("Definition");
        } catch (error) {
            console.error("Failed to create automation:", error);
        }
    };

    const nextStep = () => {
        if (step === "Definition") setStep("Connection");
        else if (step === "Connection") setStep("Data");
    };

    const prevStep = () => {
        if (step === "Data") setStep("Connection");
        else if (step === "Connection") setStep("Definition");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Autonomous Workflow</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">New Automation Trigger</DialogTitle>
                    <DialogDescription className="text-xs">
                        Link an external workflow trigger (e.g. n8n webhook) that agents can execute.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="p-6 space-y-6 min-h-[350px]">
                            {step === "Definition" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="automation_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold">Automation Alias</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Invoice Generation Flow" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="automation_platform"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold">Execution Platform</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select platform" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["n8n", "Zapier", "Make", "Custom"].map(p => (
                                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription className="text-[10px]">Identify the engine running this workflow.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {step === "Connection" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="automation_webhook_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold">Webhook Endpoint</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://n8n.instance.com/webhook/..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="automation_http_method"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold">HTTP Method</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select method" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["GET", "POST", "PUT"].map(m => (
                                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {step === "Data" && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-muted/30 border border-primary/5 space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                            <Terminal className="w-3 h-3" /> Input Payload
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                            Define the JSON structure agents should send to this webhook.
                                        </p>
                                        <Textarea
                                            placeholder='{ "task_id": "{{id}}", "query": "{{text}}" }'
                                            className="font-mono text-[10px] h-32 bg-background border-none shadow-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={step === "Definition" ? () => onOpenChange(false) : prevStep}
                                className="text-xs gap-2"
                            >
                                {step === "Definition" ? <X className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                                {step === "Definition" ? "Discard" : "Back"}
                            </Button>

                            {step === "Data" ? (
                                <Button type="submit" size="sm" className="text-xs gap-2 px-6" disabled={isPending}>
                                    <Save className="w-3 h-3" /> {isPending ? "Validating..." : "Launch Automation"}
                                </Button>
                            ) : (
                                <Button type="button" size="sm" onClick={nextStep} className="text-xs gap-2 px-6">
                                    Next Phase <ChevronRight className="w-3 h-3" />
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
