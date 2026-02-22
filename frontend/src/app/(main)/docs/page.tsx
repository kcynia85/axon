import { getBacklogContent, getChangelogContent, StructuredBacklog } from "@/lib/docsReader";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { DocsView } from "@/modules/knowledge/features/documentation/ui/DocsView";

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


