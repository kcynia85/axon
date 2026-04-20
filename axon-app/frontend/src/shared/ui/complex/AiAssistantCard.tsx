"use client";

import React from "react";
import { 
  Image as ImageIcon, 
  Cpu, 
  Globe, 
  Mic
} from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";

type AiAssistantCardProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onKeyDown?: (e: React.KeyboardEvent) => void;
  readonly placeholder?: string;
  readonly children?: React.ReactNode;
};

export const AiAssistantCard = ({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  placeholder = "Ask AI anything... What do you want to accomplish today?",
  children
}: AiAssistantCardProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
        {/* Input Area */}
        <div className="p-5 pb-1 text-left">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={2}
            className="w-full bg-transparent border-none text-base font-medium focus:outline-none resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 min-h-[48px]"
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {/* Left side empty */}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <ImageIcon size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400">
              <Cpu size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400">
              <Globe size={18} />
            </Button>
            <Button 
              onClick={onSubmit}
              disabled={!value.trim()}
              size="icon" 
              className="h-10 w-10 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-black/10 transition-all active:scale-95 disabled:opacity-30"
            >
              <Mic size={20} />
            </Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
