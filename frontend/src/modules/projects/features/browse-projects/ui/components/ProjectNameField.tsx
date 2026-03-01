import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/ui/Form";
import { Input } from "@/shared/ui/ui/Input";
import { ProjectNameFieldProps } from "../types";

export const ProjectNameField: React.FC<ProjectNameFieldProps> = ({ form }) => {
    return (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormControl>
                        <Input placeholder="Nazwa projektu" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
