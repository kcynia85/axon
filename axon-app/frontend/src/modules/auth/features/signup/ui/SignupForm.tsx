"use client";

import React from "react";
import { useSignup } from "../application/useSignup";
import { SignupView } from "./SignupView";

export const SignupForm = () => {
  const { form, onSubmit, loading, error, success } = useSignup();

  return (
    <SignupView 
      form={form} 
      onSubmit={onSubmit} 
      loading={loading} 
      error={error} 
      success={success} 
    />
  );
};
