import { LucideIcon } from "lucide-react";

export type ResourceQuickCardProps = {
  readonly title: string;
  readonly status: string;
  readonly icon: LucideIcon;
  readonly badge?: string; // Optional top badge (e.g., "Space", "Project")
  readonly onClick?: () => void;
  readonly href?: string;
  readonly className?: string;
};

export type ResourceQuickGridProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
};
