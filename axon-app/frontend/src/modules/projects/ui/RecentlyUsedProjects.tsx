import React from "react";
import { RecentlyUsedProjectsProps } from "./types";
import { RecentlyUsedHeader } from "./components/RecentlyUsedHeader";
import { RecentlyUsedItem } from "./components/RecentlyUsedItem";
import { RecentlyUsedGrid } from "./components/RecentlyUsedGrid";
import { RecentlyUsedContainer } from "./components/RecentlyUsedLayout";

export const RecentlyUsedProjects: React.FC<RecentlyUsedProjectsProps> = ({ projects, onSelect, className }) => {
  if (projects.length === 0) return null;

  return (
    <RecentlyUsedContainer className={className}>
      <RecentlyUsedHeader title="Recently Used" />
      
      <RecentlyUsedGrid>
        {projects.slice(0, 3).map((projectViewModel) => (
          <RecentlyUsedItem 
            key={projectViewModel.id} 
            viewModel={projectViewModel} 
            onClick={onSelect} 
          />
        ))}
      </RecentlyUsedGrid>
    </RecentlyUsedContainer>
  );
};
