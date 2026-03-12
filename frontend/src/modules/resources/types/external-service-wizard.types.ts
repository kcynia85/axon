import { z } from "zod";

export const CreateExternalServiceFormSchema = z.object({
    service_name: z.string().min(2),
    service_category: z.enum(["Utility", "GenAI", "Scraping", "Business"]),
    service_url: z.string().url(),
    service_keywords: z.array(z.string()).default([]),
    availability_workspace: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([]),
});

export type ExternalServiceFormData = z.infer<typeof CreateExternalServiceFormSchema>;

export type ExternalServiceWizardStep = "Identity" | "Capabilities" | "Availability";

export type ExternalServiceWizardLogic = {
    readonly form: any;
    readonly step: ExternalServiceWizardStep;
    readonly isCreating: boolean;
    readonly capabilities: readonly string[];
    readonly handleFormSubmit: (data: ExternalServiceFormData) => Promise<void>;
    readonly goToNextStep: () => void;
    readonly goToPreviousStep: () => void;
    readonly addCapability: () => void;
    readonly removeCapability: (index: number) => void;
    readonly updateCapability: (index: number, value: string) => void;
};
