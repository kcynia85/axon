"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AgentSchema
} from "@/shared/domain/workspaces";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/shared/ui/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/shared/ui/ui/Form";
import { Badge } from "@/shared/ui/ui/Badge";
import { Input } from "@/shared/ui/ui/Input";
import { Textarea } from "@/shared/ui/ui/Textarea";
import { Button } from "@/shared/ui/ui/Button";
import { Checkbox } from "@/shared/ui/ui/Checkbox";
import { Slider } from "@/shared/ui/ui/Slider";
import {
  useParams,
  useRouter,
  useSearchParams
} from "next/navigation";
import { useCreateAgent } from "../../application/useAgents";
import { Resolver } from "react-hook-form";
import {
  User,
  Brain,
  Cpu,
  ChevronRight,
  ChevronLeft,
  Save,
  Plus,
  X
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

// frontend/src/modules/workspaces/ui/modals/AgentModal.tsx

import { CreateAgentFormSchema, CreateAgentFormData, AgentModalStep } from "../../application/schemas";

export const AgentModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const isOpen = searchParams.get("modal") === "new-agent";
  const [step, setStep] = React.useState<AgentModalStep>("Identity");

  const { mutateAsync: createAgent, isPending } = useCreateAgent();

  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(CreateAgentFormSchema) as unknown as Resolver<CreateAgentFormData>,
    defaultValues: {
      agent_name: "",
      agent_role_text: "",
      agent_goal: "",
      agent_backstory: "",
      guardrails: { instructions: [], constraints: [] },
      few_shot_examples: [],
      reflexion: false,
      temperature: 0.7,
      rag_enforcement: false,
      agent_keywords: [],
      availability_workspace: [workspaceId],
      llm_model_id: null,
      knowledge_hub_ids: [],
    },
  });

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(`?${params.toString()}`, { scroll: false });
    form.reset();
    setStep("Identity");
  };

  const onSubmit = async (data: CreateAgentFormData) => {
    try {
      await createAgent(data);
      closeModal();
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  const nextStep = () => {
    if (step === "Identity") setStep("Memory");
    else if (step === "Memory") setStep("Engine");
  };

  const prevStep = () => {
    if (step === "Engine") setStep("Memory");
    else if (step === "Memory") setStep("Identity");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-background">
        <div className="flex h-[550px]">
          {/* Sidebar Steps */}
          <div className="w-1/3 bg-muted/30 border-r p-6 space-y-8">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display">Lab Creator</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">New Agent Profile</p>
            </div>

            <nav className="space-y-4">
              <StepIndicator
                active={step === "Identity"}
                done={step !== "Identity"}
                icon={<User className="w-4 h-4" />}
                label="Identity"
                onClick={() => setStep("Identity")}
              />
              <StepIndicator
                active={step === "Memory"}
                done={step === "Engine"}
                icon={<Brain className="w-4 h-4" />}
                label="Memory"
                onClick={() => setStep("Memory")}
              />
              <StepIndicator
                active={step === "Engine"}
                done={false}
                icon={<Cpu className="w-4 h-4" />}
                label="Engine"
                onClick={() => setStep("Engine")}
              />
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl font-bold">
                {step === "Identity" && "Professional Identity"}
                {step === "Memory" && "Cognitive Resources"}
                {step === "Engine" && "Inference Engine"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {step === "Identity" && "Define who this agent is and what they represent."}
                {step === "Memory" && "Connect knowledge bases and define reach."}
                {step === "Engine" && "Configure model logic and safety guardrails."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                  {step === "Identity" && (
                    <>
                      <FormField
                        control={form.control}
                        name="agent_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold tracking-wider">Agent Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Athena Researcher" {...field} value={field.value || ""} />
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
                            <FormLabel className="text-xs uppercase font-bold tracking-wider">Role</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. QA Process Manager" {...field} value={field.value || ""} />
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
                            <FormLabel className="text-xs uppercase font-bold tracking-wider">Primary Goal</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What should this agent focus on?"
                                className="resize-none h-20"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {step === "Memory" && (
                    <>
                      <FormField
                        control={form.control}
                        name="rag_enforcement"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/10">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-bold">RAG Enforcement</FormLabel>
                              <FormDescription className="text-[10px]">
                                Agent must use connected Knowledge Hubs for every response.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <FormLabel className="text-xs uppercase font-bold tracking-wider">Knowledge Hubs</FormLabel>
                        <div className="p-4 border rounded-md border-dashed text-center text-[10px] text-muted-foreground">
                          No hubs connected. Click to browse gallery.
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="availability_workspace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase font-bold tracking-wider">Workspace Availability</FormLabel>
                            <div className="flex gap-2 flex-wrap pt-2">
                              {["Discovery", "Design", "Delivery", "Growth"].map(ws => (
                                <Badge
                                  key={ws}
                                  variant={field.value?.includes(ws) ? "default" : "outline"}
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const current = field.value || [];
                                    if (current.includes(ws)) {
                                      field.onChange(current.filter(item => item !== ws));
                                    } else {
                                      field.onChange([...current, ws]);
                                    }
                                  }}
                                >
                                  {ws}
                                </Badge>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {step === "Engine" && (
                    <>
                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center mb-4">
                              <FormLabel className="text-xs uppercase font-bold tracking-wider">Temperature</FormLabel>
                              <span className="text-xs font-mono font-bold text-primary">{field.value}</span>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={1}
                                step={0.1}
                                value={[field.value]}
                                onValueChange={(val: number[]) => field.onChange(val[0])}
                              />
                            </FormControl>
                            <FormDescription className="text-[10px] mt-2">
                              Lower is more predictable, higher is more creative.
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reflexion"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/10">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-bold">Self-Reflexion</FormLabel>
                              <FormDescription className="text-[10px]">
                                Agent evaluates its own output before finalizing.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-xs uppercase font-bold tracking-wider">Guardrails</FormLabel>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1" type="button">
                            <Plus className="w-2 h-2" /> Add Constraint
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground italic">No constraints defined yet.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <DialogFooter className="p-6 bg-muted/10 border-t flex items-center justify-between sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={step === "Identity" ? closeModal : prevStep}
                    className="text-xs gap-2"
                  >
                    {step === "Identity" ? <X className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                    {step === "Identity" ? "Discard" : "Back"}
                  </Button>

                  {step === "Engine" ? (
                    <Button
                      type="submit"
                      size="sm"
                      className="text-xs gap-2 px-6"
                      disabled={isPending}
                    >
                      <Save className="w-3 h-3" />
                      {isPending ? "Creating..." : "Save Agent"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      onClick={nextStep}
                      className="text-xs gap-2 px-6"
                    >
                      Next Phase
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StepIndicator = ({ active, done, icon, label, onClick }: {
  active: boolean,
  done: boolean,
  icon: React.ReactNode,
  label: string,
  onClick: () => void
}) => (
  <div
    className={cn(
      "flex items-center gap-3 transition-colors cursor-pointer",
      active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      done && "text-primary/60"
    )}
    onClick={onClick}
  >
    <div className={cn(
      "w-8 h-8 rounded border flex items-center justify-center transition-all",
      active ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-background border-muted",
      done && "bg-primary/20 border-primary/20"
    )}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      <span className="text-[8px] opacity-60 font-mono">{active ? "Current" : done ? "Completed" : "Pending"}</span>
    </div>
  </div>
);
