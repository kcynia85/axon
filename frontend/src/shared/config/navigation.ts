import {
  Library,
  Layout,
  SquareStack,
  Database,
  FileText,
  Inbox,
  Settings,
  Home,
  Briefcase,
  Workflow,
  Cloud,
} from "lucide-react";

export const mainNavigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Library },
  { name: "Spaces", href: "/spaces", icon: Layout },
  { name: "Workspaces", href: "/workspaces", icon: SquareStack },
  { name: "Resources", href: "/resources", icon: Database },
];

export const appsDropdown = [
  { name: "Notion", href: "https://notion.so", icon: Briefcase },
  { name: "Figma", href: "https://figma.com", icon: Layout },
  { name: "n8n", href: "https://n8n.io", icon: Workflow },
  { name: "Google Drive", href: "https://drive.google.com", icon: Cloud },
];

export const docsLink = { name: "Docs", href: "https://docs.axon.dev", icon: FileText };

export const bottomNavigation = [
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Settings", href: "/settings", icon: Settings },
];
