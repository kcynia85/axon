import * as z from "zod";

export const CreateProjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa projektu musi mieć co najmniej 2 znaki.",
  }),
  keywords: z.array(z.string()),
  links: z.array(z.object({
    url: z.string().url({ message: "Wprowadź poprawny URL" }).or(z.literal("")),
  })),
  spaceMode: z.enum(["new", "existing"]),
  existingSpaceId: z.string().optional(),
});

export type CreateProjectFormData = z.infer<typeof CreateProjectFormSchema>;
