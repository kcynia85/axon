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

export const appsDropdown = [
  { name: "Notion", href: "https://notion.so" },
  { name: "Figma", href: "https://figma.com" },
  { name: "n8n", href: "https://n8n.io" },
  { name: "Google Drive", href: "https://drive.google.com" },
];

export const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Analytics", href: "/analytics", icon: ChartNoAxesColumn },
  { name: "Resources", href: "/resources", icon: Database },
];
