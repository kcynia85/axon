import { WorkspacesList } from "@/modules/workspaces/ui/WorkspacesList";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
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
