"use client";

import React from "react";
import { SettingsNavIsland } from "@/modules/settings/ui/SettingsNavIsland";

/**
 * SettingsLayout - Core layout for all settings pages.
 * 
 * Standardized padding top to pt-[60px] to match Resources module.
 * Child pages are responsible for their own headers using PageLayout.
 */
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col pt-[60px] relative overflow-hidden">
      <SettingsNavIsland />
      
      <div className="flex-1 overflow-auto bg-white dark:bg-[#09090b]">
        {children}
      </div>
    </div>
  );
}
