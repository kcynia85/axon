import {
  Library,
  SquareStack,
  Database,
  Inbox,
  Home,
  MousePointer2,
  ChartNoAxesColumn,
  Settings,
} from "lucide-react";

export const mainNavigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Spaces", href: "/spaces", icon: MousePointer2 },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Projects", href: "/projects", icon: Library },
  { name: "Workspaces", href: "/workspaces", icon: SquareStack },
];

export const bottomNavigation = [
  { name: "Analytics", href: "/analytics", icon: ChartNoAxesColumn },
  { name: "Resources", href: "/resources", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];
