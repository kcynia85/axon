import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { ModelFormData } from "../../types/model-schema";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormPropertyTable } from "@/shared/ui/form/FormPropertyTable";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import type { FormPropertyTableItem, FormPropertyFieldType } from "@/shared/types/form/FormPropertyTable.types";

const TYPE_OPTIONS: { label: string; value: FormPropertyFieldType }[] = [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "json", label: "JSON" }
];

export const ModelCustomParamsSection: React.FC = () => {
    const { control } = useFormContext<ModelFormData>();

    return (
        <FormSection 
            id="custom-params" 
            number={3} 
            title="Parametry Niestandardowe (Passthrough)"
            description="Wstrzyknij dodatkowe parametry bezpośrednio do payloadu JSON wysyłanego do dostawcy."
            variant="island"
        >
            <div className="space-y-12 max-w-4xl">
                <FormItemField 
                    label="Dodatkowe Atrybuty"
                    hint="Parametry te zostaną przekazane w sekcji parametrów opcjonalnych zapytania."
                >
                    <Controller
                        control={control}
                        name="custom_params"
                        render={({ field }) => {
                            // Map internal form data to FormPropertyTable expected format
                            const tableItems: FormPropertyTableItem[] = (field.value || []).map((item: any) => ({
                                id: item.key, // Using key as ID for mapping
                                name: item.key,
                                field_type: item.type,
                                is_required: false // Default for passthrough
                            }));

                            const handleChange = (newItems: FormPropertyTableItem[]) => {
                                // Map back to form structure
                                const mappedValue = newItems.map(item => ({
                                    key: item.name,
                                    value: "", // Value is empty for schema definition
                                    type: item.field_type as any
                                }));
                                field.onChange(mappedValue);
                            };

                            return (
                                <FormPropertyTable
                                    items={tableItems}
                                    onChange={handleChange}
                                    typeOptions={TYPE_OPTIONS}
                                    namePlaceholder="Klucz (np. beta_feature_x)"
                                    addPlaceholder="Dodaj parametr..."
                                />
                            );
                        }}
                    />
                </FormItemField>
            </div>
        </FormSection>
    );
};
