import { useState, ChangeEvent, KeyboardEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSpaceFormSchema, CreateSpaceFormData } from "./schemas";
import { useCreateSpaceMutation } from "./hooks";

export const useCreateSpaceForm = (onSuccess?: () => void) => {
    const [keywordInput, setKeywordInput] = useState("");
    const { mutate: createSpace, isPending } = useCreateSpaceMutation();

    const form = useForm<CreateSpaceFormData>({
        resolver: zodResolver(CreateSpaceFormSchema),
        defaultValues: {
            name: "",
            keywords: [],
            links: [{ url: "" }],
            projectMode: "none",
        },
    });

    const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
        control: form.control,
        name: "links",
    });

    const spaceName = form.watch("name");
    const projectMode = form.watch("projectMode");
    const currentKeywords = form.watch("keywords");

    const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setKeywordInput(e.target.value);
    };

    const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const trimmed = keywordInput.trim().replace(/,$/, "");
            if (trimmed && !currentKeywords.includes(trimmed)) {
                form.setValue("keywords", [...currentKeywords, trimmed]);
                setKeywordInput("");
            }
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        form.setValue(
            "keywords",
            currentKeywords.filter((k) => k !== keywordToRemove)
        );
    };

    const handleSubmit = async (data: CreateSpaceFormData) => {
        createSpace(data, {
            onSuccess: () => {
                onSuccess?.();
            }
        });
    };

    return {
        form,
        linkFields,
        appendLink,
        removeLink,
        spaceName,
        projectMode,
        currentKeywords,
        keywordInput,
        handleKeywordChange,
        handleKeywordKeyDown,
        removeKeyword,
        handleSubmit,
        isPending
    };
};
