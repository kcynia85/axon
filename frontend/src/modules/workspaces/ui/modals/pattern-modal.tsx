"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    PatternSchema
} from "@/shared/domain/workspaces";
import { Resolver } from "react-hook-form";
import { useCreatePattern } from "@/modules/workspaces/application/use-patterns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/ui/form";
import { Input } from "@/shared/ui/ui/input";
import { Button } from "@/shared/ui/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/ui/ui/select";
import { Textarea } from "@/shared/ui/ui/textarea";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Share2, Network, Target, Save, X } from "lucide-react";

const CreatePatternFormSchema = PatternSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});

type FormData = z.infer<typeof CreatePatternFormSchema>;

export const PatternModal = () => {
    const router = useRouter();
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const searchParams = useSearchParams();
    const isOpen = searchParams.get("modal") === "new-pattern";

    const { mutateAsync: createPattern, isPending } = useCreatePattern(workspaceId);

    const form = useForm<FormData>({
        resolver: zodResolver(CreatePatternFormSchema) as unknown as Resolver<FormData>,
        defaultValues: {
            pattern_name: "",
            pattern_type: "Pattern",
            pattern_okr_context: "",
            pattern_graph_structure: { nodes: {}, edges: {} },
            pattern_keywords: [],
            availability_workspace: [workspaceId],
        },
    });

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("modal");
        router.replace(`?${params.toString()}`, { scroll: false });
        form.reset();
    };

    const onSubmit = async (data: FormData) => {
        try {
            await createPattern(data);
            closeModal();
        } catch (error) {
            console.error("Failed to create pattern:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Share2 className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Graph Blueprint</span>
                    </div>
                    <DialogTitle className="text-xl font-bold font-display">Architectural Pattern</DialogTitle>
                    <DialogDescription className="text-xs">
                        Save a recurring graph structure as a reusable pattern for this workspace.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pattern_name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="text-xs uppercase font-bold">Pattern Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Multi-Stage Research Flow" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pattern_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase font-bold">Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="text-xs">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Pattern" className="text-xs">Standard Pattern</SelectItem>
                                                    <SelectItem value="Reusable Template" className="text-xs">Reusable Template</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormItem>
                                    <FormLabel className="text-xs uppercase font-bold">Graph Status</FormLabel>
                                    <div className="flex items-center gap-2 h-9 px-3 rounded border bg-muted/30 text-[10px] text-muted-foreground">
                                        <Network className="w-3 h-3" /> Linked to Active Canvas
                                    </div>
                                </FormItem>
                            </div>

                            <FormField
                                control={form.control}
                                name="pattern_okr_context"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase font-bold flex items-center gap-2">
                                            <Target className="w-3 h-3 text-orange-500" /> Strategic Context
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Which OKR or high-level goal does this pattern address?"
                                                className="resize-none h-20 text-xs"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="p-4 border-t bg-muted/10">
                            <Button type="button" variant="ghost" size="sm" onClick={closeModal} className="text-xs gap-2">
                                <X className="w-3 h-3" /> Discard
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="text-xs gap-2 px-6"
                                disabled={isPending}
                            >
                                <Save className="w-3 h-3" />
                                {isPending ? "Indexing..." : "Save Blueprint"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
