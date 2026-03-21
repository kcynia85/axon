import React from "react";
import { 
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ToolDetailHeaderProps } from "../types/tool-detail.types";

const STATUS_LIST = [
  { key: "draft", label: "In Draft" },
  { key: "in_progress", label: "In Progress" },
  { key: "production", label: "Production" },
];

export const ToolDetailHeader = ({
  tool,
  onBack,
  onStatusChange,
}: ToolDetailHeaderProps) => (
  <header className="h-20 border-b border-zinc-800/50 flex px-8 justify-between bg-[#000000] z-20 items-center">
    <div className="flex items-center gap-6">
      <Button 
        variant="light"
        onPress={onBack}
        className="h-8 flex items-center rounded-md gap-1.5 px-3 hover:bg-zinc-900 text-zinc-400 hover:text-white font-mono text-[10px] uppercase tracking-[0.2em] border border-zinc-800 hover:border-zinc-700 transition-all min-w-0"
        size="sm"
      >
        <ArrowLeft size={14} /> Back
      </Button>
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-xl tracking-tight text-white leading-none">{tool.function_name}</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-zinc-500 bg-zinc-900/50 px-2.5 py-0.5 rounded-full border border-zinc-800">
            {tool.module_name}
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <Dropdown>
        <DropdownTrigger>
          <Button 
            variant="flat" 
            size="sm"
            className="flex font-mono font-bold uppercase tracking-[0.2em] text-[14px] px-4 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all"
            endContent={<ChevronDown size={14} />}
          >
            Status: {tool.status}
          </Button>
        </DropdownTrigger>

        <DropdownMenu 
          aria-label="Change Tool Status"
          onAction={(key) => onStatusChange(String(key))}
          className="bg-zinc-950 border border-zinc-800 rounded-xl"
        >
          {STATUS_LIST.map((status) => (
            <DropdownItem 
              key={status.key}
              className={cn(
                "text-[14px] font-bold uppercase tracking-widest p-2 px-4 rounded-lg",
                tool.status === status.key ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"
              )}
            >
              {status.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  </header>
);

