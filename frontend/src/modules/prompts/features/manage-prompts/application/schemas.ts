import * as z from "zod";

export const PromptFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    slug: z.string().min(1, "Slug is required"),
});

export type PromptFormData = z.infer<typeof PromptFormSchema>;
