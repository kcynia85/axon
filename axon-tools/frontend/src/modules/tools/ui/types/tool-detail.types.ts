import type { Tool, ToolRunResult } from "../../domain/tool.types";

export type ToolDetailViewProps = {
  readonly tool: Tool;
  readonly parameters: Readonly<Record<string, string>>;
  readonly result: ToolRunResult | null;
  readonly isRunning: boolean;
  readonly isSyncing: boolean;
  readonly isTestSuccessful: boolean;
  readonly onBack: () => void;
  readonly onParameterChange: (key: string, value: string) => void;
  readonly onStatusChange: (status: string) => void;
  readonly onRun: () => void;
  readonly onSync: () => void;
};

export type ToolDetailHeaderProps = {
  readonly tool: Tool;
  readonly onBack: () => void;
  readonly onStatusChange: (status: string) => void;
};

export type ToolDetailFooterProps = {
  readonly isRunning: boolean;
  readonly isSyncing: boolean;
  readonly isTestSuccessful: boolean;
  readonly onRun: () => void;
  readonly onSync: () => void;
};

export type ToolDetailParametersProps = {
  readonly tool: Tool;
  readonly parameters: Readonly<Record<string, string>>;
  readonly onParameterChange: (key: string, value: string) => void;
};

export type ToolDetailConsoleProps = {
  readonly result: ToolRunResult | null;
};
