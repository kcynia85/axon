'use client';

import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { SpacesBrowser } from "@/modules/spaces/ui/SpacesBrowser";
import { CreateSpaceDialog } from "@/modules/spaces/ui/components/CreateSpaceDialog";
import { useSpaces } from "@/modules/spaces/application/hooks";

export default function SpacesPage() {
  const { data: spaces = [], isLoading } = useSpaces();

  return (
    <PageLayout
      title="Spaces"
      description="Manage your workspaces and canvas environments."
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Spaces" }
      ]}
      actions={<CreateSpaceDialog />}
      pagination={null}
      showPagination={false}
    >
      <SpacesBrowser initialSpaces={spaces} isLoading={isLoading} />
    </PageLayout>
  );
}
