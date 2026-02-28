'use client';

import { Button } from "@/shared/ui/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/shared/ui/ui/Dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/ui/Form"
import { Input } from "@/shared/ui/ui/Input"
import { Badge } from "@/shared/ui/ui/Badge"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, X, Search, Link as LinkIcon, Check } from "lucide-react"
import { useState, KeyboardEvent, ChangeEvent } from "react"
import { createProject } from "../infrastructure/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ProjectStatus } from "../../../domain"
import { cn } from "@/shared/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa projektu musi mieć co najmniej 2 znaki.",
  }),
  keywords: z.array(z.string()),
  links: z.array(z.object({
    url: z.string().url({ message: "Wprowadź poprawny URL" }).or(z.literal("")),
  })),
  spaceMode: z.enum(["new", "existing"]),
  existingSpaceId: z.string().optional(),
})

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [keywordInput, setKeywordInput] = useState("")
  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      keywords: [],
      links: [{ url: "" }],
      spaceMode: "new",
      existingSpaceId: "",
    },
  })

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control: form.control,
    name: "links",
  })

  const projectName = form.watch("name")
  const spaceMode = form.watch("spaceMode")
  const currentKeywords = form.watch("keywords")

  const addKeyword = (value: string) => {
    const trimmed = value.trim().replace(/,$/, "").toLowerCase()
    if (trimmed && !currentKeywords.includes(trimmed)) {
      form.setValue("keywords", [...currentKeywords, trimmed])
      setKeywordInput("")
      return true
    }
    return false
  }

  const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.endsWith(" ") || value.endsWith(",")) {
      if (addKeyword(value)) {
        return
      }
    }
    setKeywordInput(value)
  }

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword(keywordInput)
    } else if (e.key === 'Backspace' && !keywordInput && currentKeywords.length > 0) {
      removeKeyword(currentKeywords[currentKeywords.length - 1])
    }
  }

  const removeKeyword = (keyword: string) => {
    form.setValue("keywords", currentKeywords.filter(k => k !== keyword))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const project = await createProject({
        project_name: values.name,
        project_status: ProjectStatus.IDEA,
        project_keywords: values.keywords,
        project_summary: null,
        project_strategy_url: values.links.find(l => l.url)?.url || null,
      } as any);
      
      toast.success("Projekt został utworzony!")
      setOpen(false)
      form.reset()
      router.push(`/projects/${project.id}`)
      router.refresh()
    } catch (error) {
      toast.error("Nie udało się utworzyć projektu")
      console.error("Project creation error:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all font-bold rounded-lg shadow-sm text-base">
            <Plus className="mr-2 h-4 w-4" />
            Nowy projekt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black shadow-2xl rounded-2xl flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-10 space-y-12 overflow-y-auto scrollbar-hide flex-1 pt-12 pb-32">
              {/* Nazwa Projektu */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <Input placeholder="Nazwa projektu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Key Resources */}
              <div className="space-y-4">
                <div className="space-y-4">
                  {linkFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`links.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <div className="flex gap-3 group">
                              <div className="relative flex-1">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors">
                                  <LinkIcon className="h-full w-full" />
                                </div>
                                <Input 
                                  placeholder="Link do zasobów" 
                                  {...field} 
                                  className="pl-12"
                                />
                              </div>
                              {linkFields.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeLink(index)}
                                  className="h-14 w-14 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-xl border border-transparent hover:border-red-500/20"
                                >
                                  <X className="h-6 w-6" />
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => appendLink({ url: "" })}
                  className="px-4 text-[14px] text-zinc-900/40 dark:text-zinc-100/40 font-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-xl gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 h-10 group"
                >
                  <Plus className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  Dodaj kolejny zasób
                </Button>
              </div>

              {/* Keywords (Inline Pills) */}
              <FormField
                control={form.control}
                name="keywords"
                render={() => (
                  <FormItem className="space-y-4">
                    <div 
                      className="flex flex-wrap gap-3 p-5 min-h-[4rem] bg-zinc-50 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-200 transition-all cursor-text shadow-inner"
                      onClick={() => document.getElementById('keyword-input')?.focus()}
                    >
                      {currentKeywords.map((keyword) => (
                        <Badge 
                          key={keyword} 
                          variant="secondary"
                          className="bg-white dark:bg-zinc-100 text-zinc-900 dark:text-zinc-900 px-5 py-2 text-[12px] font-black border border-zinc-200 dark:border-zinc-300 flex items-center gap-3 rounded-full shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-200 transition-all shrink-0 tracking-normal group/pill"
                        >
                          #{keyword}
                          <button
                            type="button"
                            className="p-1 -mr-1 hover:bg-black dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white rounded-full transition-all flex items-center justify-center pointer-events-auto group/x"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeKeyword(keyword);
                            }}
                          >
                            <X className="h-4 w-4 text-zinc-400 group-hover/pill:text-zinc-600 group-hover/x:text-white transition-colors stroke-[3]" />
                          </button>
                        </Badge>
                      ))}
                      <FormControl>
                        <input 
                          id="keyword-input"
                          placeholder={currentKeywords.length === 0 ? "Słowa kluczowe" : ""} 
                          value={keywordInput}
                          onChange={handleKeywordChange}
                          onKeyDown={handleKeywordKeyDown}
                          className="flex-1 bg-transparent border-none text-zinc-900 dark:text-zinc-100 focus:ring-0 text-base font-mono min-w-[200px] h-10 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-700 lowercase"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              {/* Powiązany Space */}
              <div className="space-y-4 pt-8 border-t border-zinc-100 dark:border-zinc-900">
                <div className="grid grid-cols-1 gap-3">
                  {/* Option 1: New Space */}
                  <div 
                    onClick={() => form.setValue("spaceMode", "new")}
                    className={cn(
                      "group cursor-pointer p-6 border-2 transition-all duration-300 ease-out rounded-[1.5rem] relative overflow-hidden",
                      spaceMode === "new" 
                        ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl ring-4 ring-zinc-900/10 dark:ring-white/10 translate-y-[-2px]" 
                        : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black hover:border-zinc-200 dark:hover:border-zinc-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:translate-y-[-1px]"
                    )}
                  >
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className={cn(
                          "text-base leading-tight tracking-tight transition-all duration-300",
                          spaceMode === "new" ? "font-black" : "font-normal"
                        )}>
                          Utwórz nowy space
                        </p>
                        <p className={cn(
                          "text-xs font-black tracking-normal opacity-60 transition-opacity duration-300",
                          spaceMode === "new" ? "opacity-80" : "text-zinc-500"
                        )}>
                           Nazwa: <span className="font-mono">{projectName || "Nazwa projektu"} space</span>
                        </p>
                      </div>
                      {spaceMode === "new" && (
                        <div className="animate-in fade-in zoom-in duration-300 shrink-0">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Option 2: Existing Space */}
                  <div 
                    onClick={() => form.setValue("spaceMode", "existing")}
                    className={cn(
                      "group cursor-pointer p-6 border-2 transition-all duration-300 ease-out rounded-[1.5rem] relative overflow-hidden",
                      spaceMode === "existing" 
                         ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl ring-4 ring-zinc-900/10 dark:ring-white/10 translate-y-[-2px]" 
                         : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black hover:border-zinc-200 dark:hover:border-zinc-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:translate-y-[-1px]"
                    )}
                  >
                    <div className="relative z-10 flex items-center justify-between gap-4">
                      <div className="space-y-4 flex-1">
                        <p className={cn(
                          "text-base leading-tight tracking-tight transition-all duration-300",
                          spaceMode === "existing" ? "font-black" : "font-normal"
                        )}>
                          Użyj istniejącego space'a
                        </p>
                        {spaceMode === "existing" && (
                          <div className="relative animate-in slide-in-from-top-2 duration-300">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                            <Input 
                              placeholder="Wyszukaj space" 
                              className="h-12 pl-12 bg-white dark:bg-black text-black dark:text-white border-none shadow-inner ring-1 ring-zinc-200 dark:ring-zinc-800"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                      {spaceMode === "existing" && (
                        <div className="animate-in fade-in zoom-in duration-300 shrink-0">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="absolute bottom-0 left-0 right-0 p-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-xl shrink-0 z-20 flex flex-row justify-end items-center gap-6">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-black tracking-normal text-base"
              >
                Anuluj
              </Button>
              <Button 
                type="submit" 
                size="sm"
                className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-black rounded-md shadow-xl transition-all active:scale-[0.98] tracking-normal text-base px-10 h-12"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Tworzenie..." : "Utwórz projekt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
