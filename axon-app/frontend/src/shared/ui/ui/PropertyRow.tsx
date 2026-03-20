import { cn } from "@/shared/lib/utils";
import * as React from "react";

export type PropertyRowProps = {
	readonly label: React.ReactNode;
	readonly value: React.ReactNode;
	readonly valueMono?: boolean;
	readonly className?: string;
	readonly align?: "start" | "center" | "end";
};

/**
 * Generyczny wiersz "Klucz - Wartość", służący do wyświetlania słowników danych.
 */
export const PropertyRow = ({
	label,
	value,
	valueMono = false,
	className,
	align = "center",
}: PropertyRowProps) => {
	return (
		<div
			className={cn(
				"flex justify-between w-full gap-4",
				{
					"items-start": align === "start",
					"items-center": align === "center",
					"items-end": align === "end",
				},
				className
			)}
		>
			<span className="text-zinc-600 dark:text-zinc-400">{label}</span>
			<span
				className={cn("text-zinc-900 dark:text-white text-right", {
					"font-mono": valueMono,
				})}
			>
				{value}
			</span>
		</div>
	);
};
