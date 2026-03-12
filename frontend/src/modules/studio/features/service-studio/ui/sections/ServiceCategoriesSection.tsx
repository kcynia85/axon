import { useFormContext } from "react-hook-form";
import { FormSection } from "@/shared/ui/form/FormSection";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormItemField } from "@/shared/ui/form/FormItemField";
import { FormField } from "@/shared/ui/ui/Form";
import type { ServiceStudioFormData } from "../../types/service-schema";

const CATEGORIES = [
	{ id: "GenAI", title: "GenAI" },
	{ id: "Utility", title: "Utility" },
];

export const ServiceCategoriesSection = () => {
	const { control, formState: { errors } } = useFormContext<ServiceStudioFormData>();
	
	return (
		<FormSection
			id="categories"
			number={2}
			title="Categories"
			description="Classify your service to help the organization discover and reuse it."
		>
			<FormField
				control={control}
				name="categories"
				render={({ field }) => {
					const selectedCategories = field.value || [];
					
					const toggleCategory = (categoryId: string) => {
						const next = selectedCategories.includes(categoryId)
							? selectedCategories.filter((id: string) => id !== categoryId)
							: [...selectedCategories, categoryId];
						field.onChange(next);
					};

					return (
						<FormItemField error={errors.categories?.message}>
							<div className="grid grid-cols-2 gap-4">
								{CATEGORIES.map((category) => (
									<FormCheckbox
										key={category.id}
										title={category.title}
										checked={selectedCategories.includes(category.id)}
										onChange={() => toggleCategory(category.id)}
									/>
								))}
							</div>
						</FormItemField>
					);
				}}
			/>
		</FormSection>
	);
};
