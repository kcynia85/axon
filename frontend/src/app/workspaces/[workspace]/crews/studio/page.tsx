import { Suspense } from "react";
import { getAvailableAgents } from "@/modules/studio/features/crew-studio/application/crew-actions";
import { CrewStudioContainer } from "@/modules/studio/features/crew-studio/ui/CrewStudioContainer";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

interface Props {
	params: Promise<{ workspace: string }>;
}

/**
 * CrewStudioPage: RSC entry point for Crew Studio.
 */
export default async function CrewStudioPage({ params }: Props) {
	const { workspace } = await params;

	// Fetch agents on the server side
	const availableAgents = await getAvailableAgents(workspace);


	return (
		<Suspense fallback={<CrewStudioSkeleton />}>
			<CrewStudioContainer 
				workspaceId={workspace} 
				availableAgents={availableAgents} 
			/>
		</Suspense>
	);
}

function CrewStudioSkeleton() {
	return (
		<div className="p-12 space-y-12 bg-black min-h-screen">
			<Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
			<Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
		</div>
	);
}
