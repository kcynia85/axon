"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/ui/Button";
import { FormHeading } from "@/shared/ui/form/FormHeading";

export default function CrewStudioError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Crew Studio Error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-black flex items-center justify-center p-6">
			<div className="max-w-md w-full text-center space-y-8">
				<div className="space-y-4">
					<FormHeading className="text-destructive">Oops! Something went wrong.</FormHeading>
					<p className="text-zinc-500 font-mono text-sm leading-relaxed">
						An error occurred while loading Crew Studio. 
					</p>
				</div>
				<Button onClick={() => reset()} className="w-full bg-white text-black hover:bg-zinc-200">
					Try again
				</Button>
			</div>
		</div>
	);
}
