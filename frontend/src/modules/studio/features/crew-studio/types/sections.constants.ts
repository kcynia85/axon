import { Info, Workflow, UserCircle, ShieldCheck, Database, FileText } from "lucide-react";

export type CrewStudioSectionId = "basic-info" | "collaboration-type" | "execution" | "context" | "artefacts" | "availability";

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
		id: "context" as CrewStudioSectionId,
		number: 4,
		title: "Context",
		icon: Database,
	},
	{
		id: "artefacts" as CrewStudioSectionId,
		number: 5,
		title: "Artefacts",
		icon: FileText,
	},
	{
		id: "availability" as CrewStudioSectionId,
		number: 6,
		title: "Availability",
		icon: ShieldCheck,
	},
];
