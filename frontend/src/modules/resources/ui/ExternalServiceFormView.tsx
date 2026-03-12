"use client";

import * as React from "react";
import { Globe, ChevronRight, ChevronLeft, Save, X } from "lucide-react";
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
import { ExternalServiceIdentityStep } from "./components/ExternalServiceIdentityStep";
import { ExternalServiceCapabilitiesStep } from "./components/ExternalServiceCapabilitiesStep";
import { ExternalServiceAvailabilityStep } from "./components/ExternalServiceAvailabilityStep";
import { ExternalServiceFormViewProps } from "../types/external-service-ui.types";

/**
 * ExternalServiceFormView: Pure presentation layer for the external service linking dialog.
 * Standard: 0% Logic, 0% useEffect.
 */
export const ExternalServiceFormView = ({
    open,
    onOpenChange,
    form,
    step,
    isCreating,
    capabilities,
    onSubmit,
    onNext,
    onPrevious,
    onAddCapability,
    onRemoveCapability,
    onUpdateCapability
}: ExternalServiceFormViewProps) => {
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
                                <ExternalServiceIdentityStep form={form} />
                            )}

                            {step === "Capabilities" && (
                                <ExternalServiceCapabilitiesStep 
                                    form={form}
                                    capabilities={capabilities}
                                    onAddCapability={onAddCapability}
                                    onRemoveCapability={onRemoveCapability}
                                    onUpdateCapability={onUpdateCapability}
                                />
                            )}

                            {step === "Availability" && (
                                <ExternalServiceAvailabilityStep />
                            )}
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={step === "Identity" ? () => onOpenChange(false) : onPrevious}
                                className="text-xs gap-2"
                            >
                                {step === "Identity" ? <X className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                                {step === "Identity" ? "Abort" : "Back"}
                            </Button>

                            {step === "Availability" ? (
                                <Button type="submit" size="sm" className="text-xs gap-2 px-6" disabled={isCreating}>
                                    <Save className="w-3 h-3" /> {isCreating ? "Linking..." : "Finalize Link"}
                                </Button>
                            ) : (
                                <Button type="button" size="sm" onClick={onNext} className="text-xs gap-2 px-6">
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
