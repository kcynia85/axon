import { getProjects, NewProjectStudioButton, ProjectsBrowser } from "@/modules/projects";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
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
            actions={<NewProjectStudioButton />}
            pagination={null} // Uses default pagination if passed as empty or specific if needed
            showPagination={shouldShowPagination(projects.length)}
        >
            <ProjectsBrowser initialProjects={projects} />
        </PageLayout>
    );
};

export default ProjectsPage;
