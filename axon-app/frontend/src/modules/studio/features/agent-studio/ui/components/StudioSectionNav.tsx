import type { StudioSectionNavProps } from "../../types/StudioSectionNav.types";
import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import { useStudioSectionNav } from "../../application/hooks/useStudioSectionNav";

export const StudioSectionNav = (props: StudioSectionNavProps) => {
	const { items } = useStudioSectionNav(props);
	const { onSectionClick, onExitToLibrary } = props;

	return (
		<FormNavContainer>
			<FormNavList>
				{items.map((section) => (
					<li key={section.id}>
						<FormNavItem
							number={section.number}
							title={section.title}
							currentProgress={section.progress.current}
							totalProgress={section.progress.total}
							isActive={section.isActive}
							onClick={() => onSectionClick(section.id)}
						/>
					</li>
				))}
			</FormNavList>
			<FormNavFooter>
				<FormNavLibraryButton onClick={onExitToLibrary} />
			</FormNavFooter>
		</FormNavContainer>
	);
};
