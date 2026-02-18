import { WorkspacesList } from "@/modules/workspaces/ui/workspaces-list";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Plus } from "lucide-react";

export default function WorkspacesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Workspaces" 
        description="Manage your AI agents and crews in isolated environments."
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Workspace
        </Button>
      </PageHeader>
      <PageContent>
        <WorkspacesList />
      </PageContent>
    </PageContainer>
  );
}
