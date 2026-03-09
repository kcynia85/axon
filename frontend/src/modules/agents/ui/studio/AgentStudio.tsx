"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAgentStudio } from "../../application/useAgentStudio";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/shared/ui/ui/Form";
import { StudioSection, BorderlessInput, BorderlessTextarea } from "./StudioComponents";
import { LivePoster } from "./LivePoster";
import { Button } from "@/shared/ui/ui/Button";
import { X, Plus, Trash2, Database, Code, Globe, Shield, Zap, Info } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Slider } from "@/shared/ui/ui/Slider";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import { cn } from "@/shared/lib/utils";
import { useWatch, useFieldArray } from "react-hook-form";
import { Input } from "@/shared/ui/ui/Input";
import { AvatarGallerySlider } from "./AvatarGallerySlider";

export const AgentStudio = () => {
  const {
    form,
    isCreating,
    handleExit,
    handleSubmit,
    syncDraft
  } = useAgentStudio();

  const [activeSection, setActiveSection] = useState("IDENTITY");
  const canvasScrollRef = useRef<HTMLDivElement>(null);

  // Field arrays for Guardrails and Data Interface
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
  const watchedValues = useWatch({ control: form.control });
  const agent_name = watchedValues.agent_name;
  const temperature = watchedValues.temperature || 0.7;

  const agentName = agent_name || "Untitled Agent";

  // Section Progress Logic
  const getProgress = (id: string) => {
    switch (id) {
      case "IDENTITY":
        const idFields = [watchedValues.agent_name, watchedValues.agent_role_text, watchedValues.agent_goal, watchedValues.agent_visual_url];
        return { current: idFields.filter(Boolean).length, total: 4 };
      case "MEMORY":
        const memFields = [(watchedValues.knowledge_hub_ids?.length || 0) > 0, (watchedValues.guardrails?.instructions?.length || 0) > 0];
        return { current: memFields.filter(Boolean).length, total: 2 };
      case "ENGINE":
        return { current: 1, total: 1 };
      case "INTERFACE":
        const intFields = [(watchedValues.data_interface?.context?.length || 0) > 0, (watchedValues.data_interface?.artefacts?.length || 0) > 0];
        return { current: intFields.filter(Boolean).length, total: 2 };
      default:
        return { current: 0, total: 0 };
    }
  };

  const sections = [
    { id: "IDENTITY", title: "Identity", number: 1 },
    { id: "MEMORY", title: "Cognition", number: 2 },
    { id: "ENGINE", title: "Engine", number: 3 },
    { id: "INTERFACE", title: "Interface", number: 4 },
    { id: "AVAILABILITY", title: "Availability", number: 5 },
  ];

  // Smooth Scroll Helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
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
        handleExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [syncDraft, handleExit]);

  // Intersection Observer for Active Section (relative to center scroll container)
  useEffect(() => {
    const container = canvasScrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: 0.2, 
        root: container,
        rootMargin: "0px 0px -50% 0px" 
      }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [canvasScrollRef.current]);

  return (
    <div className="h-screen w-screen bg-black text-white selection:bg-primary selection:text-black overflow-hidden flex flex-col font-sans">
      {/* Top Navigation - Fixed at top with high z-index */}
      <header className="fixed top-0 inset-x-0 h-20 border-b border-zinc-900 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" onClick={handleExit} className="hover:bg-zinc-900 gap-2 text-zinc-400 hover:text-white">
            <X className="w-4 h-4" /> Exit Studio
          </Button>
          <div className="h-6 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold truncate max-w-[200px]">{agentName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => syncDraft()} className="border-zinc-800 hover:bg-zinc-900 h-9">
            Save Draft
          </Button>
          <Button size="sm" onClick={form.handleSubmit(handleSubmit)} disabled={isCreating} className="px-8 h-9 bg-white text-black hover:bg-zinc-200 font-bold transition-all active:scale-95">
            {isCreating ? "Deploying..." : "Deploy Agent"}
          </Button>
        </div>
      </header>

      {/* Main Studio Area: Separated Scrollable Columns - Added mt-20 to clear fixed header */}
      <main className="flex-1 mt-20 overflow-hidden grid grid-cols-[280px_1fr_450px] gap-0">
        
        {/* Left: Navigator Sidebar */}
        <aside className="h-full border-r border-zinc-900 bg-black overflow-y-auto no-scrollbar scroll-smooth p-8">
          <nav aria-label="Navigator">
            <ul className="space-y-6">
              {sections.map((section) => {
                const { current, total } = getProgress(section.id);
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <button 
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "group block w-full text-left space-y-2 transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
                        isActive ? "opacity-100 scale-[1.02]" : "opacity-40 hover:opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold tracking-tighter">0{section.number}</span>
                        {total > 0 && (
                          <span className="font-mono text-[8px] opacity-50">{current}/{total}</span>
                        )}
                      </div>
                      <div className="text-sm font-bold uppercase tracking-[0.2em]">{section.title}</div>
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
          </nav>
        </aside>

        {/* Center: Canvas Column - Independent Scroll Container */}
        <div 
          ref={canvasScrollRef} 
          className="h-full overflow-y-auto px-24 py-12 pb-96 custom-scrollbar scroll-smooth bg-zinc-950/10"
        >
          <Form {...form}>
            <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
              {/* SECTION 1: IDENTITY */}
              <StudioSection id="IDENTITY" number={1} title="Identity">
                <div className="space-y-16">
                  <div className="space-y-12">
                    <FormField
                      control={form.control}
                      name="agent_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <BorderlessInput 
                              placeholder="NAME YOUR AGENT" 
                              className="text-6xl md:text-8xl focus:placeholder:opacity-0"
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
                          <FormControl>
                            <BorderlessInput 
                              placeholder="WHAT IS THE ROLE?" 
                              className="text-3xl md:text-4xl opacity-60 focus:opacity-100 transition-opacity"
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
                          <FormControl>
                            <BorderlessTextarea 
                              placeholder="Define the primary objective and backstory of this cognitive entity..." 
                              className="min-h-[150px] leading-loose italic opacity-40 focus:opacity-100 transition-opacity"
                              {...field} 
                              value={field.value || ""}
                              onBlur={syncDraft}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-8 pt-8 border-t border-zinc-900">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-mono uppercase tracking-widest opacity-30">Visual Archetype</span>
                       <div className="h-[1px] flex-1 bg-zinc-900" />
                    </div>
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
                </div>
              </StudioSection>

              {/* SECTION 2: COGNITION */}
              <StudioSection id="MEMORY" number={2} title="Cognition">
                <div className="grid grid-cols-1 gap-24">
                  <div className="space-y-12">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-mono uppercase tracking-widest opacity-30">Knowledge Hubs</span>
                       <div className="h-[1px] flex-1 bg-zinc-900" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div className="aspect-video rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:border-primary/50">
                          <Plus className="text-zinc-500 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">Attach Source</span>
                      </div>

                      {/* Mock Knowledge Tile */}
                      <div className="aspect-video rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 flex flex-col justify-between group hover:border-zinc-600 transition-all cursor-pointer">
                         <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                               <Database className="w-5 h-5 text-primary" />
                            </div>
                            <Badge variant="outline" className="text-[8px] border-zinc-700">Project Docs</Badge>
                         </div>
                         <div className="space-y-1">
                            <h5 className="font-bold text-sm uppercase tracking-wider">Internal Wiki</h5>
                            <p className="text-[10px] opacity-40 truncate">vector-index-titan-v2</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12 pt-8 border-t border-zinc-900">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-mono uppercase tracking-widest opacity-30">Operational Guardrails</span>
                       <div className="h-[1px] flex-1 bg-zinc-900" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-16">
                      {/* Instructions Array */}
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary opacity-50" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">Instructions</span>
                          </div>
                          <Button variant="ghost" size="xs" onClick={() => appendInstruction("")} className="h-6 text-[8px] hover:bg-zinc-900">
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {instructions.map((field, index) => (
                            <div key={field.id} className="flex gap-2 group">
                              <Input 
                                {...form.register(`guardrails.instructions.${index}` as any)} 
                                placeholder="Operational guideline..."
                                className="bg-zinc-900/30 border-zinc-800 focus:border-primary focus:bg-zinc-900 transition-all text-sm h-12 rounded-xl outline-none"
                                onBlur={syncDraft}
                              />
                              <Button variant="ghost" size="icon" onClick={() => removeInstruction(index)} className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          {instructions.length === 0 && (
                            <p className="text-xs opacity-20 italic p-8 border border-dashed border-zinc-800 rounded-2xl text-center">No instructions defined...</p>
                          )}
                        </div>
                      </div>

                      {/* Constraints Array */}
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-destructive opacity-50" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-destructive">Constraints</span>
                          </div>
                          <Button variant="ghost" size="xs" onClick={() => appendConstraint("")} className="h-6 text-[8px] hover:bg-zinc-900">
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {constraints.map((field, index) => (
                            <div key={field.id} className="flex gap-2 group">
                              <Input 
                                {...form.register(`guardrails.constraints.${index}` as any)} 
                                placeholder="Hard limitation..."
                                className="bg-zinc-900/30 border-zinc-800 focus:border-destructive focus:bg-zinc-900 transition-all text-sm h-12 rounded-xl outline-none"
                                onBlur={syncDraft}
                              />
                              <Button variant="ghost" size="icon" onClick={() => removeConstraint(index)} className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          {constraints.length === 0 && (
                            <p className="text-xs opacity-20 italic p-8 border border-dashed border-zinc-800 rounded-2xl text-center">No constraints defined...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StudioSection>

              {/* SECTION 3: ENGINE */}
              <StudioSection id="ENGINE" number={3} title="Engine">
                <div className="grid grid-cols-2 gap-24 relative overflow-hidden">
                  {/* Volume Knob Number in background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black font-display opacity-[0.03] select-none pointer-events-none transition-all duration-500">
                    {Math.round(temperature * 100)}
                  </div>

                  <div className="space-y-12 relative z-10">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Inference Core</h4>
                        <div className="space-y-4">
                            {[
                                { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", cost: "High" },
                                { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", cost: "Low" },
                                { id: "gpt-4o", name: "GPT-4o", cost: "Mid" }
                            ].map((model) => (
                                <div 
                                    key={model.id}
                                    onClick={() => {
                                        form.setValue("llm_model_id", model.id);
                                        syncDraft();
                                    }}
                                    className={cn(
                                        "p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                                        watchedValues.llm_model_id === model.id ? "border-primary bg-primary/5" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
                                    )}
                                >
                                    <span className={cn("text-lg font-bold transition-colors", watchedValues.llm_model_id === model.id ? "text-primary" : "text-white")}>
                                        {model.name}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-[8px] opacity-40 uppercase tracking-tighter">{model.cost} Cost</Badge>
                                        <div className={cn(
                                            "w-2 h-2 rounded-full transition-all",
                                            watchedValues.llm_model_id === model.id ? "bg-primary scale-125 shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-zinc-800 group-hover:bg-zinc-600"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-zinc-900">
                        <div className="flex justify-between items-end">
                            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Temperature Knob</h4>
                            <span className="text-4xl font-black font-mono text-primary">{temperature}</span>
                        </div>
                        <FormField
                            control={form.control}
                            name="temperature"
                            render={({ field }) => (
                                <div className="py-8">
                                    <Slider 
                                        min={0} 
                                        max={1} 
                                        step={0.01} 
                                        value={[field.value]} 
                                        onValueChange={(v) => {
                                            field.onChange(v[0]);
                                            syncDraft();
                                        }} 
                                        className="py-4 cursor-pointer"
                                    />
                                </div>
                            )}
                        />
                        <div className="flex justify-between text-[8px] font-mono uppercase opacity-30 tracking-widest">
                            <span>Deterministic</span>
                            <span>Creative</span>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-12 relative z-10">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Cognitive Switches</h4>
                    <div className="space-y-4">
                        {[
                            { name: "reflexion", title: "Reflexion Mode", hint: "Agent will self-correct before responding" },
                            { name: "grounded_mode", title: "Grounded Mode", hint: "Strictly adhere to provided context sources" },
                            { name: "rag_enforcement", title: "RAG Enforcement", hint: "Force retrieval for every response" },
                            { name: "auto_start", title: "Auto-Autonomous", hint: "Immediately initiate logic on trigger" }
                        ].map((sw) => (
                            <FormField
                                key={sw.name}
                                control={form.control}
                                name={sw.name as any}
                                render={({ field }) => (
                                    <div className={cn(
                                        "p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                                        field.value ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.05)]" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
                                    )} onClick={() => {
                                        field.onChange(!field.value);
                                        syncDraft();
                                    }}>
                                        <div className="space-y-1">
                                            <h5 className="font-bold uppercase tracking-widest text-xs">{sw.title}</h5>
                                            <p className="text-[10px] opacity-40 group-hover:opacity-100 transition-opacity">{sw.hint}</p>
                                        </div>
                                        <Checkbox checked={field.value} className="border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:text-black transition-all" />
                                    </div>
                                )}
                            />
                        ))}
                    </div>
                  </div>
                </div>
              </StudioSection>

              {/* SECTION 4: DATA INTERFACE */}
              <StudioSection id="INTERFACE" number={4} title="Interface">
                <div className="space-y-16">
                  {/* CONTEXT PARAMETERS */}
                  <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                       <div className="flex items-center gap-3">
                          <Code className="w-5 h-5 text-zinc-500" />
                          <h4 className="text-xl font-bold uppercase font-display">Context Input Schema</h4>
                       </div>
                       <Button variant="outline" size="sm" onClick={() => appendContext({ name: "", field_type: "string", is_required: true })} className="border-zinc-800 text-[10px] uppercase font-bold h-8">
                          <Plus className="w-3 h-3 mr-2" /> Add Field
                       </Button>
                    </div>

                    <div className="space-y-4">
                       <div className="grid grid-cols-[1fr_150px_100px_50px] gap-4 px-4 text-[8px] font-mono uppercase tracking-[0.2em] opacity-30">
                          <span>Parameter Name</span>
                          <span>Type</span>
                          <span className="text-center">Req.</span>
                          <span></span>
                       </div>
                       {contextItems.map((field, index) => (
                         <div key={field.id} className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl group hover:border-zinc-600 transition-all">
                            <Input 
                                {...form.register(`data_interface.context.${index}.name` as any)} 
                                placeholder="e.g. user_query" 
                                className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 placeholder:opacity-20 shadow-none"
                                onBlur={syncDraft}
                            />
                            <select 
                                {...form.register(`data_interface.context.${index}.field_type` as any)}
                                className="bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] h-8 px-2 focus:border-primary outline-none transition-colors"
                                onChange={() => syncDraft()}
                            >
                                <option value="string">STRING</option>
                                <option value="number">NUMBER</option>
                                <option value="boolean">BOOLEAN</option>
                                <option value="json">JSON</option>
                            </select>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={watchedValues.data_interface?.context?.[index]?.is_required}
                                    onCheckedChange={(checked) => {
                                        form.setValue(`data_interface.context.${index}.is_required` as any, checked);
                                        syncDraft();
                                    }}
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeContext(index)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                       ))}
                       {contextItems.length === 0 && (
                         <div className="p-12 border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center opacity-20 grayscale">
                            <Info className="w-8 h-8 mb-2" />
                            <p className="text-xs uppercase font-bold tracking-widest text-center max-w-[200px]">Define the specific data fields your agent expects</p>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* ARTEFACTS OUTPUT */}
                  <div className="space-y-8 pt-16 border-t border-zinc-900">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                       <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-zinc-500" />
                          <h4 className="text-xl font-bold uppercase font-display">Produced Artefacts</h4>
                       </div>
                       <Button variant="outline" size="sm" onClick={() => appendArtefact({ name: "", field_type: "string", is_required: true })} className="border-zinc-800 text-[10px] uppercase font-bold h-8">
                          <Plus className="w-3 h-3 mr-2" /> Add Artefact
                       </Button>
                    </div>

                    <div className="space-y-4">
                       {artefactItems.map((field, index) => (
                         <div key={field.id} className="grid grid-cols-[1fr_150px_100px_50px] gap-4 items-center p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl group hover:border-zinc-600 transition-all">
                            <Input 
                                {...form.register(`data_interface.artefacts.${index}.name` as any)} 
                                placeholder="e.g. final_report" 
                                className="bg-transparent border-none focus:ring-0 h-8 text-sm font-bold p-0 placeholder:opacity-20 shadow-none"
                                onBlur={syncDraft}
                            />
                            <select 
                                {...form.register(`data_interface.artefacts.${index}.field_type` as any)}
                                className="bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] h-8 px-2 focus:border-primary outline-none transition-colors"
                                onChange={() => syncDraft()}
                            >
                                <option value="file">FILE</option>
                                <option value="markdown">MARKDOWN</option>
                                <option value="image">IMAGE</option>
                                <option value="json">STRUCTURED DATA</option>
                            </select>
                            <div className="flex justify-center">
                                <Checkbox 
                                    checked={watchedValues.data_interface?.artefacts?.[index]?.is_required}
                                    onCheckedChange={(checked) => {
                                        form.setValue(`data_interface.artefacts.${index}.is_required` as any, checked);
                                        syncDraft();
                                    }}
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeArtefact(index)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </StudioSection>

              {/* SECTION 5: AVAILABILITY */}
              <StudioSection id="AVAILABILITY" number={5} title="Availability">
                 <div className="p-16 rounded-[3rem] bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                       <Zap className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-2xl font-bold font-display uppercase">Deployment Ready</h4>
                       <p className="text-zinc-500 max-w-sm mx-auto text-sm leading-relaxed">
                          Your agent blueprint is technically valid. Deploying will make it available across selected workspaces.
                       </p>
                    </div>
                    <Button size="lg" className="px-12 bg-white text-black hover:bg-zinc-200 font-bold transition-all active:scale-95 shadow-xl shadow-primary/5" onClick={form.handleSubmit(handleSubmit)}>
                       Deploy Blueprint
                    </Button>
                 </div>
              </StudioSection>
            </form>
          </Form>
        </div>

        {/* Right: Live Poster Sidebar - Independent Scroll */}
        <aside className="h-full border-l border-zinc-900 bg-zinc-950/20 overflow-y-auto no-scrollbar p-8 flex justify-center">
           <div className="w-full flex justify-center">
              <LivePoster data={watchedValues} />
           </div>
        </aside>
      </main>
    </div>
  );
};
