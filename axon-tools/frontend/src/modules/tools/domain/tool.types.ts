export type Tool = {
  readonly name: string;
  readonly description: string;
  readonly args_schema: any;
  readonly function_name: string;
  readonly file_path: string;
  readonly module_name: string;
  readonly keywords?: readonly string[];
  readonly status: string;
};

export type ToolRunResult = {
  readonly result?: any;
  readonly error?: string;
  readonly logs?: string;
  readonly execution_time_ms?: number;
};
