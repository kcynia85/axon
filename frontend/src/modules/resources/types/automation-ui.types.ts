import { UseFormReturn } from "react-hook-form";
import { AutomationFormData, AutomationWizardStep } from "./automation-wizard.types";

export type AutomationFormProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export type AutomationFormViewProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly form: UseFormReturn<AutomationFormData>;
    readonly step: AutomationWizardStep;
    readonly isCreating: boolean;
    readonly onSubmit: (data: AutomationFormData) => void;
    readonly onNext: () => void;
    readonly onPrevious: () => void;
};

export type AutomationStepProps = {
    readonly form: UseFormReturn<AutomationFormData>;
};
