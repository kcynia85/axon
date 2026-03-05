"use client";

import React from "react";
import { PageContainer } from "./PageContainer";
import { PageContent } from "./PageContent";
import { Breadcrumbs } from "./Breadcrumbs";
import { ModuleHeader } from "./ModuleHeader";
import { ModulePagination } from "./ModulePagination";
import { cn } from "@/shared/lib/utils";
import type { ModulePageLayoutProps } from "@/shared/lib/types/module-page-layout";

export const ModulePageLayout = ({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  pagination,
  showPagination = true,
  className,
}: ModulePageLayoutProps) => {
  return (
    <PageContainer>
      <PageContent>
        <div className={cn("flex flex-col space-y-8 py-6 max-w-5xl mx-auto", className)}>
          {/* Breadcrumbs Section */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header Section */}
          <ModuleHeader 
            title={title} 
            description={description} 
            actions={actions} 
          />

          {/* Browser / Content Area */}
          <div className="flex-1">
            {children}
          </div>

          {/* Pagination Section */}
          {showPagination && (
            pagination || <ModulePagination pages={[]} canGoBack={false} canGoNext={false} onBack={() => {}} onNext={() => {}} />
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
};
