import { getProjects } from "@/modules/projects";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/CreateProjectDialog";
import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { ProjectsBrowser } from "@/modules/projects/features/browse-projects/ui/ProjectsBrowser";
import { shouldShowPagination } from "@/shared/lib/pagination";

const ProjectsPage = async () => {
    const projects = await getProjects();

    return (
        <ModulePageLayout
            title="Projekty"
            description="Browse and manage all your ongoing initiatives."
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Projects" }
            ]}
            actions={<CreateProjectDialog />}
            pagination={null} // Uses default pagination if passed as empty or specific if needed
            showPagination={shouldShowPagination(projects.length)}
        >
            <ProjectsBrowser initialProjects={projects} />
        </ModulePageLayout>
    );
};

export default ProjectsPage;
