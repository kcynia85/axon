import { getBacklogContent, getChangelogContent, StructuredBacklog } from "@/lib/docs-reader";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { DocsView } from "@/modules/knowledge/features/documentation/ui/docs-view";

const DocsPage = async () => {
    const backlog: StructuredBacklog = await getBacklogContent();
    const changelogContent = await getChangelogContent();

    return (
        <PageContainer>
            <PageHeader title="Documentation" />
            <PageContent>
                <DocsView backlog={backlog} changelogContent={changelogContent} />
            </PageContent>
        </PageContainer>
    );
};

export default DocsPage;


