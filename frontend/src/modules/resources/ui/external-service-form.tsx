"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ExternalServiceSchema, ServiceCategorySchema } from "@/shared/domain/resources";
import { useCreateExternalService } from "@/modules/resources/application/use-external-services";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
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
import { Checkbox } from "@/shared/ui/ui/checkbox";
import {
    Globe,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    Save,
    X,
    Plus,
    Trash2,
    Users,
    Workflow,
    Network,
    Settings2,
    Zap
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const CreateServiceFormSchema = z.object({
    service_name: z.string().min(2),
    service_category: z.enum(["Utility", "GenAI", "Scraping", "Business"]),
    service_url: z.string().url(),
    service_keywords: z.array(z.string()).default([]),
    availability_workspace: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof CreateServiceFormSchema>;

type Step = "Identity" | "Capabilities" | "Availability";

export const ExternalServiceForm = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void
}) => {
    const [step, setStep] = React.useState<Step>("Identity");
    const { mutateAsync: createService, isPending } = useCreateExternalService();

    const form = useForm<FormData>({
        resolver: zodResolver(CreateServiceFormSchema) as any,
        defaultValues: {
            service_name: "",
            service_url: "",
            service_category: "Utility",
            service_keywords: [],
            capabilities: [],
            availability_workspace: [],
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await createService(data);
            onOpenChange(false);
            form.reset();
            setStep("Identity");
        } catch (error) {
            console.error("Failed to create service:", error);
        }
    };

    const nextStep = () => {
        if (step === "Identity") setStep("Capabilities");
        else if (step === "Capabilities") setStep("Availability");
    };

    const prevStep = () => {
        if (step === "Availability") setStep("Capabilities");
        else if (step === "Capabilities") setStep("Identity");
    };

    const addCapability = () => {
        const current = form.getValues("capabilities") || [];
        form.setValue("capabilities", [...current, ""]);
    };

    const removeCapability = (index: number) => {
        const current = form.getValues("capabilities") || [];
        form.setValue("capabilities", current.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Connector</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">Link External Service</DialogTitle>
                    <DialogDescription className="text-xs">
                        Register a third-party API or service to expose its capabilities to your agents.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="p-6 space-y-6 min-h-[300px]">
                            {step === "Identity" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="service_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold">Service Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. ScraperAPI, Twilio" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="service_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold">API Base URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://api.provider.com/v1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="service_category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold">Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {["Utility", "GenAI", "Scraping", "Business"].map(cat => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {step === "Capabilities" && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <FormLabel className="text-xs uppercase font-bold flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-primary" /> Exposed Methods
                                        </FormLabel>
                                        <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={addCapability}>
                                            <Plus className="w-3 h-3 mr-1" /> Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {form.watch("capabilities")?.map((_, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    placeholder="e.g. search_web, send_sms"
                                                    className="h-8 text-xs font-mono"
                                                    onChange={(e) => {
                                                        const caps = [...form.getValues("capabilities")];
                                                        caps[index] = e.target.value;
                                                        form.setValue("capabilities", caps);
                                                    }}
                                                    value={form.watch(`capabilities.${index}`)}
                                                />
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeCapability(index)}>
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                        {(!form.watch("capabilities") || form.watch("capabilities").length === 0) && (
                                            <p className="text-center text-[10px] text-muted-foreground py-10 border border-dashed rounded-lg">
                                                Define capabilities for agents to interact with this service.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === "Availability" && (
                                <div className="space-y-4 text-center py-10">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Globe className="w-6 h-6 text-primary" />
                                    </div>
                                    <h4 className="text-sm font-bold">Broadcast Access</h4>
                                    <p className="text-xs text-muted-foreground px-10">
                                        By default, new services are available to all agents in this domain. You can restrict access later in the Permissions tab.
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={step === "Identity" ? () => onOpenChange(false) : prevStep}
                                className="text-xs gap-2"
                            >
                                {step === "Identity" ? <X className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                                {step === "Identity" ? "Abort" : "Back"}
                            </Button>

                            {step === "Availability" ? (
                                <Button type="submit" size="sm" className="text-xs gap-2 px-6" disabled={isPending}>
                                    <Save className="w-3 h-3" /> {isPending ? "Linking..." : "Finalize Link"}
                                </Button>
                            ) : (
                                <Button type="button" size="sm" onClick={nextStep} className="text-xs gap-2 px-6">
                                    Continue <ChevronRight className="w-3 h-3" />
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
