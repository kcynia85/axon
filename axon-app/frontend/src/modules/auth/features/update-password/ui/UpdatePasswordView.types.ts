import { UseFormReturn } from "react-hook-form";
import { UpdatePasswordSchema } from "../domain/schema";

export type UpdatePasswordViewProps = {
  readonly form: UseFormReturn<UpdatePasswordSchema>;
  readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  readonly loading: boolean;
  readonly error: string | null;
  readonly success: boolean;
};
