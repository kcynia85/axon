import { FormNavItem } from "@/shared/ui/form/FormNavItem";
import { FormNavFooter } from "@/shared/ui/form/FormNavFooter";
import { FormNavList } from "@/shared/ui/form/FormNavList";
import { FormNavLibraryButton } from "@/shared/ui/form/FormNavLibraryButton";
import { FormNavContainer } from "@/shared/ui/form/FormNavContainer";
import { useCrewStudioSectionNav, type CrewStudioSectionNavProps } from "../../application/hooks/useCrewStudioSectionNav";

export const CrewStudioSectionNav = (props: CrewStudioSectionNavProps) => {
	const { items } = useCrewStudioSectionNav(props);
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
							onClick={() => onSectionClick(section.id as any)}
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
