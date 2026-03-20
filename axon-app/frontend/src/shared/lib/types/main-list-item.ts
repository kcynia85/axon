import { LucideIcon } from "lucide-react";
import React from "react";

export type MainListItemProps = {
  readonly href?: string;
  readonly onClick?: () => void;
  readonly children: React.ReactNode;
  readonly className?: string;
};

export type MainListItemInfoProps = {
  readonly title: string;
  readonly status: string;
  readonly icon: LucideIcon;
  readonly children?: React.ReactNode;
  readonly className?: string;
};

export type MainListItemContentProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
};

export type MainListItemActionsProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
};
