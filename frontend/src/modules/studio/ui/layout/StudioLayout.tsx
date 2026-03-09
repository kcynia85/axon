"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

type StudioLayoutProps = {
  navigator: React.ReactNode;
  canvas: React.ReactNode;
  poster: React.ReactNode;
  footer: React.ReactNode;
  exitButton: React.ReactNode;
  canvasRef?: React.RefObject<HTMLDivElement>;
  className?: string;
};

/**
 * StudioLayout: The foundational 3-column architecture for all Studio editors.
 * [ Navigator (280px) | Canvas (Flexible) | Poster (400px) ]
 */
export const StudioLayout = ({
  navigator,
  canvas,
  poster,
  footer,
  exitButton,
  canvasRef,
  className
}: StudioLayoutProps) => {
  return (
    <div className={cn("h-screen w-screen bg-black text-white selection:bg-primary selection:text-black overflow-hidden flex flex-col font-sans relative", className)}>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden grid grid-cols-[280px_1fr_400px] gap-0">
        
        {/* LEFT: NAVIGATOR */}
        <aside className="h-full border-r border-zinc-900 bg-black overflow-y-auto custom-scrollbar scroll-smooth p-8 pt-8 flex flex-col justify-between">
          <div className="space-y-12">
            {/* EXIT STUDIO OVER NAVIGATOR */}
            <div className="mb-12">
               {exitButton}
            </div>
            {navigator}
          </div>
        </aside>

        {/* CENTER: CANVAS (FORM) */}
        <div ref={canvasRef} className="h-full overflow-y-auto custom-scrollbar scroll-smooth bg-zinc-950/10">
           {canvas}
        </div>

        {/* RIGHT: POSTER (PREVIEW) */}
        <aside className="h-full border-l border-zinc-900 bg-zinc-950/20 overflow-y-auto custom-scrollbar p-8 flex justify-center">
           <div className="w-full flex justify-center">
              {poster}
           </div>
        </aside>
      </main>

      {/* STICKY FOOTER ACTION BAR */}
      <footer className="fixed bottom-0 inset-x-0 h-20 border-t border-zinc-900 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-end px-8 shrink-0">
        {footer}
      </footer>
    </div>
  );
};
