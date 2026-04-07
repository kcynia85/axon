import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export type AgentCardLayout = "grid" | "list";

export type AgentCardViewProps = {
  readonly title: string;
  readonly description: string;
  readonly badgeLabel?: string;
  readonly tags?: readonly string[];
  readonly layout?: AgentCardLayout;
  readonly visualArea?: ReactNode;
  readonly isDraft?: boolean;
  readonly colorName?: string;
  readonly onEdit: () => void;
  readonly onDelete: (id: string) => void;
  readonly onClick: () => void;
  readonly agentId: string;
  readonly className?: string;
};
