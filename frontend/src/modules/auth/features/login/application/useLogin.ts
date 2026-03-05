import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/shared/infrastructure/supabase/client";
import { loginSchema, LoginSchema } from "../domain/schema";

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginSchema) => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/home");
            router.refresh();
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        loading,
        error,
    };
};
