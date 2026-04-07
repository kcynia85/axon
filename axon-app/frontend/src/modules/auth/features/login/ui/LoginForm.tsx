"use client";

import React from "react";
import { useLogin } from "../application/useLogin";
import { LoginView } from "./LoginView";

export const LoginForm = () => {
    const { form, onSubmit, loading, error } = useLogin();

    return (
        <LoginView 
            form={form} 
            onSubmit={onSubmit} 
            loading={loading} 
            error={error} 
        />
    );
};
