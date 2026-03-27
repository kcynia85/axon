import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { RouterFormData } from "../../types/router-schema";
import { ROUTER_STRATEGIES } from "../../types/router.constants";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { FormRadio } from "@/shared/ui/form/FormRadio";

export const RouterGeneralSection = () => {
	const { setValue, control, register, formState: { errors } } = useFormContext<RouterFormData>();
	const currentStrategy = useWatch({ control, name: "strategy" });

	return (
		<FormSection id="general" number={1} title="General Settings">
			<div className="space-y-12 max-w-3xl">
				{/* Router Name */}
				<div className="space-y-6">
					<h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Nazwa (Alias)</h4>
					<FormTextField
						{...register("name")}
						placeholder="np. Production Safe"
						className={errors.name ? "border-red-500 focus:border-red-500" : ""}
					/>
					{errors.name && (
						<p className="text-xs text-red-500 font-mono">{errors.name.message}</p>
					)}
				</div>

				{/* Router Strategy */}
				<div className="space-y-6 pt-6 border-t border-zinc-900">
					<h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Strategia</h4>
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
