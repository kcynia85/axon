import * as z from "zod";

export const CreateProjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa projektu musi mieć co najmniej 2 znaki.",
  }),
  description: z.string().optional(),
  status: z.string().default("Idea"),
  keywords: z.array(z.string()),
  links: z.array(z.object({
    url: z.string().optional().or(z.literal("")),
  })),
  spaceIds: z.array(z.string()).default([]),
  generateNewSpace: z.boolean().default(false),
});

export type CreateProjectFormData = z.infer<typeof CreateProjectFormSchema>;
