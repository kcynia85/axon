"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Library, Search, ArrowRight, X, LucideIcon } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { cn } from "@/shared/lib/utils";

export type StudioArchetype = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string | LucideIcon;
  config: any;
};

type StudioDiscoveryProps = {
  title: string;
  emptyLabel: string;
  emptySublabel: string;
  libraryLabel: string;
  librarySublabel: string;
  archetypes: StudioArchetype[];
  categories: string[];
  onSelectEmpty: () => void;
  onSelectArchetype: (archetype: StudioArchetype) => void;
  onExit: () => void;
  renderIcon: (iconName: string | LucideIcon, size?: number, className?: string) => React.ReactNode;
};

/**
 * StudioDiscovery: Generic Split-Screen entry point for all Studio editors.
 */
export const StudioDiscovery = ({
  title,
  emptyLabel,
  emptySublabel,
  libraryLabel,
  librarySublabel,
  archetypes,
  categories,
  onSelectEmpty,
  onSelectArchetype,
  onExit,
  renderIcon
}: StudioDiscoveryProps) => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArchetypes = archetypes.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedArchetypes = activeCategory === "All" 
    ? filteredArchetypes 
    : filteredArchetypes.filter(a => a.category === activeCategory);

  const allCategories = ["All", ...categories];

  return (
    <div className="fixed inset-0 z-[200] bg-black flex overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {!showLibrary ? (
          <motion.div 
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full h-full"
          >
            {/* EXIT BUTTON */}
            <button 
              onClick={onExit}
              className="absolute top-8 left-8 z-50 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* LEFT: EMPTY BLUEPRINT */}
            <div 
              onClick={onSelectEmpty}
              className="group relative flex-1 border-r border-zinc-900 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-950 transition-all duration-700"
            >
              <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative z-10 space-y-8 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all duration-500 mx-auto">
                   <Plus className="w-10 h-10 text-zinc-500 group-hover:text-primary transition-colors" />
                </div>
                <div className="space-y-2">
                   <h2 className="text-4xl font-black font-display uppercase tracking-tighter">{emptyLabel}</h2>
                   <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">{emptySublabel}</p>
                </div>
              </div>
            </div>

            {/* RIGHT: ARCHETYPE LIBRARY */}
            <div 
              onClick={() => setShowLibrary(true)}
              className="group relative flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-950 transition-all duration-700"
            >
              <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="relative z-10 space-y-8 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-zinc-800 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all duration-500 mx-auto">
                   <Library className="w-10 h-10 text-zinc-500 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                   <h2 className="text-4xl font-black font-display uppercase tracking-tighter">{libraryLabel}</h2>
                   <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">{librarySublabel}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="library"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="absolute inset-0 bg-black flex flex-col"
          >
            {/* HEADER */}
            <header className="h-24 border-b border-zinc-900 flex items-center justify-between px-12 shrink-0">
               <div className="flex items-center gap-8">
                  <button 
                    onClick={() => setShowLibrary(false)}
                    className="text-zinc-500 hover:text-white flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest group"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Wróć
                  </button>
                  <h3 className="text-2xl font-black font-display uppercase italic tracking-tighter">{title}</h3>
               </div>

               <div className="flex items-center gap-4 w-96 relative">
                  <Search className="absolute left-4 w-4 h-4 text-zinc-600" />
                  <Input 
                    placeholder="Search..." 
                    className="bg-zinc-900/50 border-zinc-800 h-12 pl-12 rounded-full focus:border-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
            </header>

            {/* CONTENT */}
            <main className="flex-1 flex overflow-hidden">
               {/* SIDEBAR CATEGORIES */}
               <aside className="w-64 border-r border-zinc-900 p-8 space-y-8">
                  <div className="space-y-4">
                     <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Category</p>
                     <nav className="space-y-2">
                        {allCategories.map(cat => (
                          <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                              "block w-full text-left px-4 py-2 rounded-lg text-sm transition-all",
                              activeCategory === cat ? "bg-white text-black font-bold" : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                     </nav>
                  </div>
               </aside>

               {/* GRID */}
               <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {displayedArchetypes.map((archetype) => (
                       <motion.div 
                         layoutId={archetype.id}
                         key={archetype.id}
                         onClick={() => onSelectArchetype(archetype)}
                         className="group bg-zinc-900/20 border border-zinc-900 p-8 rounded-[2rem] hover:border-blue-500/50 hover:bg-zinc-900/40 transition-all cursor-pointer flex flex-col justify-between h-[300px] relative overflow-hidden"
                       >
                         {/* ICON BG DECOR */}
                         <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            {renderIcon(archetype.icon, 160)}
                         </div>

                         <div className="space-y-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-blue-500 group-hover:scale-110 transition-all">
                               {renderIcon(archetype.icon, 24, "text-blue-500")}
                            </div>
                            <div className="space-y-1">
                               <h4 className="text-xl font-bold font-display uppercase tracking-tight">{archetype.name}</h4>
                               <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 group-hover:text-zinc-300 transition-colors">
                                 {archetype.description}
                               </p>
                            </div>
                         </div>

                         <div className="flex items-center justify-between relative z-10">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-500/50">{archetype.category}</span>
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                               <ArrowRight size={20} />
                            </div>
                         </div>
                       </motion.div>
                     ))}
                  </div>

                  {displayedArchetypes.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                       <Search className="w-12 h-12 opacity-20" />
                       <p className="font-mono text-[10px] uppercase tracking-widest">No results found matching your criteria</p>
                    </div>
                  )}
               </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
