import React from "react";
import { Input } from "@/shared/ui/ui/Input";
import { Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CreateSpaceFormData } from "../../application/schemas";
import { FormRadio } from "@/shared/ui/form/FormRadio";

export type SpaceProjectSelectorProps = {
    readonly form: UseFormReturn<CreateSpaceFormData>;
    readonly projectMode: "none" | "existing";
    readonly spaceName: string;
};

export const SpaceProjectSelector: React.FC<SpaceProjectSelectorProps> = ({ 
    form, 
    projectMode, 
    spaceName 
}) => {
    return (
        <div className="space-y-4 pt-8 border-t border-zinc-100 dark:border-zinc-900">
            <div className="grid grid-cols-1 gap-3">
                <FormRadio 
                    checked={projectMode === "existing"}
                    onChange={() => form.setValue("projectMode", "existing")}
                    title="Podłącz istniejący projekt"
                    description="Wybierz projekt, z którym chcesz powiązać ten space."
                    className={projectMode === "existing" ? "pb-2" : ""}
                />
                
                {projectMode === "existing" && (
                    <div className="relative animate-in slide-in-from-top-2 duration-300 px-6 pb-6 bg-primary border-x border-b border-primary rounded-b-2xl -mt-5 pt-2 z-0">
                        <div className="relative">
                            <Search className="absolute left-4 top-1 -translate-y-1 h-4 w-4 text-zinc-500" />
                            <Input 
                                placeholder="Wyszukaj projekt" 
                                className="h-11 pl-11 bg-white dark:bg-black text-black dark:text-white border-zinc-200 dark:border-zinc-800 rounded-xl"
                                onValueChange={(val) => form.setValue("existingProjectId", val)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}

                <FormRadio 
                    checked={projectMode === "none"}
                    onChange={() => form.setValue("projectMode", "none")}
                    title="Kontynuuj jako space bez projektu"
                    description={`${spaceName || "Nazwa space'a"} zostanie utworzony jako niezależna jednostka.`}
                />
            </div>
        </div>
    );
};
