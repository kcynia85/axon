"use client";

import React from "react";
import { useResetPassword } from "../application/useResetPassword";
import { ResetPasswordView } from "./ResetPasswordView";

export const ResetPasswordForm = () => {
  const { form, onSubmit, loading, error, success } = useResetPassword();

  return (
    <ResetPasswordView 
      form={form} 
      onSubmit={onSubmit} 
      loading={loading} 
      error={error} 
      success={success} 
    />
  );
};
