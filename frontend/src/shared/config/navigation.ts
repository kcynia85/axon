import {
  LayoutDashboard,
  MessageSquare,
  Library,
  Brain,
  Settings,
  Inbox,
  FileText,
  Workflow,
  Zap
} from "lucide-react";

export const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Workspace", href: "/workspace", icon: MessageSquare },
  { name: "Projects", href: "/projects", icon: Library },
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Brain", href: "/brain", icon: Brain },
  { name: "Workflows", href: "/workflows", icon: Workflow },
  { name: "Common Uses", href: "/common-uses", icon: Zap },
];

export const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Docs", href: "/docs", icon: FileText },
];
