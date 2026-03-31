import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { RouterFormData } from "../../types/router-schema";
import { ROUTER_STRATEGIES } from "../../types/router.constants";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormRadio } from "@/shared/ui/form/FormRadio";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormSubheading } from "@/shared/ui/form/FormSubheading";

export const RouterGeneralSection = () => {
	const { setValue, control, register, formState: { errors } } = useFormContext<RouterFormData>();
	const currentStrategy = useWatch({ control, name: "strategy" });

	return (
		<FormSection id="general" number={1} title="General Settings" variant="island">
			<div className="space-y-12 max-w-3xl">
				{/* Router Name */}
				<FormItemField label="Nazwa (Alias)" error={errors.name?.message}>
					<FormTextField
						{...register("name")}
						placeholder="np. Production Safe"
					/>
				</FormItemField>

				{/* Router Strategy */}
				<div className="space-y-6 pt-6 border-t border-zinc-900">
					<FormSubheading>Strategia</FormSubheading>
					<div className="grid grid-cols-1 gap-4">
						{ROUTER_STRATEGIES.map((strategy) => (
							<FormRadio
								key={strategy.id}
								title={strategy.title}
								description={strategy.description}
								checked={currentStrategy === strategy.id}
								onChange={() => setValue("strategy", strategy.id)}
							/>
						))}
					</div>
				</div>
			</div>
		</FormSection>
	);
};
