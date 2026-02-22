'use client';

import { Button } from "@/shared/ui/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/ui/Dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/ui/Form"
import { Input } from "@/shared/ui/ui/Input"
import { Textarea } from "@/shared/ui/ui/Textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus } from "lucide-react"
import { useState } from "react"
import { createProject } from "../infrastructure/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { HubType, ProjectStatus } from "../../../domain"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  domain: z.enum(["product", "discovery", "delivery", "design", "growth", "writing"]),
})

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      domain: "product",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const project = await createProject({
        name: values.name,
        description: values.description,
        domain: values.domain as HubType,
        status: ProjectStatus.IDEA
      });
      
      toast.success("Project created successfully!")
      setOpen(false)
      form.reset()
      router.push(`/projects/${project.id}`)
      router.refresh()
    } catch (error) {
      toast.error("Failed to create project")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Start a new initiative. You can add agents and knowledge later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Alpha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                   <FormControl>
                    <select 
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                    >
                      <option value="discovery">Research / Discovery</option>
                      <option value="product">Product Management</option>
                      <option value="delivery">Software Engineering</option>
                      <option value="design">Design</option>
                      <option value="writing">Content & Writing</option>
                      <option value="growth">Marketing & Growth</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is this project about?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
