import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SpacesBrowser } from "@/modules/spaces/ui/SpacesBrowser";
import { Space } from "@/modules/spaces/domain";

const INITIAL_SPACES: Space[] = [
  {
    id: "1",
    name: "Project Phoenix",
    description: "Main workspace for the Phoenix redesign project. Contains discovery and design zones.",
    lastEdited: "Last edited 2 hours ago",
    status: "active",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: "2",
    name: "Customer Discovery",
    description: "Space dedicated to customer interviews and feedback analysis.",
    lastEdited: "Last edited 1 day ago",
    status: "active",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "3",
    name: "Market Research 2026",
    description: "Global market analysis for the upcoming product launch.",
    lastEdited: "Last edited 3 days ago",
    status: "active",
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
  }
];

export default function SpacesPage() {
  return (
    <ModulePageLayout
      title="Spaces"
      description="Manage your workspaces and canvas environments."
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Spaces" }
      ]}
      actions={
        <Button variant="primary" size="lg" asChild>
          <Link href="/spaces/new">
            <Plus className="mr-2 h-4 w-4" />
            New Space
          </Link>
        </Button>
      }
      pagination={null}
      showPagination={false}
    >
      <SpacesBrowser initialSpaces={INITIAL_SPACES} />
    </ModulePageLayout>
  );
}
