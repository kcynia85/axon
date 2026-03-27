import React from "react";
import { useFormContext } from "react-hook-form";
import { ProviderFormData } from "../../types/provider-schema";
import { Button } from "@/shared/ui/ui/Button";
import { FileCode, Sparkles } from "lucide-react";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormTextarea } from "@/shared/ui/form/FormTextarea";

export const ProviderJsonSchemaSection = () => {
	const { control, setValue, register, formState: { errors } } = useFormContext<ProviderFormData>();

	const generateDefaultSchema = () => {
		const defaultSchema = JSON.stringify({
			"model": "string",
			"messages": "array",
			"temperature": "number",
			"max_tokens": "number"
		}, null, 2);
		setValue("json_schema_mapping", defaultSchema);
	};

	return (
		<FormSection id="schema" number={4} title="JSON Parameters Schema">
			<div className="space-y-12 max-w-3xl">
				<div className="flex items-center gap-4">
					<Button 
						type="button"
						variant="secondary" 
						size="sm" 
						className="gap-2"
						onClick={generateDefaultSchema}
					>
						<Sparkles className="w-4 h-4" /> Generuj Domyślny Schemat
					</Button>
				</div>

				<FormItemField 
					label="JSON Schema Configuration"
					error={errors.json_schema_mapping?.message}
					hint="Zdefiniuj strukturę JSON, którą Twój dostawca akceptuje w zapytaniach typu Chat Completion."
				>
					<div className="relative group">
						<div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-mono uppercase tracking-widest text-zinc-500">
							<FileCode className="w-3 h-3" /> JSON Editor
						</div>
						<FormTextarea
							{...register("json_schema_mapping")}
							className="min-h-[400px] font-mono text-sm shadow-2xl"
							placeholder='{ "model": "...", "messages": "..." }'
						/>
					</div>
				</FormItemField>
				
				<p className="text-xs text-zinc-600 italic">
					Hint: Możesz użyć edytora JSON, aby precyzyjnie dostosować schemat pod specyficzne API.
				</p>
			</div>
		</FormSection>
	);
};
