import type React from "react";

export type FormNavItemProps = {
	readonly number: number;
	readonly title: string;
	readonly currentProgress: number;
	readonly totalProgress: number;
	readonly isActive: boolean;
	readonly onClick: () => void;
	readonly className?: string;
};

export type FormNavFooterProps = {
	readonly children: React.ReactNode;
	readonly className?: string;
};

export type FormNavListProps = {
	readonly children: React.ReactNode;
	readonly className?: string;
};

export type FormNavLibraryButtonProps = {
	readonly onClick: () => void;
	readonly label?: string;
	readonly className?: string;
};

export type FormNavContainerProps = {
	readonly children: React.ReactNode;
	readonly ariaLabel?: string;
	readonly className?: string;
};
