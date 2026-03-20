import { LucideIcon } from "lucide-react";

export type QuickAccessCardProps = {
  readonly title: string;
  readonly status: string;
  readonly icon?: LucideIcon;
  readonly badge?: string; // Optional top badge (e.g., "Space", "Project")
  readonly onClick?: () => void;
  readonly href?: string;
  readonly className?: string;
  readonly hideArrow?: boolean; // If true, the hover arrow will not be shown
};

export type QuickAccessGridProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
};
