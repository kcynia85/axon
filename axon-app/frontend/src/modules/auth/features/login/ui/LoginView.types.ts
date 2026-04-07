import { UseFormReturn } from "react-hook-form";
import { LoginSchema } from "../domain/schema";

export type LoginViewProps = {
    readonly form: UseFormReturn<LoginSchema>;
    readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    readonly loading: boolean;
    readonly error: string | null;
};
