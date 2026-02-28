import { getProjects } from "@/modules/projects";
import { CreateProjectDialog } from "@/modules/projects/features/browse-projects/ui/CreateProjectDialog";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { ProjectsBrowser } from "@/modules/projects/features/browse-projects/ui/ProjectsBrowser";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const ProjectsPage = async () => {
    const projects = await getProjects();

    return (
        <PageContainer>
            <PageContent>
                <div className="flex flex-col space-y-8 py-6 max-w-5xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                        <Link href="/dashboard" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Dashboard</Link>
                        <ChevronRight size={10} className="text-zinc-300" />
                        <span className="text-zinc-800 dark:text-zinc-200">Projects</span>
                    </nav>

                    {/* Header */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight">Projekty</h1>
                                <p className="text-muted-foreground">Browse and manage all your ongoing initiatives.</p>
                            </div>
                            <CreateProjectDialog />
                        </div>
                    </div>

                    {/* Interactive Projects Browser (with FilterBar Pattern 1) */}
                    <ProjectsBrowser initialProjects={projects} />

                    {/* Pagination Placeholder */}
                    <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900">
                        <div className="flex justify-end">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <button 
                                        key={i}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm transition-colors ${i === 1 ? 'bg-black text-white border-black' : 'border-zinc-200 hover:border-black'}`}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PageContent>
        </PageContainer>
    );
};

export default ProjectsPage;
