"use client";

import * as React from "react";
import { Check } from "lucide-react";

export const InboxEmptyState = (): React.ReactNode => {
    return (
        <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10">
                    <Check className="h-10 w-10 text-white stroke-[3px]" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                You&apos;re all caught up
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[240px] leading-relaxed">
                You&apos;ll be notified here for agent activity, project updates, and more
            </p>
        </div>
    );
};
