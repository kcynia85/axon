import * as z from "zod";

export const CreateSpaceFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nazwa space'a musi mieć co najmniej 2 znaki.",
  }),
  keywords: z.array(z.string()),
  links: z.array(z.object({
    url: z.string().url({ message: "Wprowadź poprawny URL" }).or(z.literal("")),
  })),
  projectMode: z.enum(["none", "existing"]),
  existingProjectId: z.string().optional(),
});

export type CreateSpaceFormData = z.infer<typeof CreateSpaceFormSchema>;
