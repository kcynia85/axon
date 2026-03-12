import { UseFormReturn } from "react-hook-form";
import { ExternalServiceFormData, ExternalServiceWizardStep } from "./external-service-wizard.types";

export type ExternalServiceFormProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
};

export type ExternalServiceFormViewProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly form: UseFormReturn<ExternalServiceFormData>;
    readonly step: ExternalServiceWizardStep;
    readonly isCreating: boolean;
    readonly capabilities: readonly string[];
    readonly onSubmit: (data: ExternalServiceFormData) => void;
    readonly onNext: () => void;
    readonly onPrevious: () => void;
    readonly onAddCapability: () => void;
    readonly onRemoveCapability: (index: number) => void;
    readonly onUpdateCapability: (index: number, value: string) => void;
};

export type ExternalServiceStepProps = {
    readonly form: UseFormReturn<ExternalServiceFormData>;
};

export type ExternalServiceCapabilitiesStepProps = {
    readonly form: UseFormReturn<ExternalServiceFormData>;
    readonly capabilities: readonly string[];
    readonly onAddCapability: () => void;
    readonly onRemoveCapability: (index: number) => void;
    readonly onUpdateCapability: (index: number, value: string) => void;
};
