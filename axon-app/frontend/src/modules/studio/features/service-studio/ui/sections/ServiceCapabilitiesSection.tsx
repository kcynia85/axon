import { useFormContext, useFieldArray } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { FormField } from "@/shared/ui/ui/Form";
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { ServiceStudioFormData } from "../../types/service-schema";
import { useState, type KeyboardEvent, useRef } from "react";
import { cn } from "@/shared/lib/utils";

export const ServiceCapabilitiesSection = () => {
	const { control, formState: { errors } } = useFormContext<ServiceStudioFormData>();
	
	const { fields, append, remove } = useFieldArray({
		control,
		name: "capabilities",
	});

	const [newName, setNewName] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const descriptionRef = useRef<HTMLInputElement>(null);

	const handleAdd = () => {
		if (newName.trim()) {
			append({ name: newName, description: newDescription });
			setNewName("");
			setNewDescription("");
			if (fields.length >= 3) setIsExpanded(true);
		}
	};

	const handleNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			descriptionRef.current?.focus();
		}
	};

	const handleDescriptionKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	};

	const visibleFields = isExpanded ? fields : fields.slice(0, 3);
	const hasMore = fields.length > 3;

	return (
		<FormSection
		        id="capabilities"
		        number={3}
		        title="Capabilities"
		        description="Define specific features this service provides. Use AI to import from documentation URL."
		        variant="island"
		>

			<div className="space-y-12">
				<div className="space-y-6">
					<Button
						type="button"
						variant="ghost"
						className="gap-2 text-primary hover:bg-primary/5 h-12 px-0 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all justify-start underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
					>
						<Sparkles className="w-4 h-4" /> Import z URL / Docs
					</Button>

					<div className="p-6 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/5 transition-all focus-within:border-primary/30 focus-within:bg-primary/[0.02] flex gap-6 items-center">
						<div className="flex-1 flex flex-col gap-3">
							<Input
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								onKeyDown={handleNameKeyDown}
								placeholder="Add capability name..."
								className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-base font-bold h-12 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white px-4 w-full"
							/>
							<Input
								ref={descriptionRef}
								value={newDescription}
								onChange={(e) => setNewDescription(e.target.value)}
								onKeyDown={handleDescriptionKeyDown}
								placeholder="Add description..."
								className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-sm h-10 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white px-4 w-full"
							/>
						</div>
						<Button
							type="button"
							onClick={handleAdd}
							disabled={!newName.trim()}
							className={cn(
								"h-12 w-12 shrink-0 rounded-xl transition-all shadow-lg",
								newName.trim() 
									? "bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-primary/20" 
									: "bg-zinc-800 text-zinc-600 opacity-20"
							)}
						>
							<Plus className="w-6 h-6" strokeWidth={3} />
						</Button>
					</div>
				</div>

				<div className="space-y-4">
					{visibleFields.map((field, index) => (
						<div 
							key={field.id} 
							className="relative group p-4 rounded-2xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-all shadow-sm"
						>
							<div className="flex flex-col gap-2 pr-12">
								<FormField
									control={control}
									name={`capabilities.${index}.name`}
									render={({ field: inputField }) => (
										<Input
											{...inputField}
											className="bg-transparent border-none text-primary placeholder:text-primary/40 font-bold h-auto p-0 focus-visible:ring-0 text-lg"
											placeholder="Name..."
										/>
									)}
								/>
								<FormField
									control={control}
									name={`capabilities.${index}.description`}
									render={({ field: inputField }) => (
										<Input
											{...inputField}
											className="bg-transparent border-none text-primary/70 placeholder:text-primary/20 text-sm h-auto p-0 focus-visible:ring-0"
											placeholder="Description..."
										/>
									)}
								/>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => remove(index)}
								className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-destructive hover:bg-destructive/10 shrink-0 transition-all h-10 w-10 rounded-xl"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					))}

					{hasMore && (
						<button
							type="button"
							onClick={() => setIsExpanded(!isExpanded)}
							className="w-full py-4 border-2 border-dashed border-zinc-900 hover:border-primary/20 rounded-2xl transition-all flex items-center justify-center gap-3 group"
						>
							<div className="w-8 h-8 rounded-full bg-zinc-900 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
								{isExpanded ? (
									<ChevronUp className="w-4 h-4 text-zinc-500 group-hover:text-primary" />
								) : (
									<ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-primary" />
								)}
							</div>
							<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-primary transition-colors">
								{isExpanded ? "Show Less" : `Show ${fields.length - 3} More Capabilities`}
							</span>
						</button>
					)}
				</div>

				{errors.capabilities?.root && (
					<p className="text-destructive text-xs font-mono mt-2">{errors.capabilities.root.message}</p>
				)}
			</div>
		</FormSection>
	);
};
