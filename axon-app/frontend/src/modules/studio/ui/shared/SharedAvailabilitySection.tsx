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
  onSyncDraft?: () => void;
}

/**
 * SharedAvailabilitySection: Unified access control for all entities.
 * Enhanced to handle migration from labels to IDs and case-sensitivity issues.
 */
export const SharedAvailabilitySection = ({ name, number = 4, onSyncDraft }: Props) => {
  const { control } = useFormContext();

  return (
    <FormSection
      id="availability"
      number={number}
      title="Dostępność"
      description="Określ, w których przestrzeniach roboczych encja ma być widoczna."
      variant="island"
    >
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const selectedWorkspaces: string[] = field.value || [];
          
          const isMatch = (workspace: { id: string; label: string }, input: string) => {
            const normalizedInput = input.trim().toLowerCase();
            return workspace.id.toLowerCase() === normalizedInput || workspace.label.toLowerCase() === normalizedInput;
          };

          const isGlobalSelected = selectedWorkspaces.some(value => isMatch({ id: GLOBAL_AVAILABILITY, label: GLOBAL_AVAILABILITY }, value));

          const toggleWorkspace = (workspace: { id: string; label: string }) => {
            let nextWorkspaces: string[] = [];
            
            if (workspace.id === GLOBAL_AVAILABILITY) {
              nextWorkspaces = isGlobalSelected ? [] : [GLOBAL_AVAILABILITY];
            } else {
              const alreadyPresent = selectedWorkspaces.some(value => isMatch(workspace, value));

              if (alreadyPresent) {
                // Remove all variants (ID, Label, different cases)
                nextWorkspaces = selectedWorkspaces.filter(value => !isMatch(workspace, value));
              } else {
                nextWorkspaces = [...selectedWorkspaces, workspace.id];
              }
            }
            field.onChange(nextWorkspaces);
            onSyncDraft?.();
          };

          return (
            <FormItemField>
              <div className="grid grid-cols-1 gap-4">
                {ALL_WORKSPACE_OPTIONS.map((workspace) => {
                  const isSelected = selectedWorkspaces.some(value => isMatch(workspace, value));
                  const isDisabled = isGlobalSelected && workspace.id !== GLOBAL_AVAILABILITY;

                  return (
                    <FormCheckbox
                      key={workspace.id}
                      title={workspace.label}
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
