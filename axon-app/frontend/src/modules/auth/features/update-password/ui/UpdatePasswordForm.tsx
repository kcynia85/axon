"use client";

import React from "react";
import { useUpdatePassword } from "../application/useUpdatePassword";
import { UpdatePasswordView } from "./UpdatePasswordView";

export const UpdatePasswordForm = () => {
  const { form, onSubmit, loading, error, success } = useUpdatePassword();

  return (
    <UpdatePasswordView 
      form={form} 
      onSubmit={onSubmit} 
      loading={loading} 
      error={error} 
      success={success} 
    />
  );
};
