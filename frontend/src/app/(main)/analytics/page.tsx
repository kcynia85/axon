import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { ChartNoAxesColumn, TrendingUp, Users, Target } from "lucide-react";

const AnalyticsPage = () => {
    return (
        <PageContainer>
            <PageHeader
                title="Analytics"
                description="Monitor performance, user engagement, and project progress."
            />
            <PageContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">+2 from last month</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold">2,350</div>
                            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold">84%</div>
                            <p className="text-xs text-muted-foreground">+4% from last week</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Insights Generated</CardTitle>
                            <ChartNoAxesColumn className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardHeader className="pt-0">
                            <div className="text-2xl font-bold">573</div>
                            <p className="text-xs text-muted-foreground">+201 since yesterday</p>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="min-h-[300px] flex items-center justify-center border-dashed">
                        <div className="text-center p-6">
                            <ChartNoAxesColumn className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Engagement Chart</h3>
                            <p className="text-sm text-muted-foreground">Visualization of user activity over time.</p>
                        </div>
                    </Card>
                    <Card className="min-h-[300px] flex items-center justify-center border-dashed">
                        <div className="text-center p-6">
                            <Target className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Project Progress</h3>
                            <p className="text-sm text-muted-foreground">Distribution of tasks across different statuses.</p>
                        </div>
                    </Card>
                </div>
            </PageContent>
        </PageContainer>
    );
};

export default AnalyticsPage;
