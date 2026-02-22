import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { Button } from "@/shared/ui/ui/Button";
import { Plus, Layout } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/ui/Card";

export default function SpacesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Spaces"
        description="Manage your workspaces and canvas environments."
      >
        <Button asChild>
          <Link href="/spaces/new">
            <Plus className="mr-2 h-4 w-4" />
            New Space
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Example Space Card */}
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <span>Project Phoenix</span>
            </CardTitle>
            <CardDescription>Last edited 2 hours ago</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Main workspace for the Phoenix redesign project. Contains discovery and design zones.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/spaces/1">Open Canvas</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Placeholder for 'Create New' visual card */}
        <Card className="flex flex-col items-center justify-center border-dashed hover:bg-muted/50 transition-colors cursor-pointer min-h-[200px]" asChild>
           <Link href="/spaces/new" className="flex flex-col items-center justify-center h-full w-full">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="font-medium text-muted-foreground">Create New Space</span>
           </Link>
        </Card>

      </div>
    </PageContainer>
  );
}
