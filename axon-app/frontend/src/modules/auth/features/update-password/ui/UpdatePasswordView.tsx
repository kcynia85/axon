import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/ui/Form";
import { UpdatePasswordViewProps } from "./UpdatePasswordView.types";

export const UpdatePasswordView = ({ form, onSubmit, loading, error, success }: UpdatePasswordViewProps) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600 font-medium">Password updated successfully! Redirecting to dashboard...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading} loading={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
