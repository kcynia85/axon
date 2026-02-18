"use client";

import { useWorkspaces } from "../application/use-workspaces";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import Link from "next/link";

export const WorkspacesList = () => {
  const { data: workspaces, isLoading, isError } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-40">
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
      {workspaces.map((ws) => (
        <Link key={ws.id} href={`/workspaces/${ws.id}`} className="block h-full">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle>{ws.name}</CardTitle>
              <CardDescription>{ws.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Updated: {new Date(ws.updatedAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
