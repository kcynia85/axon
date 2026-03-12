"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateAutomation } from "@/modules/resources/application/useAutomations";
import { 
    AutomationFormData, 
    AutomationWizardStep, 
    CreateAutomationFormSchema,
    AutomationWizardLogic
} from "../types/automation-wizard.types";

/**
 * useAutomationWizard: Encapsulates the multi-step state and submission for automation creation.
 * Standard: 0% co-located types, 0% useEffect.
 */
export const useAutomationWizard = (onSuccess: () => void): AutomationWizardLogic => {
    const [step, setStep] = useState<AutomationWizardStep>("Definition");
    const { mutateAsync: createAutomation, isPending: isCreating } = useCreateAutomation();

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

    const handleFormSubmit = async (data: AutomationFormData) => {
        try {
            await createAutomation(data);
            onSuccess();
            form.reset();
            setStep("Definition");
        } catch (error) {
            console.error("Failed to create automation:", error);
        }
    };

    const goToNextStep = () => {
        if (step === "Definition") setStep("Connection");
        else if (step === "Connection") setStep("Data");
    };

    const goToPreviousStep = () => {
        if (step === "Data") setStep("Connection");
        else if (step === "Connection") setStep("Definition");
    };

    return {
        form,
        step,
        isCreating,
        handleFormSubmit,
        goToNextStep,
        goToPreviousStep,
        setStep
    };
};
