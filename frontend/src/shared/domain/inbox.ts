import { z } from "zod";

export const InboxItemStatusSchema = z.enum(["NEW", "RESOLVED", "ARCHIVED"]);
export const InboxItemTypeSchema = z.enum([
    "ARTIFACT_READY", 
    "ERROR_ALERT", 
    "SYSTEM_MESSAGE", 
    "ACTION_REQUIRED",
    "CONSULTATION",
    "APPROVAL_NEEDED"
]);
export const InboxItemPrioritySchema = z.enum(["CRITICAL", "HIGH", "NORMAL", "LOW"]);

export const InboxItemSchema = z.object({
    id: z.string().uuid(),
    item_status: InboxItemStatusSchema,
    item_type: InboxItemTypeSchema,
    item_priority: InboxItemPrioritySchema,
    item_title: z.string(),
    item_content: z.string(),
    item_source: z.string(),
    artifact_id: z.string().uuid().nullable().optional(),
    project_id: z.string().uuid().nullable().optional(),
    created_at: z.string().datetime(),
    resolved_at: z.string().datetime().nullable().optional(),
});

export type InboxItem = z.infer<typeof InboxItemSchema>;

export const BulkResolveRequestSchema = z.object({
    item_ids: z.array(z.string().uuid()),
});
