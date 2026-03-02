import React from "react";
import { Space } from "../domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { Layout } from "lucide-react";
import Link from "next/link";

type SpaceCardProps = {
    readonly space: Space;
}

export const SpaceCard = ({ space }: SpaceCardProps) => {
    return (
        <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Layout className="h-5 w-5 text-primary" />
              <span>{space.name}</span>
            </CardTitle>
            <CardDescription className="text-zinc-400 font-medium">{space.lastEdited}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {space.description}
            </p>
          </CardContent>
          <CardFooter className="pt-4 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 mt-auto">
            <Button variant="outline" className="w-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors" asChild>
              <Link href={`/spaces/${space.id}`}>Open Canvas</Link>
            </Button>
          </CardFooter>
        </Card>
    );
};
