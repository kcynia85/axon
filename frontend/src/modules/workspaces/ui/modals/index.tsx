"use client";

import { CrewModal } from "./CrewModal";
import { ServiceModal } from "./ServiceModal";
import { PatternModal } from "./PatternModal";
import { TemplateModal } from "./TemplateModal";
import { ArchetypeLoaderModal } from "./ArchetypeLoaderModal";
import { InternalSkillsModal } from "./InternalSkillsModal";
import { Suspense } from "react";

export const WorkspaceModals = () => {
  return (
    <Suspense>
      <CrewModal />
      <ServiceModal />
      <PatternModal />
      <TemplateModal />
      <ArchetypeLoaderModal />
      <InternalSkillsModal />
    </Suspense>
  );
};
