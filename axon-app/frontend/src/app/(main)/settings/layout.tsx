"use client";

import React from "react";
import { SettingsNavIsland } from "@/modules/settings/ui/SettingsNavIsland";
import { PageLayout } from "@/shared/ui/layout/PageLayout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col pt-[140px] relative overflow-hidden">
      <SettingsNavIsland />
      
      <div className="flex-1 overflow-auto bg-white dark:bg-[#09090b]">
        <PageLayout className="p-8 max-w-6xl mx-auto">
          {children}
        </PageLayout>
      </div>
    </div>
  );
}
