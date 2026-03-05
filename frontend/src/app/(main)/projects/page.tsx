import { getProjects } from "@/modules/projects";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/CreateProjectDialog";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { ProjectsBrowser } from "@/modules/projects/features/browse-projects/ui/ProjectsBrowser";
import { shouldShowPagination } from "@/shared/lib/pagination";

const ProjectsPage = async () => {
    const projects = await getProjects();

    return (
        <PageLayout
            title="Projekty"
            description="Browse and manage all your ongoing initiatives."
            breadcrumbs={[
                { label: "Home", href: "/home" },
                { label: "Projects" }
            ]}
            actions={<CreateProjectDialog />}
            pagination={null} // Uses default pagination if passed as empty or specific if needed
            showPagination={shouldShowPagination(projects.length)}
        >
            <ProjectsBrowser initialProjects={projects} />
        </PageLayout>
    );
};

export default ProjectsPage;
