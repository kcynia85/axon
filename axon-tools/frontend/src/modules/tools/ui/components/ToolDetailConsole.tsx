import React from "react";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolDetailConsoleProps } from "../types/tool-detail.types";

export const ToolDetailConsole = ({ result }: ToolDetailConsoleProps) => (
  <div className="flex-1 bg-[#000000] flex flex-col font-mono relative overflow-hidden group/console">
    <div className="flex items-center justify-between px-8 py-4 bg-[#000000] border-b border-zinc-800/50 shrink-0 z-10">
      <div className="flex items-center gap-3 text-zinc-400">
        <Terminal size={16} />
        <h3 className="text-xs font-medium uppercase tracking-wider">Console Output</h3>
      </div>
      {result && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              result.error ? "bg-red-500" : "bg-green-500"
            )} />
            <span className={cn(
              "text-xs font-bold",
              result.error ? "text-red-500" : "text-green-500"
            )}>{result.error ? "Failed" : "Success"}</span>
          </div>
          <div className="h-3 w-[1px] bg-zinc-800" />
          <div className="text-xs font-medium text-zinc-500">
            Latency: <span className={cn(
              result.execution_time_ms ? (result.execution_time_ms > 1000 ? "text-yellow-500" : "text-green-500") : "text-zinc-500"
            )}>{result.execution_time_ms ?? "—"}ms</span>
          </div>
        </div>
      )}
    </div>
    
    <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-zinc-950/50">
      {!result && (
        <div className="h-full flex flex-col items-center justify-center text-zinc-800 gap-4">
          <Terminal size={48} strokeWidth={1} />
          <p className="text-sm font-medium">Awaiting execution...</p>
        </div>
      )}
      
      {result && (
        <>
          {result.error && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-md">Error</span>
              </div>
              <pre className="text-red-400 text-sm leading-relaxed p-6 bg-red-500/5 rounded-2xl border border-red-500/20 overflow-x-auto font-medium">
                {result.error}
              </pre>
            </div>
          )}
          
          {result.logs && (
            <div>
              <div className="flex items-center gap-3 mb-4 text-zinc-500">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 border border-zinc-800 rounded-md">Logs</span>
              </div>
              <pre className="text-zinc-400 text-sm leading-relaxed p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-x-auto font-medium">
                {result.logs}
              </pre>
            </div>
          )}

          {!result.error && result.result !== undefined && (
            <div>
              <div className="flex items-center gap-3 mb-4 text-green-500/80">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md">Result</span>
              </div>
              <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/20 overflow-x-auto">
                <pre className="text-green-400 text-sm font-medium">
                  {typeof result.result === "object" ? JSON.stringify(result.result, null, 2) : String(result.result)}
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
