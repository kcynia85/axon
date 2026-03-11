import { Info, Workflow, UserCircle, ShieldCheck } from "lucide-react";

export type CrewStudioSectionId = "basic-info" | "collaboration-type" | "execution" | "availability";

export const CREW_STUDIO_SECTIONS = [
	{
		id: "basic-info" as CrewStudioSectionId,
		number: 1,
		title: "Basic Information",
		icon: Info,
	},
	{
		id: "collaboration-type" as CrewStudioSectionId,
		number: 2,
		title: "Collaboration Process",
		icon: Workflow,
	},
	{
		id: "execution" as CrewStudioSectionId,
		number: 3,
		title: "Executors and Tasks",
		icon: UserCircle,
	},
	{
		id: "availability" as CrewStudioSectionId,
		number: 4,
		title: "Availability",
		icon: ShieldCheck,
	},
];
