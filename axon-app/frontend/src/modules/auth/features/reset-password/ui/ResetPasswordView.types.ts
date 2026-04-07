import { UseFormReturn } from "react-hook-form";
import { ResetPasswordSchema } from "../domain/schema";

export type ResetPasswordViewProps = {
  readonly form: UseFormReturn<ResetPasswordSchema>;
  readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  readonly loading: boolean;
  readonly error: string | null;
  readonly success: boolean;
};
