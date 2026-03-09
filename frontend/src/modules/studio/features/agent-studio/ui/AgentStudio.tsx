"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAgentStudio } from "../application/useAgentStudio";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/shared/ui/ui/Form";
import { Button } from "@/shared/ui/ui/Button";
import { X, Plus, Trash2, Database, Code, Globe, Shield, Zap, Info, Library as LibraryIcon, Search, ChevronDown, Clock, Check } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Slider } from "@/shared/ui/ui/Slider";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import { cn } from "@/shared/lib/utils";
import { useWatch, useFieldArray } from "react-hook-form";
import { Input } from "@/shared/ui/ui/Input";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/shared/ui/ui/DropdownMenu";

// STUDIO MODULE IMPORTS
import { StudioLayout } from "@/modules/studio/ui/layout/StudioLayout";
import { StudioDiscovery, StudioArchetype } from "@/modules/studio/ui/components/StudioDiscovery";
import { StudioSection, BorderlessInput, BorderlessTextarea } from "@/modules/studio/ui/components/StudioPrimitives";

// AGENT SPECIFIC COMPONENTS
import { LivePoster } from "./LivePoster";
import { AvatarGallerySlider } from "./AvatarGallerySlider";
import { ARCHETYPES } from "@/modules/agents/domain/archetypes";

const ALL_MODELS = [
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", cost: "High" },
    { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", cost: "Low" },
    { id: "gpt-4o", name: "GPT-4o", cost: "Mid" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", cost: "High" },
    { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", cost: "Mid" },
    { id: "claude-3-opus", name: "Claude 3 Opus", cost: "High" },
];

const ALL_HUBS = [
    { id: "hub-1", name: "Internal Wiki", type: "Project Docs", index: "vector-index-titan-v2" },
    { id: "hub-2", name: "Product Specs", type: "Technical", index: "vector-index-specs-v1" },
    { id: "hub-3", name: "Customer Feedback", type: "Research", index: "vector-index-feedback" },
    { id: "hub-4", name: "Market Reports", type: "Research", index: "vector-index-market" },
];

export const AgentStudio = () => {
  const {
    form,
    isCreating,
    handleExit,
    handleSubmit,
    syncDraft
  } = useAgentStudio();

  const [step, setStep] = useState<"discovery" | "design">("discovery");
  const [activeSection, setActiveSection] = useState("IDENTITY");
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef("IDENTITY");
  const isScrollingByClick = useRef(false);
  
  // Keyword Input State
  const [keywordInput, setKeywordInput] = useState("");
  const [instructionInput, setInstructionInput] = useState("");
  const [constraintInput, setConstraintInput] = useState("");
  const [contextInput, setContextInput] = useState("");
  const [artefactInput, setArtefactInput] = useState("");

  // Model Selector State
  const [modelSearch, setModelSearch] = useState("");
  const [recentlySelected, setRecentlySelected] = useState<string[]>(["gemini-2.0-flash", "gpt-4o"]);

  // Hub Selector State
  const [hubSearch, setHubSearch] = useState("");
  const [recentlySelectedHubs, setRecentlySelectedHubs] = useState<string[]>(["hub-1"]);

  // Field arrays
  const { fields: instructions, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "guardrails.instructions" as any
  });

  const { fields: constraints, append: appendConstraint, remove: removeConstraint } = useFieldArray({
    control: form.control,
    name: "guardrails.constraints" as any
  });

  const { fields: contextItems, append: appendContext, remove: removeContext } = useFieldArray({
    control: form.control,
    name: "data_interface.context" as any
  });

  const { fields: artefactItems, append: appendArtefact, remove: removeArtefact } = useFieldArray({
    control: form.control,
    name: "data_interface.artefacts" as any
  });

  // Watch specific values
  const agent_name = useWatch({ control: form.control, name: "agent_name" });
  const agent_role_text = useWatch({ control: form.control, name: "agent_role_text" });
  const agent_goal = useWatch({ control: form.control, name: "agent_goal" });
  const agent_visual_url = useWatch({ control: form.control, name: "agent_visual_url" });
  const agent_keywords = useWatch({ control: form.control, name: "agent_keywords" });
  const reflexion = useWatch({ control: form.control, name: "reflexion" });
  const grounded_mode = useWatch({ control: form.control, name: "grounded_mode" });
  const rag_enforcement = useWatch({ control: form.control, name: "rag_enforcement" });
  const native_skills = useWatch({ control: form.control, name: "native_skills" });
  const custom_functions = useWatch({ control: form.control, name: "custom_functions" });
  const data_interface = useWatch({ control: form.control, name: "data_interface" });
  const temperature = useWatch({ control: form.control, name: "temperature" }) ?? 0.7;
  const currentModelId = useWatch({ control: form.control, name: "llm_model_id" });
  const knowledge_hub_ids = useWatch({ control: form.control, name: "knowledge_hub_ids" }) || [];
  const availability_workspace = useWatch({ control: form.control, name: "availability_workspace" }) || [];

  const watchedValues = useMemo(() => ({
      agent_name,
      agent_role_text,
      agent_goal,
      agent_visual_url,
      agent_keywords,
      reflexion,
      grounded_mode,
      rag_enforcement,
      native_skills,
      custom_functions,
      data_interface,
      temperature,
      llm_model_id: currentModelId,
      knowledge_hub_ids,
      availability_workspace
  }), [
      agent_name, 
      agent_role_text, 
      agent_goal, 
      agent_visual_url, 
      agent_keywords, 
      reflexion, 
      grounded_mode, 
      rag_enforcement, 
      native_skills, 
      custom_functions, 
      data_interface, 
      temperature, 
      currentModelId, 
      knowledge_hub_ids,
      availability_workspace
  ]);

  const agentName = agent_name || "Untitled Agent";

  // Stabilize Slider value
  const temperatureArray = useMemo(() => [temperature], [temperature]);

  const handleTemperatureChange = useCallback((v: number[]) => {
      const newVal = v[0];
      if (newVal !== temperature) {
          form.setValue("temperature", newVal);
          syncDraft();
      }
  }, [temperature, form, syncDraft]);

  // Keyword Handlers
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newKeyword = keywordInput.trim();
      if (newKeyword) {
         const currentKeywords = form.getValues("agent_keywords") || [];
         if (!currentKeywords.includes(newKeyword)) {
             form.setValue("agent_keywords", [...currentKeywords, newKeyword] as any);
             syncDraft();
         }
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
      const currentKeywords = form.getValues("agent_keywords") || [];
      form.setValue("agent_keywords", currentKeywords.filter((k: string) => k !== keywordToRemove) as any);
      syncDraft();
  };

  const handleAddInstruction = () => {
    const val = instructionInput.trim();
    if (val) {
      appendInstruction(val as any);
      setInstructionInput("");
      syncDraft();
    }
  };

  const handleAddConstraint = () => {
    const val = constraintInput.trim();
    if (val) {
      appendConstraint(val as any);
      setConstraintInput("");
      syncDraft();
    }
  };

  const handleAddContext = () => {
    const val = contextInput.trim();
    if (val) {
      appendContext({ name: val, field_type: "string", is_required: true } as any);
      setContextInput("");
      syncDraft();
    }
  };

  const handleAddArtefact = () => {
    const val = artefactInput.trim();
    if (val) {
      appendArtefact({ name: val, field_type: "file", is_required: true } as any);
      setArtefactInput("");
      syncDraft();
    }
  };

  const handleModelSelect = (id: string) => {
    form.setValue("llm_model_id", id);
    setRecentlySelected(prev => {
        const next = [id, ...prev.filter(p => p !== id)].slice(0, 3);
        return next;
    });
    syncDraft();
  };

  const handleHubToggle = (id: string) => {
    const currentHubs = form.getValues("knowledge_hub_ids") || [];
    const nextHubs = currentHubs.includes(id) 
        ? currentHubs.filter((h: string) => h !== id)
        : [...currentHubs, id];
    
    form.setValue("knowledge_hub_ids", nextHubs as any);
    
    if (nextHubs.includes(id)) {
        setRecentlySelectedHubs(prev => {
            const next = [id, ...prev.filter(p => p !== id)].slice(0, 3);
            return next;
        });
    }
    syncDraft();
  };

  // Section Progress Logic
  const getProgress = (id: string) => {
    switch (id) {
      case "IDENTITY":
        const nameVal = form.getValues("agent_name");
        const roleVal = form.getValues("agent_role_text");
        const goalVal = form.getValues("agent_goal");
        const backVal = form.getValues("agent_backstory");
        const keysVal = form.getValues("agent_keywords");
        const idFields = [nameVal, roleVal, goalVal, backVal, (keysVal?.length || 0) > 0];
        return { current: idFields.filter(Boolean).length, total: 5 };
      case "MEMORY":
        const hubVal = form.getValues("knowledge_hub_ids");
        const instVal = form.getValues("guardrails.instructions");
        const fewVal = form.getValues("few_shot_examples");
        const refVal = form.getValues("reflexion");
        const memFields = [
          (hubVal?.length || 0) > 0, 
          (instVal?.length || 0) > 0,
          (fewVal?.length || 0) > 0,
          refVal
        ];
        return { current: memFields.filter(Boolean).length, total: 4 };
      case "ENGINE":
        const engineFields = [
          form.getValues("llm_model_id")
        ];
        return { current: engineFields.filter(Boolean).length, total: 1 };
      case "SKILLS":
        const nativeVal = form.getValues("native_skills");
        const skillsFields = [
          (nativeVal?.length || 0) > 0
        ];
        return { current: skillsFields.filter(Boolean).length, total: 1 };
      case "INTERFACE":
        const ctxVal = form.getValues("data_interface.context");
        const artVal = form.getValues("data_interface.artefacts");
        const intFields = [(ctxVal?.length || 0) > 0, (artVal?.length || 0) > 0];
        return { current: intFields.filter(Boolean).length, total: 2 };
      case "AVAILABILITY":
        const availVal = form.getValues("availability_workspace");
        return { current: (availVal?.length || 0) > 0 ? 1 : 0, total: 1 };
      default:
        return { current: 0, total: 0 };
    }
  };

  const sections = [
    { id: "IDENTITY", title: "Identity", number: 1 },
    { id: "MEMORY", title: "Cognition", number: 2 },
    { id: "ENGINE", title: "Engine", number: 3 },
    { id: "SKILLS", title: "Skills", number: 4 },
    { id: "INTERFACE", title: "Interface", number: 5 },
    { id: "AVAILABILITY", title: "Availability", number: 6 },
  ];

  const handleSelectEmpty = () => {
    setStep("design");
  };

  const handleSelectArchetype = (archetype: StudioArchetype) => {
    // Reset form with archetype config
    Object.entries(archetype.config).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });
    setStep("design");
    syncDraft();
  };

  // Smooth Scroll Helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      isScrollingByClick.current = true;
      activeSectionRef.current = id;
      setActiveSection(id);
      
      const container = canvasScrollRef.current;
      if (container) {
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const scrollTop = container.scrollTop + (elRect.top - containerRect.top) - 40;
          
          container.scrollTo({
              top: scrollTop,
              behavior: "smooth"
          });
          
          setTimeout(() => {
              isScrollingByClick.current = false;
          }, 800);
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        syncDraft();
      }
      if (e.key === "Escape") {
        if (step === "design") {
           setStep("discovery");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [syncDraft, step]);

  // Intersection Observer for Active Section
  useEffect(() => {
    if (step !== "design") return;
    const container = canvasScrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingByClick.current) return;
        
        let bestEntry = null;
        let maxRatio = 0;

        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio;
                bestEntry = entry;
            }
        });

        if (bestEntry) {
          const newId = (bestEntry as IntersectionObserverEntry).target.id;
          if (activeSectionRef.current !== newId) {
              activeSectionRef.current = newId;
              setActiveSection(newId);
          }
        }
      },
      { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 
        root: container,
        rootMargin: "-10% 0px -40% 0px" 
      }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [canvasScrollRef.current, step]);

  // Unified Control Style
  const checkboxClass = "w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-black transition-all shadow-none shrink-0 rounded-md pointer-events-none";

  const selectedModel = ALL_MODELS.find(m => m.id === currentModelId) || ALL_MODELS[0];
  const filteredModels = ALL_MODELS.filter(m => m.name.toLowerCase().includes(modelSearch.toLowerCase()));
  const recentModels = ALL_MODELS.filter(m => recentlySelected.includes(m.id));

  if (step === "discovery") {
    return (
      <StudioDiscovery
        title="Agent Studio"
        emptyLabel="Start Blank"
        emptySublabel="Design your cognitive agent from the ground up"
        libraryLabel="Browse Library"
        librarySublabel="Import an existing agent from your organization"
        archetypes={ARCHETYPES}
        categories={["Product", "Technical", "Creative", "Research"]}
        onSelectEmpty={handleSelectEmpty}
        onSelectArchetype={handleSelectArchetype}
        onExit={handleExit}
        renderIcon={(IconName, size, className) => {
            const icons: Record<string, any> = { Shield, Code, Globe, Database, Zap, Search, Info };
            const Comp = typeof IconName === 'string' ? icons[IconName] : IconName;
            return Comp ? <Comp size={size} className={className} /> : null;
        }}
      />
    );
  }

  return (
    <StudioLayout
      canvasRef={canvasScrollRef}
      exitButton={
        <Button variant="ghost" size="sm" onClick={() => setStep("discovery")} className="hover:bg-zinc-900 gap-2 text-zinc-400 hover:text-white px-0 font-mono text-[10px] uppercase tracking-[0.2em]">
          <X className="w-4 h-4" /> Exit Studio
        </Button>
      }
      navigator={
        <nav aria-label="Navigator">
          <ul className="space-y-8">
            {sections.map((section) => {
              const { current, total } = getProgress(section.id);
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "group block w-full text-left space-y-2 transition-all outline-none",
                      isActive ? "opacity-100 scale-[1.02]" : "opacity-40 hover:opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn("font-mono text-[10px] font-bold tracking-tighter transition-colors", isActive ? "text-white" : "text-zinc-500")}>0{section.number}</span>
                      {total > 0 && (
                        <span className={cn("font-mono text-[8px] transition-colors", isActive ? "text-white/80" : "text-zinc-500")}>{current}/{total}</span>
                      )}
                    </div>
                    <div className={cn("text-sm font-bold uppercase tracking-[0.2em] transition-colors", isActive ? "text-white" : "text-zinc-400")}>{section.title}</div>
                    <div className="h-[2px] w-full bg-zinc-900 overflow-hidden rounded-full">
                      <div
                        className={cn("h-full transition-all duration-700 ease-out", isActive ? "bg-primary" : "bg-zinc-700")}
                        style={{ width: total > 0 ? `${(current / total) * 100}%` : '0%' }}
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-24 pb-24 pt-8 border-t border-zinc-900 shrink-0">
             <Button
               variant="ghost"
               className="w-full justify-start text-zinc-600 hover:text-white hover:bg-zinc-900 gap-4 group"
               onClick={() => setStep("discovery")}
             >
                <LibraryIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-mono tracking-widest text-zinc-500">Library</span>
             </Button>
          </div>
        </nav>
      }
      canvas={
        <div className="px-24 pb-48">

          <Form {...form}>
            <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
              <StudioSection id="IDENTITY" number={1} title="Identity">
                <div>
                  {/* VISUAL ARCHETYPE AT THE TOP */}
                  <div className="border-zinc-900">
            
                    <FormField
                      control={form.control}
                      name="agent_visual_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <AvatarGallerySlider 
                              value={field.value} 
                              onChange={(url) => {
                                field.onChange(url);
                                syncDraft();
                              }} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-12 pt-4">
                    <FormField
                      control={form.control}
                      name="agent_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-mono text-zinc-500 block h4">Agent Name</FormLabel>
                          <FormControl>
                            <BorderlessInput 
                              placeholder="Name your agent..." 
                              className="focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-colors"
                              {...field} 
                              value={field.value || ""}
                              onBlur={syncDraft}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agent_role_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-mono text-zinc-500 block h4">Role</FormLabel>
                          <FormControl>
                            <BorderlessInput 
                              placeholder="What is the role of this agent?" 
                              className="text-base text-zinc-300 focus:text-white transition-colors"
                              {...field} 
                              value={field.value || ""}
                              onBlur={syncDraft}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agent_goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-mono text-zinc-500 block h4">Goal</FormLabel>
                          <FormControl>
                            <BorderlessTextarea 
                              placeholder="What is the primary objective?" 
                              className="min-h-[120px] leading-relaxed text-zinc-300 focus:text-white transition-opacity"
                              {...field} 
                              value={field.value || ""}
                              onBlur={syncDraft}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agent_backstory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-mono text-zinc-500 block h4">Backstory</FormLabel>
                          <FormControl>
                            <BorderlessTextarea 
                              placeholder="Define the backstory and context of this cognitive entity..." 
                              className="min-h-[150px] leading-relaxed text-zinc-300 focus:text-white transition-opacity"
                              {...field} 
                              value={field.value || ""}
                              onBlur={syncDraft}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                          <FormLabel className="text-lg font-mono text-zinc-500 block h4">Keywords</FormLabel>
                       </div>
                       <div 
                         className="flex flex-wrap gap-3 p-5 min-h-[5rem] bg-zinc-50 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-zinc-200 transition-all cursor-text shadow-inner"
                         onClick={() => document.getElementById('agent-keyword-input')?.focus()}
                       >
                          {(watchedValues.agent_keywords || []).map((keyword: string) => (
                            <div key={keyword} className="relative group">
                               <Badge 
                                 variant="secondary"
                                 className="bg-white dark:bg-zinc-100 text-zinc-900 dark:text-zinc-900 px-5 py-2 text-[12px] font-black border border-zinc-200 dark:border-zinc-300 flex items-center gap-3 rounded-full shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-200 transition-all shrink-0 tracking-normal group/pill"
                               >
                                 #{keyword}
                                 <button 
                                   type="button"
                                   onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveKeyword(keyword);
                                   }}
                                   className="p-1 -mr-1 hover:bg-black hover:text-white rounded-full transition-all flex items-center justify-center group/x w-fit"
                                 >
                                   <X size={12} className="stroke-[3]" />
                                 </button>
                               </Badge>
                            </div>
                          ))}
                          <input 
                              id="agent-keyword-input"
                              placeholder={(watchedValues.agent_keywords || []).length === 0 ? "Add tags..." : ""}
                              value={keywordInput}
                              onChange={(e) => setKeywordInput(e.target.value)}
                              onKeyDown={handleKeywordKeyDown}
                              className="flex-1 min-w-[120px] bg-transparent border-none text-zinc-900 dark:text-white focus:ring-0 text-base font-bold p-0 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                              onBlur={() => {
                                  if (keywordInput.trim()) {
                                      const currentKeywords = form.getValues("agent_keywords") || [];
                                      if (!currentKeywords.includes(keywordInput.trim())) {
                                          form.setValue("agent_keywords", [...currentKeywords, keywordInput.trim()] as any);
                                          syncDraft();
                                      }
                                      setKeywordInput("");
                                  }
                              }}
                          />
                       </div>
                    </div>
                  </div>
                </div>
              </StudioSection>

              <StudioSection id="MEMORY" number={2} title="Cognition">
                <div className="space-y-12">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                       <h3 className="text-lg font-mono text-zinc-500">Knowledge Hubs (RAG)</h3>
                    </div>
                    
                    <div className="relative w-full max-w-2xl">
                        <DropdownMenu onOpenChange={(open) => !open && setHubSearch("")}>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:border-zinc-900 dark:hover:border-zinc-600 transition-all flex items-center justify-between group shadow-sm outline-none text-left">
                                    <div className="flex flex-wrap gap-2">
                                        {knowledge_hub_ids.length > 0 ? (
                                            knowledge_hub_ids.map((id: string) => {
                                                const hub = ALL_HUBS.find(h => h.id === id);
                                                return (
                                                    <Badge key={id} variant="secondary" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 py-1 px-3">
                                                        {hub?.name}
                                                        <X size={10} className="cursor-pointer hover:text-white" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleHubToggle(id);
                                                        }} />
                                                    </Badge>
                                                );
                                            })
                                        ) : (
                                            <span className="text-zinc-500 font-bold">Select Knowledge Sources...</span>
                                        )}
                                    </div>
                                    <ChevronDown className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0 ml-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-2xl z-[250]" align="start" sideOffset={8}>
                                <div className="p-2 relative flex items-center">
                                    <Search className="absolute left-5 w-4 h-4 text-zinc-500" />
                                    <input 
                                        autoFocus
                                        placeholder="Search hubs..."
                                        value={hubSearch}
                                        onChange={(e) => setHubSearch(e.target.value)}
                                        className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl h-12 pl-12 pr-4 text-sm font-bold text-zinc-900 dark:text-white focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                                    {recentlySelectedHubs.length > 0 && !hubSearch && (
                                        <>
                                            <DropdownMenuLabel className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                <Clock size={12} /> Recently Used
                                            </DropdownMenuLabel>
                                            {ALL_HUBS.filter(h => recentlySelectedHubs.includes(h.id)).map(hub => (
                                                <DropdownMenuItem 
                                                    key={`recent-${hub.id}`}
                                                    onClick={() => handleHubToggle(hub.id)}
                                                    className="px-4 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between group transition-colors"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{hub.name}</span>
                                                        <span className="text-[10px] text-zinc-500">{hub.type}</span>
                                                    </div>
                                                    {knowledge_hub_ids.includes(hub.id) && <Check className="w-4 h-4 text-primary" />}
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-2" />
                                        </>
                                    )}

                                    <DropdownMenuLabel className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                        Available Hubs
                                    </DropdownMenuLabel>
                                    {ALL_HUBS.filter(h => h.name.toLowerCase().includes(hubSearch.toLowerCase())).map(hub => (
                                        <DropdownMenuItem 
                                            key={hub.id}
                                            onClick={() => handleHubToggle(hub.id)}
                                            className="px-4 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between group transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{hub.name}</span>
                                                <span className="text-[10px] text-zinc-500">{hub.type}</span>
                                            </div>
                                            {knowledge_hub_ids.includes(hub.id) && <Check className="w-4 h-4 text-primary" />}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                       <h3 className="text-lg font-mono text-zinc-500">Guardrails</h3>
                    </div>
                    
                    <div className="space-y-16">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary opacity-70" />
                            <h4 className="text-base font-mono text-primary">Instructions</h4>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {instructions.map((field, index) => (
                            <div key={field.id} className="flex gap-2 group">
                              <Input 
                                {...form.register(`guardrails.instructions.${index}` as any)} 
                                placeholder="Operational guideline..."
                                className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-base h-14 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 px-6"
                                onBlur={syncDraft}
                              />
                              <Button variant="ghost" size="icon" onClick={() => removeInstruction(index)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-destructive hover:bg-destructive/10 shrink-0 transition-all h-14 w-14 rounded-xl border border-transparent hover:border-destructive/20">
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2 group">
                            <div className="relative flex-1">
                              <button 
                                type="button"
                                onClick={handleAddInstruction}
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors z-10 p-1"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                              <Input 
                                value={instructionInput}
                                onChange={(e) => setInstructionInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddInstruction();
                                  }
                                }}
                                placeholder="Add new instruction..."
                                className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-base h-14 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 pl-14 pr-6"
                              />
                            </div>
                            <div className="w-14" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-destructive opacity-70" />
                            <h4 className="text-base font-mono text-primary">Constraints</h4>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {constraints.map((field, index) => (
                            <div key={field.id} className="flex gap-2 group">
                              <Input 
                                {...form.register(`guardrails.constraints.${index}` as any)} 
                                placeholder="Hard limitation..."
                                className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-base h-14 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 px-6"
                                onBlur={syncDraft}
                              />
                              <Button variant="ghost" size="icon" onClick={() => removeConstraint(index)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-destructive hover:bg-destructive/10 shrink-0 transition-all h-14 w-14 rounded-xl border border-transparent hover:border-destructive/20">
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2 group">
                            <div className="relative flex-1">
                              <button 
                                type="button"
                                onClick={handleAddConstraint}
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors z-10 p-1"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                              <Input 
                                value={constraintInput}
                                onChange={(e) => setConstraintInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddConstraint();
                                  }
                                }}
                                placeholder="Add new constraint..."
                                className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-200 transition-all text-base h-14 rounded-xl outline-none shadow-inner text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 pl-14 pr-6"
                              />
                            </div>
                            <div className="w-14" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 pt-8">
                    <div className="grid grid-cols-1 gap-8">
                       <FormField
                          control={form.control}
                          name="few_shot_examples"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg font-mono text-zinc-500 mb-4 block h4">Strategia Formatowania (Few Shot)</FormLabel>
                              <FormControl>
                                <BorderlessTextarea 
                                  placeholder="Input examples of desired output format... (e.g. User: Hello -> Agent: Greetings!)" 
                                  className="min-h-[100px] leading-relaxed text-sm focus:placeholder:text-zinc-900 dark:focus:placeholder:text-white transition-opacity"
                                  {...field}
                                  value={Array.isArray(field.value) ? field.value.join('\n') : ""}
                                  onChange={(e) => field.onChange(e.target.value.split('\n'))}
                                  onBlur={syncDraft}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                       />

                       <FormField
                          control={form.control}
                          name="reflexion"
                          render={({ field }) => (
                              <div className={cn(
                                  "p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-6 group mt-0",
                                  field.value ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.05)]" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:border-zinc-900 dark:hover:border-zinc-600 shadow-sm"
                              )} onClick={() => {
                                  field.onChange(!field.value);
                                  syncDraft();
                              }}>
                                  <Checkbox checked={field.value} className={checkboxClass} />
                                  <div className="space-y-1">
                                      <h5 className="font-bold text-base text-zinc-900 dark:text-white">Reflexion Mode</h5>
                                      <p className="text-sm text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">Agent will self-correct before responding</p>
                                  </div>
                              </div>
                          )}
                       />
                    </div>
                  </div>
                </div>
              </StudioSection>

              <StudioSection id="ENGINE" number={3} title="Engine">
                <div className="space-y-12 relative overflow-hidden">
                  <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                        <h3 className="text-lg font-mono text-zinc-500">Model LLM</h3>
                        
                        <div className="relative w-full max-w-2xl">
                            <DropdownMenu onOpenChange={(open) => !open && setModelSearch("")}>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-full p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:border-zinc-900 dark:hover:border-zinc-600 transition-all flex items-center justify-between group shadow-sm outline-none text-left">
                                        <div className="flex items-center gap-6">
                                            <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary shrink-0 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-black" />
                                            </div>
                                            <span className="text-base font-bold text-zinc-900 dark:text-white">
                                                {selectedModel?.name}
                                            </span>
                                            <Badge variant="outline" className="text-[12px] border-zinc-200 dark:border-zinc-700 tracking-tighter text-zinc-500 shrink-0">{selectedModel?.cost} Cost</Badge>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0 ml-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-2xl z-[250]" align="start" sideOffset={8}>
                                    <div className="p-2 relative flex items-center">
                                        <Search className="absolute left-5 w-4 h-4 text-zinc-500" />
                                        <input 
                                            autoFocus
                                            placeholder="Search model..."
                                            value={modelSearch}
                                            onChange={(e) => setModelSearch(e.target.value)}
                                            className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl h-12 pl-12 pr-4 text-sm font-bold text-zinc-900 dark:text-white focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                                        {recentModels.length > 0 && !modelSearch && (
                                            <>
                                                <DropdownMenuLabel className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                                    <Clock size={12} /> Recently Selected
                                                </DropdownMenuLabel>
                                                {recentModels.map(model => (
                                                    <DropdownMenuItem 
                                                        key={`recent-${model.id}`}
                                                        onClick={() => handleModelSelect(model.id)}
                                                        className="px-4 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between group transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{model.name}</span>
                                                            <Badge variant="outline" className="text-[10px] border-zinc-200 dark:border-zinc-700 tracking-tighter text-zinc-500">{model.cost}</Badge>
                                                        </div>
                                                        {currentModelId === model.id && <Check className="w-4 h-4 text-primary" />}
                                                    </DropdownMenuItem>
                                                ))}
                                                <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-2" />
                                            </>
                                        )}

                                        <DropdownMenuLabel className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                                            All Models
                                        </DropdownMenuLabel>
                                        {filteredModels.map(model => (
                                            <DropdownMenuItem 
                                                key={model.id}
                                                onClick={() => handleModelSelect(model.id)}
                                                className="px-4 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between group transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">{model.name}</span>
                                                    <Badge variant="outline" className="text-[10px] border-zinc-200 dark:border-zinc-800 text-zinc-500">{model.cost}</Badge>
                                                </div>
                                                {currentModelId === model.id && <Check className="w-4 h-4 text-primary" />}
                                            </DropdownMenuItem>
                                        ))}
                                        {filteredModels.length === 0 && (
                                            <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                                                No models found
                                            </div>
                                        )}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="space-y-0 pt-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-mono text-zinc-500">Temperature</h3>
                            <div className="flex justify-center">
                                <span className="text-4xl font-black font-mono text-primary">{temperature}</span>
                            </div>
                        </div>
                        <div className="py-0">
                            <Slider 
                                min={0} 
                                max={1} 
                                step={0.01} 
                                value={temperatureArray} 
                                onValueChange={handleTemperatureChange} 
                                className="py-4 cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-between text-sm font-mono tracking-widest text-zinc-500 -mt-2">
                            <span>Deterministic</span>
                            <span>Creative</span>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                        {[
                            { name: "grounded_mode", title: "Grounded Mode", hint: "Strictly adhere to provided context sources" },
                            { name: "rag_enforcement", title: "RAG Enforcement", hint: "Force retrieval for every response" }
                        ].map((sw) => (
                            <FormField
                                key={sw.name}
                                control={form.control}
                                name={sw.name as any}
                                render={({ field }) => (
                                    <div className={cn(
                                        "p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-6 group shadow-sm",
                                        field.value ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.05)]" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 hover:border-zinc-900 dark:hover:border-zinc-600"
                                    )} onClick={() => {
                                        if (field.value !== undefined) {
                                           field.onChange(!field.value);
                                        } else {
                                           field.onChange(true);
                                        }
                                        setTimeout(() => syncDraft(), 0);
                              }}>
                                        <Checkbox checked={!!field.value} className={checkboxClass} />
                                        <div className="space-y-1">
                                            <h5 className="font-bold text-base text-zinc-900 dark:text-white">{sw.title}</h5>
                                            <p className="text-sm text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">{sw.hint}</p>
                                        </div>
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                  </div>
                </div>
              </StudioSection>

              <StudioSection id="SKILLS" number={4} title="Skills">
                <div className="space-y-12 relative overflow-hidden">
                  <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                       <h3 className="text-lg font-mono text-zinc-500">Native Skills</h3>
                       <div className="grid grid-cols-1 gap-4">
                          {[
                            { id: "web_search", name: "Web Search", icon: Globe },
                            { id: "code_interpreter", name: "Code Interpreter", icon: Code },
                            { id: "file_browser", name: "File Browser", icon: Database }
                          ].map(skill => (
                            <div
                              key={skill.id}
                              onClick={() => {
                                 const current = watchedValues.native_skills || [];
                                 const next = current.includes(skill.id) 
                                   ? current.filter(s => s !== skill.id)
                                   : [...current, skill.id];
                                 form.setValue("native_skills", next);
                                 syncDraft();
                              }}
                              className={cn(
                                "flex items-center gap-6 p-6 rounded-2xl border transition-all text-left shadow-sm cursor-pointer group",
                                watchedValues.native_skills?.includes(skill.id) 
                                  ? "border-primary bg-primary/5" 
                                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:border-zinc-600"
                              )}
                            >
                               <Checkbox checked={watchedValues.native_skills?.includes(skill.id)} className={checkboxClass} />
                               <div className="flex items-center gap-3">
                                 <skill.icon className="w-4 h-4 opacity-70" />
                                 <span className="text-base font-bold">{skill.name}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <h3 className="text-lg font-mono text-zinc-500">Custom Functions</h3>
                          <Badge variant="outline" className="text-[12px] border-zinc-200 dark:border-zinc-800 text-zinc-500 shadow-none">Internal</Badge>
                       </div>
                       <div className="space-y-3">
                          {[
                            { id: "lead_scoring", name: "lead_scoring", desc: "Oblicza potencjał leada..." },
                            { id: "validate_nip_pl", name: "validate_nip_pl", desc: "Sprawdza sumę kontrolną..." }
                          ].map(fn => (
                            <div key={fn.id} className="flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 group hover:border-zinc-900 dark:hover:border-zinc-700 transition-all cursor-pointer shadow-sm" onClick={() => {
                                const current = watchedValues.custom_functions || [];
                                const next = current.includes(fn.id) 
                                  ? current.filter((s: string) => s !== fn.id)
                                  : [...current, fn.id];
                                form.setValue("custom_functions" as any, next);
                                syncDraft();
                            }}>
                                <Checkbox checked={(watchedValues.custom_functions || []).includes(fn.id)} className={checkboxClass} />
                                <div className="space-y-1">
                                  <div className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-300">{fn.name}</div>
                                  <div className="text-sm text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">{fn.desc}</div>
                                </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </StudioSection>

              <StudioSection id="INTERFACE" number={5} title="Interface">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-0">
                       <div className="flex items-center gap-3">
                          <h3 className="text-lg font-mono text-zinc-500">Context</h3>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="grid grid-cols-[1fr_150px_100px_50px] gap-4 px-4 text-[12px] font-mono tracking-[0.2em] text-zinc-500">
                          <span>Parameter Name</span>
                          <span>Type</span>
                          <span className="text-center">Req.</span>
                          <span></span>
                       </div>
                       {contextItems.map((field, index) => (
                         <div key={field.id} className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner">
                            <Input 
                                {...form.register(`data_interface.context.${index}.name` as any)} 
                                placeholder="e.g. user_query" 
                                className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
                                onBlur={syncDraft}
                            />
                            <select 
                                {...form.register(`data_interface.context.${index}.field_type` as any)}
                                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] h-8 px-2 focus:border-zinc-900 dark:focus:border-zinc-200 outline-none transition-colors appearance-none font-mono text-zinc-900 dark:text-white shadow-sm"
                                onChange={() => syncDraft()}
                            >
                                <option value="string">STRING</option>
                                <option value="number">NUMBER</option>
                                <option value="boolean">BOOLEAN</option>
                                <option value="json">JSON</option>
                            </select>
                            <div 
                                className="flex justify-center cursor-pointer p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                onClick={() => {
                                    const current = watchedValues.data_interface?.context?.[index]?.is_required;
                                    form.setValue(`data_interface.context.${index}.is_required` as any, !current);
                                    syncDraft();
                                }}
                            >
                                <Checkbox 
                                    checked={watchedValues.data_interface?.context?.[index]?.is_required}
                                    className={checkboxClass}
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeContext(index)} className="text-zinc-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                       ))}
                       <div className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner">
                          <div className="relative">
                              <button 
                                type="button"
                                onClick={handleAddContext}
                                className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary transition-colors z-10 p-1"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <Input 
                                  value={contextInput}
                                  onChange={(e) => setContextInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddContext();
                                    }
                                  }}
                                  placeholder="Add parameter..." 
                                  className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 pl-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
                              />
                          </div>
                          <div />
                          <div />
                          <div />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    <div className="flex justify-between items-center pb-0">
                       <div className="flex items-center gap-3">
                          <h3 className="text-lg font-mono text-zinc-500">Artefacts</h3>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="grid grid-cols-[1fr_150px_100px_50px] gap-4 px-4 text-[12px] font-mono tracking-[0.2em] text-zinc-500">
                          <span>Artefact Name</span>
                          <span>Format</span>
                          <span className="text-center">Req.</span>
                          <span></span>
                       </div>
                       {artefactItems.map((field, index) => (
                         <div key={field.id} className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner">
                            <Input 
                                {...form.register(`data_interface.artefacts.${index}.name` as any)} 
                                placeholder="e.g. final_report" 
                                className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
                                onBlur={syncDraft}
                            />
                            <select 
                                {...form.register(`data_interface.artefacts.${index}.field_type` as any)}
                                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] h-8 px-2 focus:border-zinc-900 dark:focus:border-zinc-200 outline-none transition-colors appearance-none font-mono text-zinc-900 dark:text-white shadow-sm"
                                onChange={() => syncDraft()}
                            >
                                <option value="file">FILE</option>
                                <option value="markdown">MARKDOWN</option>
                                <option value="image">IMAGE</option>
                                <option value="json">STRUCTURED DATA</option>
                            </select>
                            <div 
                                className="flex justify-center cursor-pointer p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                onClick={() => {
                                    const current = watchedValues.data_interface?.artefacts?.[index]?.is_required;
                                    form.setValue(`data_interface.artefacts.${index}.is_required` as any, !current);
                                    syncDraft();
                                }}
                            >
                                <Checkbox 
                                    checked={watchedValues.data_interface?.artefacts?.[index]?.is_required}
                                    className={checkboxClass}
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeArtefact(index)} className="text-zinc-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                       ))}
                       <div className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-900 dark:hover:border-zinc-600 transition-all focus-within:border-zinc-900 dark:focus-within:border-zinc-200 shadow-inner">
                          <div className="relative">
                              <button 
                                type="button"
                                onClick={handleAddArtefact}
                                className="absolute left-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary transition-colors z-10 p-1"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <Input 
                                  value={artefactInput}
                                  onChange={(e) => setArtefactInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddArtefact();
                                    }
                                  }}
                                  placeholder="Add artefact..." 
                                  className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 pl-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-700 shadow-none outline-none text-zinc-900 dark:text-white"
                              />
                          </div>
                          <div />
                          <div />
                          <div />
                       </div>
                    </div>
                  </div>
                </div>
              </StudioSection>

              <StudioSection id="AVAILABILITY" number={6} title="Availability">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <h3 className="text-lg font-mono text-zinc-500">Deployment Scope</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {[
                         "Global Availability",
                         "Product Management",
                         "Discovery Hub",
                         "Design System",
                         "Delivery & CI/CD",
                         "Growth & Market"
                       ].map((space) => {
                         const currentWorkspace = availability_workspace || [];
                         const isGlobalSelected = currentWorkspace.includes("Global Availability");
                         const isSelected = currentWorkspace.includes(space);
                         
                         // Disable other options if Global is selected
                         const isDisabled = isGlobalSelected && space !== "Global Availability";

                         return (
                         <div 
                            key={space} 
                            className={cn(
                                "flex items-center gap-6 p-6 rounded-2xl transition-all shadow-sm border",
                                isDisabled ? "opacity-40 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900/10 border-zinc-100 dark:border-zinc-800/50" : "cursor-pointer",
                                !isDisabled && isSelected 
                                    ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--primary),0.05)]" 
                                    : !isDisabled ? "bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-600" : ""
                            )}
                            onClick={(e) => {
                                if (isDisabled) return; // Prevent clicks on disabled items

                                let next: string[] = [];
                                
                                if (space === "Global Availability") {
                                    // If toggling Global Availability, either set ONLY it or clear all
                                    next = isSelected ? [] : ["Global Availability"];
                                } else {
                                    // Normal toggling for other spaces
                                    next = isSelected
                                      ? currentWorkspace.filter((s: string) => s !== space)
                                      : [...currentWorkspace, space];
                                }
                                
                                form.setValue("availability_workspace" as any, next);
                                syncDraft();
                            }}
                         >
                            <Checkbox className={checkboxClass} checked={isSelected} disabled={isDisabled} />
                            <span className={cn(
                                "text-base font-bold transition-colors",
                                isSelected ? "text-primary" : "text-zinc-500",
                                !isDisabled && !isSelected ? "group-hover:text-zinc-900 dark:group-hover:text-white" : ""
                            )}>{space}</span>
                         </div>
                       )})}
                    </div>
                 </div>
              </StudioSection>
            </form>
          </Form>
        </div>
      }
      poster={<LivePoster data={watchedValues} />}
      footer={
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleExit} className="hover:bg-zinc-900 h-9 font-mono text-base tracking-widest px-6 text-zinc-500 hover:text-white transition-all">
            Anuluj
          </Button>
          <ActionButton label="Zapisz Agenta" onClick={form.handleSubmit(handleSubmit)} />
        </div>
      }
    />
  );
};
