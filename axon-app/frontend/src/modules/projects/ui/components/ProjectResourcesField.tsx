import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/ui/Form";
import { FormTextField } from "@/shared/ui/form/FormTextField";
import { Button } from "@/shared/ui/ui/Button";
import { Plus, X, Link as LinkIcon, Globe } from "lucide-react";
import { ProjectResourcesFieldProps } from "../types";
import { 
    ProjectResourcesContainer, 
    ProjectResourcesList, 
    ProjectResourceItem,
    ProjectResourceInputWrapper,
    ProjectResourceIconWrapper
} from "./ProjectResourcesLayout";

// Consistent set from Simple Icons for all brands
import { SiFigma, SiNotion, SiGoogledrive } from "react-icons/si";

const getLinkProvider = (url: string) => {
    // Shared monochromatic color class
    const monoColor = "text-zinc-500 dark:text-zinc-400";
    
    if (!url) return { icon: LinkIcon, color: "text-zinc-400" };
    
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("notion.so")) {
        return { icon: SiNotion, color: monoColor };
    }
    if (lowerUrl.includes("figma.com")) {
        return { icon: SiFigma, color: monoColor };
    }
    if (lowerUrl.includes("drive.google.com") || lowerUrl.includes("docs.google.com")) {
        return { icon: SiGoogledrive, color: monoColor };
    }
    
    return { icon: Globe, color: monoColor };
};

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
                        render={({ field: fieldProps }) => {
                            const provider = getLinkProvider(fieldProps.value || "");
                            const ProviderIcon = provider.icon;

                            return (
                                <FormItem className="space-y-0 w-full">
                                    <FormControl>
                                        <ProjectResourceItem>
                                            <ProjectResourceInputWrapper>
                                                <ProjectResourceIconWrapper>
                                                    <ProviderIcon className={`h-5 w-5 ${provider.color} transition-colors`} />
                                                </ProjectResourceIconWrapper>
                                                <FormTextField 
                                                    placeholder="Link do zasobów (Notion, Figma, Drive...)" 
                                                    {...fieldProps} 
                                                    className="pl-14"
                                                />
                                            </ProjectResourceInputWrapper>
                                            
                                            {linkFields.length > 1 && (
                                                <Button 
                                                    type="button" 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => onRemove(index)}
                                                    className="h-14 w-14 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-xl border border-transparent hover:border-red-500/20 shrink-0"
                                                >
                                                    <X className="h-6 w-6" />
                                                </Button>
                                            )}
                                        </ProjectResourceItem>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
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
