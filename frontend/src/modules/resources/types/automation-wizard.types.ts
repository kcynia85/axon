import { z } from "zod";
import { AutomationSchema } from "@/shared/domain/resources";

export const CreateAutomationFormSchema = AutomationSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    automation_last_validated_at: true
});

export type AutomationFormData = z.infer<typeof CreateAutomationFormSchema>;

export type AutomationWizardStep = "Definition" | "Connection" | "Data";

export type AutomationWizardLogic = {
    readonly form: any; 
    readonly step: AutomationWizardStep;
    readonly isCreating: boolean;
    readonly handleFormSubmit: (data: AutomationFormData) => Promise<void>;
    readonly goToNextStep: () => void;
    readonly goToPreviousStep: () => void;
    readonly setStep: (step: AutomationWizardStep) => void;
};
