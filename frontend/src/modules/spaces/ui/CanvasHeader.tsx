import React from "react";
import {
  Card,
  CardBody,
} from "@heroui/react";
import Link from "next/link";

interface CanvasHeaderProps {
    spaceName: string;
    projectName: string;
    projectId?: string;
}

export const CanvasHeader = ({ spaceName, projectName, projectId = "p1" }: CanvasHeaderProps) => {
    return (
        <div className="absolute top-8 left-8 z-50 pointer-events-none select-none">
             <div className="flex flex-col gap-3 pointer-events-auto">
                 {/* Breadcrumbs */}
                 <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] ml-1">
                    <Link href="/spaces" className="hover:text-zinc-300 transition-colors">Spaces</Link>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-300">{spaceName}</span>
                 </div>

                <Card className="bg-black border border-zinc-200 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl py-3 px-8 min-w-[340px]">
                    <CardBody className="p-0 flex-row justify-between items-center gap-8 overflow-visible">
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tight text-white">{spaceName}</h1>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase text-green-500 tracking-wider">Active</span>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold text-zinc-500 tracking-wide">
                                Linked: <Link href={`/projects/${projectId}`} className="text-zinc-300 hover:text-white underline decoration-zinc-700 underline-offset-4 transition-colors">{projectName}</Link>
                            </span>
                        </div>
                    </CardBody>
                </Card>
             </div>
        </div>
    );
};
