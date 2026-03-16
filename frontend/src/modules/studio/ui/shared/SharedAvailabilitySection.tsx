import React from "react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormField } from "@/shared/ui/ui/Form";
import { ALL_WORKSPACE_OPTIONS, GLOBAL_AVAILABILITY } from "@/modules/workspaces/domain/constants";

interface Props {
  name: string;
  number?: number;
}

/**
 * SharedAvailabilitySection: Unified access control for all entities.
 * Determines which Workspaces an entity belongs to.
 */
export const SharedAvailabilitySection = ({ name, number = 4 }: Props) => {
  const { control } = useFormContext();

  return (
    <FormSection
      id="availability"
      number={number}
      title="Dostępność"
      description="Określ, w których przestrzeniach roboczych encja ma być widoczna."
    >
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const selectedWorkspaces = field.value || [];
          const isGlobalSelected = selectedWorkspaces.includes(GLOBAL_AVAILABILITY);

          const toggleWorkspace = (workspace: string) => {
            let next: string[] = [];
            if (workspace === GLOBAL_AVAILABILITY) {
              next = isGlobalSelected ? [] : [GLOBAL_AVAILABILITY];
            } else {
              next = selectedWorkspaces.includes(workspace)
                ? selectedWorkspaces.filter((id: string) => id !== workspace)
                : [...selectedWorkspaces, workspace];
            }
            field.onChange(next);
          };

          return (
            <FormItemField>
              <div className="grid grid-cols-1 gap-4">
                {ALL_WORKSPACE_OPTIONS.map((workspace) => {
                  const isSelected = selectedWorkspaces.includes(workspace);
                  const isDisabled = isGlobalSelected && workspace !== GLOBAL_AVAILABILITY;

                  return (
                    <FormCheckbox
                      key={workspace}
                      title={workspace}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleWorkspace(workspace)}
                    />
                  );
                })}
              </div>
            </FormItemField>
          );
        }}
      />
    </FormSection>
  );
};
