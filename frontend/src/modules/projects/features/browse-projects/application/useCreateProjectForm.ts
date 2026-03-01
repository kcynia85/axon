import { useState, ChangeEvent, KeyboardEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProjectFormSchema, CreateProjectFormData } from "./schemas";
import { useCreateProjectMutation } from "./hooks";

export const useCreateProjectForm = (onSuccess?: () => void) => {
    const [keywordInput, setKeywordInput] = useState("");
    const { mutateAsync: createProject, isPending } = useCreateProjectMutation();
    
    const form = useForm<CreateProjectFormData>({
        resolver: zodResolver(CreateProjectFormSchema),
        defaultValues: {
            name: "",
            keywords: [],
            links: [{ url: "" }],
            spaceMode: "new",
            existingSpaceId: "",
        },
    });

    const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
        control: form.control,
        name: "links",
    });

    const projectName = form.watch("name");
    const spaceMode = form.watch("spaceMode");
    const currentKeywords = form.watch("keywords");

    const addKeyword = (value: string) => {
        const trimmed = value.trim().replace(/,$/, "").toLowerCase();
        if (trimmed && !currentKeywords.includes(trimmed)) {
            form.setValue("keywords", [...currentKeywords, trimmed]);
            setKeywordInput("");
            return true;
        }
        return false;
    };

    const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.endsWith(" ") || value.endsWith(",")) {
            if (addKeyword(value)) {
                return;
            }
        }
        setKeywordInput(value);
    };

    const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword(keywordInput);
        } else if (e.key === 'Backspace' && !keywordInput && currentKeywords.length > 0) {
            removeKeyword(currentKeywords[currentKeywords.length - 1]);
        }
    };

    const removeKeyword = (keyword: string) => {
        form.setValue("keywords", currentKeywords.filter(k => k !== keyword));
    };

    const handleSubmit = async (values: CreateProjectFormData) => {
        await createProject(values);
        form.reset();
        if (onSuccess) onSuccess();
    };

    return {
        form,
        linkFields,
        appendLink,
        removeLink,
        projectName,
        spaceMode,
        currentKeywords,
        keywordInput,
        handleKeywordChange,
        handleKeywordKeyDown,
        removeKeyword,
        handleSubmit,
        isPending
    };
};
