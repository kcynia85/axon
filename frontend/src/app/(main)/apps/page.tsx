import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";

export default function AppsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Apps" 
        description="Integrated tools and third-party shortcuts."
      />
      <PageContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
           <div className="p-4 border rounded-md hover:bg-muted cursor-pointer">Notion</div>
           <div className="p-4 border rounded-md hover:bg-muted cursor-pointer">Figma</div>
           <div className="p-4 border rounded-md hover:bg-muted cursor-pointer">n8n</div>
           <div className="p-4 border rounded-md hover:bg-muted cursor-pointer">Google Drive</div>
        </div>
      </PageContent>
    </PageContainer>
  );
}
