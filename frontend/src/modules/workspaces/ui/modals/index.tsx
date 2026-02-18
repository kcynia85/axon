"use client";

import { AgentModal } from "./agent-modal";
import { CrewModal } from "./crew-modal";
import { ServiceModal } from "./service-modal";
import { AutomationModal } from "./automation-modal";
import { Suspense } from "react";

export const WorkspaceModals = () => {
  return (
    <Suspense>
      <AgentModal />
      <CrewModal />
      <ServiceModal />
      <AutomationModal />
      {/* Templates i Patterns będą dodane w kolejnym kroku */}
    </Suspense>
  );
};
