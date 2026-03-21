import React from "react";
import { Button } from "@heroui/react";
import { Play, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolDetailFooterProps } from "../types/tool-detail.types";

export const ToolDetailFooter = ({
  isRunning,
  isSyncing,
  isTestSuccessful,
  onRun,
  onSync,
}: ToolDetailFooterProps) => (
  <footer className="h-20 border-t border-zinc-800/50 flex px-8 justify-end bg-[#000000] z-20 items-center shrink-0">
    <div className="flex items-center gap-4">
      <Button
        variant="light"
        onPress={onSync}
        isDisabled={!isTestSuccessful || isSyncing}
        startContent={
          isSyncing ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : isTestSuccessful ? (
            <CheckCircle2 size={16} />
          ) : (
            <RefreshCw size={16} />
          )
        }
        className={cn(
          "flex hover:bg-zinc-900 h-11 font-mono text-base tracking-widest px-6 transition-all rounded-lg",
          isTestSuccessful 
            ? "text-zinc-300 hover:text-white bg-zinc-900/50 border border-zinc-800" 
            : "text-zinc-500 hover:text-white"
        )}
      >
        Deploy Source
      </Button>
      <Button
        onPress={onRun}
        isLoading={isRunning}
        startContent={!isRunning && <Play size={16} />}
        className="bg-zinc-900 flex items-center text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-bold rounded-lg shadow-sm gap-2 h-11 px-6 text-base transition-all"
      >
        Execute Test
      </Button>
    </div>
  </footer>
);

