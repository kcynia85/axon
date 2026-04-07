import { UseFormReturn } from "react-hook-form";
import { SignupSchema } from "../domain/schema";

export type SignupViewProps = {
  readonly form: UseFormReturn<SignupSchema>;
  readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  readonly loading: boolean;
  readonly error: string | null;
  readonly success: boolean;
};
