"use client";

import React from "react";
import { PageContainer } from "./PageContainer";
import { PageContent } from "./PageContent";
import { Breadcrumbs } from "./Breadcrumbs";
import { PageHeader } from "./PageHeader";
import { Pagination } from "./Pagination";
import { cn } from "@/shared/lib/utils";
import type { PageLayoutProps } from "@/shared/lib/types/page-layout";

export const PageLayout = ({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  pagination,
  showPagination = true,
  className,
}: PageLayoutProps) => {
  return (
    <PageContainer>
      <PageContent>
        <div className={cn("flex flex-col space-y-8 pt-2 pb-6", className)}>
          {/* Breadcrumbs Section */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header Section */}
          <PageHeader 
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
            pagination || <Pagination pages={[]} canGoBack={false} canGoNext={false} onBack={() => {}} onNext={() => {}} />
          )}
        </div>
      </PageContent>
    </PageContainer>
  );
};
