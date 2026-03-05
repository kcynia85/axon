"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import type { QuickAccessGridProps } from "@/shared/lib/types/quick-access-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ children, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Funkcja sprawdzająca czy pokazać strzałki i efekt przeźroczystości
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Zmniejszamy margines do 5px dla większej czułości przy 4 elementach
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    // Sprawdzamy kilka razy po wyrenderowaniu
    const timers = [
      setTimeout(checkScroll, 100),
      setTimeout(checkScroll, 500),
      setTimeout(checkScroll, 1000)
    ];
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      timers.forEach(clearTimeout);
    };
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const childrenCount = React.Children.count(children);
  const isCarousel = childrenCount > 3;

  return (
    <div className={cn("relative group/carousel w-full", className)}>
      {/* Container przewijany */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={cn(
          "flex gap-3 pb-4 pt-1 px-1 scroll-smooth",
          isCarousel ? "overflow-x-auto scrollbar-none" : "overflow-x-hidden",
          // Efekt maski/przezroczystości
          showRight && !showLeft && "[mask-image:linear-gradient(to_right,black_80%,transparent_100%)]",
          showLeft && !showRight && "[mask-image:linear-gradient(to_left,black_80%,transparent_100%)]",
          showLeft && showRight && "[mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]"
        )}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child) => (
          <div 
            className={cn(
              "flex-none",
              isCarousel 
                ? "w-[85%] sm:w-[48%] md:w-[31%] lg:w-[28%]" 
                : "w-full sm:w-[calc(50%-6px)] md:w-[calc(33.33%-8px)]"
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Nawigacja - Lewo */}
      <AnimatePresence>
        {showLeft && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => scroll("left")}
            className="absolute -left-4 top-[calc(50%-8px)] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center justify-center text-zinc-500 hover:text-primary transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Nawigacja - Prawo */}
      <AnimatePresence>
        {showRight && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => scroll("right")}
            className="absolute -right-4 top-[calc(50%-8px)] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center justify-center text-zinc-500 hover:text-primary transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
