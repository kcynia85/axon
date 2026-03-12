"use client";

import * as React from "react";
import { Zap, X, ChevronRight, ChevronLeft, Save } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/Dialog";
import { Form } from "@/shared/ui/ui/Form";
import { Button } from "@/shared/ui/ui/Button";
import { AutomationDefinitionStep } from "./components/AutomationDefinitionStep";
import { AutomationConnectionStep } from "./components/AutomationConnectionStep";
import { AutomationDataStep } from "./components/AutomationDataStep";
import { AutomationFormViewProps } from "../types/automation-ui.types";

/**
 * AutomationFormView: Pure presentation layer for the automation creation dialog.
 */
export const AutomationFormView = ({
    open,
    onOpenChange,
    form,
    step,
    isCreating,
    onSubmit,
    onNext,
    onPrevious
}: AutomationFormViewProps) => {
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
                            {step === "Definition" && <AutomationDefinitionStep form={form} />}
                            {step === "Connection" && <AutomationConnectionStep form={form} />}
                            {step === "Data" && <AutomationDataStep />}
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={step === "Definition" ? () => onOpenChange(false) : onPrevious}
                                className="text-zinc-400 hover:text-white text-xs gap-2"
                            >
                                {step === "Definition" ? <X className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                                {step === "Definition" ? "Discard" : "Back"}
                            </Button>

                            {step === "Data" ? (
                                <Button type="submit" size="sm" className="text-xs gap-2 px-6" disabled={isCreating}>
                                    <Save className="w-3 h-3" /> {isCreating ? "Validating..." : "Launch Automation"}
                                </Button>
                            ) : (
                                <Button type="button" size="sm" onClick={onNext} className="text-xs gap-2 px-6">
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
