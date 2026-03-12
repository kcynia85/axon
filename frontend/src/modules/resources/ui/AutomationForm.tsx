"use client";

import * as React from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, startTransition } from "react";
import { useCreateAutomation } from "@/modules/resources/application/useAutomations";
import { AutomationFormView } from "./AutomationFormView";
import { AutomationFormData, AutomationWizardStep, CreateAutomationFormSchema } from "../types/automation-wizard.types";

export const AutomationForm = ({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void
}) => {
    const [step, setStep] = React.useState<AutomationWizardStep>("Definition");
    const { mutateAsync: createAutomation } = useCreateAutomation();

    const form = useForm<AutomationFormData>({
        resolver: zodResolver(CreateAutomationFormSchema) as unknown as Resolver<AutomationFormData>,
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

    const [state, formAction, isPending] = useActionState(
        async (_prevState: any, data: AutomationFormData) => {
            try {
                await createAutomation(data);
                onOpenChange(false);
                form.reset();
                setStep("Definition");
                return { success: true };
            } catch (error) {
                console.error("Failed to create automation:", error);
                return { success: false, error };
            }
        },
        { success: false }
    );

    const onSubmit = (data: AutomationFormData) => {
        startTransition(() => {
            formAction(data);
        });
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
        <AutomationFormView 
            open={open}
            onOpenChange={onOpenChange}
            form={form}
            step={step}
            isCreating={isPending}
            onSubmit={onSubmit}
            onNext={nextStep}
            onPrevious={prevStep}
        />
    );
};
