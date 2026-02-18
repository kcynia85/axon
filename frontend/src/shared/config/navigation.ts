import {
  LayoutDashboard,
  Library,
  Layout,
  SquareStack,
  Database,
  AppWindow,
  FileText,
  Inbox,
  Settings,
  Home
} from "lucide-react";

export const mainNavigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: Library },
  { name: "Spaces", href: "/spaces", icon: Layout },
  { name: "Workspaces", href: "/workspaces", icon: SquareStack },
  { name: "Resources", href: "/resources", icon: Database },
  { name: "Apps", href: "/apps", icon: AppWindow },
  { name: "Inbox", href: "/inbox", icon: Inbox },
];

export const secondaryNavigation = [
  { name: "Docs", href: "/docs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];
