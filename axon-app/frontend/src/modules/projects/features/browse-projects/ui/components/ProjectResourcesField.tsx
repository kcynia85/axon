import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { Button } from "@/shared/ui/ui/Button";
import { Plus, X, Link as LinkIcon } from "lucide-react";
import { ProjectResourcesFieldProps } from "../types";
import { 
    ProjectResourcesContainer, 
    ProjectResourcesList, 
    ProjectResourceItem, 
    ProjectResourceInputWrapper,
    ProjectResourceIconWrapper
} from "./ProjectResourcesLayout";

export const ProjectResourcesField: React.FC<ProjectResourcesFieldProps> = ({ 
    form, 
    linkFields, 
    onAppend, 
    onRemove 
}) => {
    return (
        <ProjectResourcesContainer>
            <ProjectResourcesList>
                {linkFields.map((field, index) => (
                    <FormField
                        key={field.id}
                        control={form.control}
                        name={`links.${index}.url`}
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <FormControl>
                                    <ProjectResourceItem>
                                        <ProjectResourceInputWrapper>
                                            <ProjectResourceIconWrapper>
                                                <LinkIcon className="h-full w-full" />
                                            </ProjectResourceIconWrapper>
                                            <Input 
                                                placeholder="Link do zasobów" 
                                                {...field} 
                                                className="pl-12"
                                            />
                                        </ProjectResourceInputWrapper>
                                        {linkFields.length > 1 && (
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => onRemove(index)}
                                                className="h-14 w-14 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-xl border border-transparent hover:border-red-500/20"
                                            >
                                                <X className="h-6 w-6" />
                                            </Button>
                                        )}
                                    </ProjectResourceItem>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </ProjectResourcesList>
            <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => onAppend({ url: "" })}
                className="px-4 text-[14px] text-zinc-900/40 dark:text-zinc-100/40 font-black hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all rounded-xl gap-2 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 h-10 group"
            >
                <Plus className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                Dodaj kolejny zasób
            </Button>
        </ProjectResourcesContainer>
    );
};
