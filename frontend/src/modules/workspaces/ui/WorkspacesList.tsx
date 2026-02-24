"use client";

import { useWorkspaces } from "../application/useWorkspaces";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import Link from "next/link";

export const WorkspacesList = () => {
  const { data: workspaces, isLoading, isError } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="h-40">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !workspaces) {
    return <div className="text-red-500">Failed to load workspaces.</div>;
  }

  if (workspaces.length === 0) {
    return <div className="text-muted-foreground">No workspaces found. Create one to get started.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map(({ id, name, description, updated_at }) => (
        <Link key={id} href={`/workspaces/${id}`} className="block h-full">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Updated: {updated_at ? new Date(updated_at).toLocaleDateString() : "—"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
