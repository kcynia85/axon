import React from "react";
import { Clock, FolderOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Project } from "../../../domain";
import { cn } from "@/shared/lib/utils";

interface RecentlyUsedProjectsProps {
  readonly projects: readonly Project[];
  readonly className?: string;
}

export const RecentlyUsedProjects: React.FC<RecentlyUsedProjectsProps> = ({ projects, className }) => {
  if (projects.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} />
          Recently Used
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {projects.slice(0, 3).map((project) => (
          <button key={project.id} className="group text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FolderOpen size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{project.project_name || project.name}</p>
                <p className="text-[10px] text-zinc-400 truncate uppercase tracking-tighter">{project.project_status || project.status}</p>
              </div>
              <ArrowRight size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
