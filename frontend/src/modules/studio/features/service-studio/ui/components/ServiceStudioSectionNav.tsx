import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { SERVICE_STUDIO_SECTIONS, type ServiceStudioSectionId } from "../../types/sections.constants";
import { useFormContext } from "react-hook-form";
import type { ServiceStudioFormData } from "../../types/service-schema";

interface Props {
	activeSection: ServiceStudioSectionId;
	onSectionClick: (id: ServiceStudioSectionId) => void;
	onExitToLibrary: () => void;
}

export const ServiceStudioSectionNav = ({ activeSection, onSectionClick, onExitToLibrary }: Props) => {
	const { watch } = useFormContext<ServiceStudioFormData>();
	const formData = watch();

	const calculateProgress = (sectionId: ServiceStudioSectionId) => {
		switch (sectionId) {
			case "basic-info":
				const basicFields = [formData.name, formData.url];
				return basicFields.filter(Boolean).length;
			case "categories":
				return (formData.categories?.length || 0) > 0 ? 1 : 0;
			case "capabilities":
				return (formData.capabilities?.length || 0);
			case "availability":
				return (formData.availability?.length || 0) > 0 ? 1 : 0;
			default:
				return 0;
		}
	};

	const getTotal = (sectionId: ServiceStudioSectionId) => {
		switch (sectionId) {
			case "basic-info": return 2;
			case "categories": return 1;
			case "capabilities": return Math.max(formData.capabilities?.length || 0, 1);
			case "availability": return 1;
			default: return 0;
		}
	};

	return (
		<FormNavContainer>
			<div className="flex flex-col h-full">
				<div className="flex-1 pt-12 px-1">
					<FormNavList>
						{SERVICE_STUDIO_SECTIONS.map((section) => (
							<FormNavItem
								key={section.id}
								number={section.number}
								title={section.title}
								isActive={activeSection === section.id}
								currentProgress={calculateProgress(section.id)}
								totalProgress={getTotal(section.id)}
								onClick={() => onSectionClick(section.id)}
							/>
						))}
					</FormNavList>
				</div>

				<FormNavFooter>
					<FormNavLibraryButton onClick={onExitToLibrary} label="Resources Library" />
				</FormNavFooter>
			</div>
		</FormNavContainer>
	);
};
