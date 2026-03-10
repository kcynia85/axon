import type React from "react";

export type StudioHeadingProps = {
	readonly children: React.ReactNode;
	readonly className?: string;
};

export type SectionStepProps = {
	readonly number: string | number;
	readonly className?: string;
};

export type BlueprintSectionProps = {
	readonly id: string;
	readonly number: number;
	readonly title: string;
	readonly children: React.ReactNode;
	readonly className?: string;
};

export type ProgressTrackProps = {
	readonly current: number;
	readonly total: number;
	readonly isActive: boolean;
	readonly className?: string;
};
