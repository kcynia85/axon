import { LucideIcon } from "lucide-react";
import React from "react";

export type MainCardProps = {
  readonly href?: string;
  readonly onClick?: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
};

export type MainCardHeaderProps = {
  readonly title: string;
  readonly icon?: LucideIcon;
  readonly children?: React.ReactNode; // For status/badges
  readonly className?: string;
};

export type MainCardContentProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
};

export type MainCardFooterProps = {
  readonly label: string;
  readonly className?: string;
};
