import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormField } from "@/shared/ui/ui/Form";
import { Globe, Blocks, Target, PenTool, Rocket } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ArchetypeFormValues } from "../../application/archetypeSchema";

const WORKSPACES = [
	{ id: "ws_pm", title: "Product Management", icon: Target },
	{ id: "ws_discovery", title: "Discovery", icon: Rocket },
	{ id: "ws_design", title: "Design", icon: PenTool },
	{ id: "ws_delivery", title: "Delivery", icon: Blocks },
];

export const ArchetypeAccessSection = () => {
	const { control, watch, setValue } = useFormContext<ArchetypeFormValues>();
	const isGlobalAccess = watch("isGlobalAccess");
	const workspaceIds = watch("workspaceIds");

	const handleWorkspaceToggle = (id: string, checked: boolean) => {
		if (checked) {
			setValue("workspaceIds", [...workspaceIds, id], { shouldValidate: true });
			if (isGlobalAccess) {
				setValue("isGlobalAccess", false, { shouldValidate: true });
			}
		} else {
			setValue(
				"workspaceIds",
				workspaceIds.filter((wId) => wId !== id),
				{ shouldValidate: true }
			);
		}
	};

	const handleGlobalToggle = (checked: boolean) => {
		setValue("isGlobalAccess", checked, { shouldValidate: true });
		if (checked) {
			setValue("workspaceIds", [], { shouldValidate: true });
		}
	};

	return (
		<FormSection
			id="ACCESS"
			number={3}
			title="Availability"
		>
			<div className="space-y-8">
				<FormField
					name="isGlobalAccess"
					control={control}
					render={({ field, fieldState }) => (
						<FormItemField error={fieldState.error?.message}>
							<FormCheckbox
								checked={field.value}
								onChange={handleGlobalToggle}
								title="Global Availability"
								description="Archetyp dostępny we wszystkich przestrzeniach."
								icon={Globe}
							/>
						</FormItemField>
					)}
				/>

				<div className="grid grid-cols-1 gap-4">
					{WORKSPACES.map((ws) => (
						<FormCheckbox
							key={ws.id}
							checked={workspaceIds.includes(ws.id)}
							onChange={(checked) => handleWorkspaceToggle(ws.id, checked)}
							title={ws.title}
							icon={ws.icon}
							disabled={isGlobalAccess}
						/>
					))}
				</div>
			</div>
		</FormSection>
	);
};
