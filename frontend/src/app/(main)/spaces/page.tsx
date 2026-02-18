import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

export default function SpacesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Spaces" 
        description="Visual canvas for complex workflows and system design."
      />
      <PageContent>
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
          <p>Spaces Overview / Canvas coming soon.</p>
        </div>
      </PageContent>
    </PageContainer>
  );
}
