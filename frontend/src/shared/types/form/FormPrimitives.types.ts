import type React from "react";

export type FormHeadingProps = {
	readonly children: React.ReactNode;
	readonly className?: string;
};

export type FormSubheadingProps = {
	readonly children: React.ReactNode;
	readonly className?: string;
};

export type FormSectionStepProps = {
	readonly number: string | number;
	readonly className?: string;
};

export type FormSectionProps = {
	readonly id: string;
	readonly number: number;
	readonly title: string;
	readonly children: React.ReactNode;
	readonly className?: string;
};

export type FormProgressProps = {
	readonly current: number;
	readonly total: number;
	readonly isActive: boolean;
	readonly className?: string;
};

export type FormTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	readonly className?: string;
};

export type FormTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	readonly className?: string;
};

export type FormItemFieldProps = {
	readonly label?: string;
	readonly children: React.ReactNode;
	readonly error?: string;
	readonly className?: string;
};

export type FormSliderProps = {
	readonly value: number;
	readonly onChange: (value: number) => void;
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
	readonly labelLeft?: string;
	readonly labelRight?: string;
	readonly className?: string;
};
