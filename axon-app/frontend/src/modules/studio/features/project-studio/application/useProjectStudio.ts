"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useProjectDraft } from "@/modules/projects/application/useProjectDraft";
import { CreateProjectFormSchema, CreateProjectFormData } from "@/modules/projects/application/schemas";
import { useCreateProjectMutation, useUpdateProjectMutation } from "@/modules/projects/application/hooks";

export const useProjectStudio = (initialData?: Partial<CreateProjectFormData>, projectId?: string) => {
    const { workspace: workspaceId } = useParams<{ workspace: string }>();
    const router = useRouter();

    const { draft, saveDraft, clearDraft } = useProjectDraft(workspaceId || "default", projectId);
    const { mutateAsync: createProject, isPending: isCreating } = useCreateProjectMutation();
    const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProjectMutation();

    const effectiveData = useMemo(() => {
        const base = initialData || draft;
        if (!base) return undefined;

        return {
            name: base.name || "",
            description: base.description || "",
            status: base.status || "Idea",
            keywords: base.keywords || [],
            links: base.links || [{ url: "" }],
            spaceIds: base.spaceIds || [],
            generateNewSpace: base.generateNewSpace || false,
        } as CreateProjectFormData;
    }, [initialData, draft]);

    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(CreateProjectFormSchema),
        values: effectiveData || {
            name: "",
            description: "",
            status: "Idea",
            keywords: [],
            links: [{ url: "" }],
            spaceIds: [],
            generateNewSpace: false,
        },
    });

    const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
        control: form.control,
        name: "links",
    });

    const handleExit = useCallback(() => {
        if (workspaceId) {
            router.push(`/workspaces/${workspaceId}/projects`);
        } else {
            router.push(`/projects`);
        }
    }, [router, workspaceId]);

    const handleSubmit = async (data: CreateProjectFormData) => {
        console.log("handleSubmit Triggered", data);
        try {
            if (projectId) {
                console.log("Updating project...", projectId);
                await updateProject({ id: projectId, data, workspaceId: workspaceId || "default" });
                console.log("Project updated successfully");
            } else {
                console.log("Creating project...");
                await createProject({ data, workspaceId: workspaceId || "default" });
                console.log("Project created successfully");
            }
            // Draft clearing is handled in mutation onSuccess
            handleExit();
        } catch (error) {
            console.error("Failed to save project:", error);
        }
    };

    const syncDraft = useCallback(() => {
        saveDraft(form.getValues());
    }, [form, saveDraft]);

    return {
        form,
        isCreating: isCreating || isUpdating,
        handleExit,
        handleSubmit,
        syncDraft,
        linkFields,
        appendLink,
        removeLink,
    };
};
