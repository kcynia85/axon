import {
  Library,
  Layout,
  SquareStack,
  Database,
  FileText,
  Inbox,
  Settings,
  Home,
  MousePointer2,
} from "lucide-react";

export const mainNavigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Projects", href: "/projects", icon: Library },
  { name: "Spaces", href: "/spaces", icon: MousePointer2 },
  { name: "Workspaces", href: "/workspaces", icon: SquareStack },
];

export const appsDropdown = [
  { name: "Notion", href: "https://notion.so" },
  { name: "Figma", href: "https://figma.com" },
  { name: "n8n", href: "https://n8n.io" },
  { name: "Google Drive", href: "https://drive.google.com" },
];

export const bottomNavigation = [
  { name: "Resources", href: "/resources", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Docs", href: "/docs", icon: FileText },
];
