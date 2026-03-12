"use client";

import { useState } from "react";
import { useForm, Resolver, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateExternalService } from "@/modules/resources/application/useExternalServices";
import { 
    ExternalServiceFormData, 
    ExternalServiceWizardStep, 
    CreateExternalServiceFormSchema,
    ExternalServiceWizardLogic
} from "../types/external-service-wizard.types";

/**
 * useExternalServiceWizard: Encapsulates the multi-step state and submission for external service linking.
 * Standard: 0% co-located types, 0% useEffect.
 */
export const useExternalServiceWizard = (onSuccess: () => void): ExternalServiceWizardLogic => {
    const [step, setStep] = useState<ExternalServiceWizardStep>("Identity");
    const { mutateAsync: createService, isPending: isCreating } = useCreateExternalService();

    const form = useForm<ExternalServiceFormData>({
        resolver: zodResolver(CreateExternalServiceFormSchema) as unknown as Resolver<ExternalServiceFormData>,
        defaultValues: {
            service_name: "",
            service_url: "",
            service_category: "Utility",
            service_keywords: [],
            capabilities: [],
            availability_workspace: [],
        },
    });

    const capabilities = useWatch({
        control: form.control,
        name: "capabilities",
    }) || [];

    const handleFormSubmit = async (data: ExternalServiceFormData) => {
        try {
            await createService(data);
            onSuccess();
            form.reset();
            setStep("Identity");
        } catch (error) {
            console.error("Failed to create external service:", error);
        }
    };

    const goToNextStep = () => {
        if (step === "Identity") setStep("Capabilities");
        else if (step === "Capabilities") setStep("Availability");
    };

    const goToPreviousStep = () => {
        if (step === "Availability") setStep("Capabilities");
        else if (step === "Capabilities") setStep("Identity");
    };

    const addCapability = () => {
        const currentCapabilities = form.getValues("capabilities") || [];
        form.setValue("capabilities", [...currentCapabilities, ""]);
    };

    const removeCapability = (index: number) => {
        const currentCapabilities = form.getValues("capabilities") || [];
        form.setValue("capabilities", currentCapabilities.filter((_, i) => i !== index));
    };

    const updateCapability = (index: number, value: string) => {
        const currentCapabilities = [...(form.getValues("capabilities") || [])];
        currentCapabilities[index] = value;
        form.setValue("capabilities", currentCapabilities);
    };

    return {
        form,
        step,
        isCreating,
        capabilities,
        handleFormSubmit,
        goToNextStep,
        goToPreviousStep,
        addCapability,
        removeCapability,
        updateCapability
    };
};
