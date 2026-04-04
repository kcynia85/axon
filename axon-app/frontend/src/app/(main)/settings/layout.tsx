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
    <div className="flex-1 overflow-y-auto pt-[60px]">
      <SettingsNavIsland />
      
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

