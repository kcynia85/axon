"use client";

import React from "react";
import { ToolDetailHeader } from "./components/ToolDetailHeader";
import { ToolDetailParameters } from "./components/ToolDetailParameters";
import { ToolDetailConsole } from "./components/ToolDetailConsole";
import { ToolDetailFooter } from "./components/ToolDetailFooter";
import type { ToolDetailViewProps } from "./types/tool-detail.types";

export const ToolDetailView = ({
  tool,
  parameters,
  result,
  isRunning,
  isSyncing,
  isTestSuccessful,
  onBack,
  onParameterChange,
  onStatusChange,
  onRun,
  onSync,
}: ToolDetailViewProps) => {
  return (
    <div className="flex flex-col h-screen bg-[#000000] text-zinc-100 overflow-hidden font-sans selection:bg-zinc-800">
      <ToolDetailHeader 
        tool={tool}
        onBack={onBack}
        onStatusChange={onStatusChange}
      />

      <div className="flex flex-1 overflow-hidden bg-[#000000]">
        <ToolDetailParameters 
          tool={tool}
          parameters={parameters}
          onParameterChange={onParameterChange}
        />
        <ToolDetailConsole result={result} />
      </div>

      <ToolDetailFooter 
        isRunning={isRunning}
        isSyncing={isSyncing}
        isTestSuccessful={isTestSuccessful}
        onRun={onRun}
        onSync={onSync}
      />
    </div>
  );
};
