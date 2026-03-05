import { PageLayout } from "@/shared/ui/layout/PageLayout";
import Link from "next/link";
import { SpacesBrowser } from "@/modules/spaces/ui/SpacesBrowser";
import { Space } from "@/modules/spaces/domain";
import { ActionButton } from "@/shared/ui/complex/ActionButton";

const INITIAL_SPACES: Space[] = [
  {
    id: "1",
    name: "Project Phoenix",
    description: "Main workspace for the Phoenix redesign project. Contains discovery and design zones.",
    lastEdited: "Last edited 2 hours ago",
    status: "active",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    projectId: "p1",
    projectName: "Phoenix Redesign"
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
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    projectId: "p2",
    projectName: "Global Launch"
  }
];

export default function SpacesPage() {
  return (
    <PageLayout
      title="Spaces"
      description="Manage your workspaces and canvas environments."
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Spaces" }
      ]}
      actions={
        <ActionButton label="New Space" asChild>
          <Link href="/spaces/new" />
        </ActionButton>
      }
      pagination={null}
      showPagination={false}
    >
      <SpacesBrowser initialSpaces={INITIAL_SPACES} />
    </PageLayout>
  );
}
