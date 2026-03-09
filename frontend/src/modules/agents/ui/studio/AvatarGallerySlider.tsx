"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

const AVATARS = [
  { id: 1, url: "/images/avatars/agent-1.png" },
  { id: 2, url: "/images/avatars/agent-2.png" },
  { id: 3, url: "/images/avatars/agent-3.png" },
  { id: 4, url: "/images/avatars/agent-4.png" },
  { id: 5, url: "/images/avatars/agent-5.png" },
];

type AvatarGallerySliderProps = {
  value?: string | null;
  onChange: (url: string) => void;
};

export const AvatarGallerySlider = ({ value, onChange }: AvatarGallerySliderProps) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-8">
      <div className="flex gap-8 px-2">
        {AVATARS.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => onChange(avatar.url)}
            className={cn(
              "relative flex-shrink-0 w-48 aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 border-2",
              value === avatar.url 
                ? "border-primary scale-105 shadow-[0_0_40px_rgba(var(--primary),0.3)]" 
                : "border-zinc-800 grayscale hover:grayscale-0 hover:border-zinc-600 opacity-40 hover:opacity-100"
            )}
          >
            <img 
              src={avatar.url} 
              alt={`Agent Archetype ${avatar.id}`} 
              className="w-full h-full object-cover"
            />
            {value === avatar.url && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  Selected
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="flex-shrink-0 w-48 aspect-square rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 hover:border-zinc-600 transition-all cursor-pointer">
           <span className="text-2xl">+</span>
           <span className="text-[10px] font-mono uppercase tracking-widest">Custom</span>
        </div>
      </div>
    </div>
  );
};
