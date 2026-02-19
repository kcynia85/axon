"use client";

import { AgentModal } from "./agent-modal";
import { CrewModal } from "./crew-modal";
import { ServiceModal } from "./service-modal";
import { PatternModal } from "./pattern-modal";
import { TemplateModal } from "./template-modal";
import { ArchetypeLoaderModal } from "./archetype-loader-modal";
import { InternalSkillsModal } from "./internal-skills-modal";
import { Suspense } from "react";

export const WorkspaceModals = () => {
  return (
    <Suspense>
      <AgentModal />
      <CrewModal />
      <ServiceModal />
      <PatternModal />
      <TemplateModal />
      <ArchetypeLoaderModal />
      <InternalSkillsModal />
    </Suspense>
  );
};
