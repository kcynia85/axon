import type React from "react";

export type StudioLayoutProps = {
	readonly navigator: React.ReactNode;
	readonly canvas: React.ReactNode;
	readonly poster: React.ReactNode;
	readonly footer: React.ReactNode;
	readonly exitButton: React.ReactNode;
	readonly studioLabel?: string;
	readonly canvasRef?: (node: HTMLDivElement | null) => void;
	readonly className?: string;
};

export type StudioSidebarProps = {
	readonly children: React.ReactNode;
	readonly position: "left" | "right";
	readonly className?: string;
};

export type StudioCanvasProps = {
	readonly children: React.ReactNode;
	readonly canvasRef?: (node: HTMLDivElement | null) => void;
	readonly className?: string;
};

export type StudioActionBarProps = {
	readonly children: React.ReactNode;
	readonly className?: string;
};
