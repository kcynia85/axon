import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/shared/ui/layout/page-container";

const Loading = () => {
  return (
    <PageContainer>
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col gap-4 p-6 border rounded-xl bg-card h-[200px]">
             <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
             </div>
             <div className="mt-auto pt-4 flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
             </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default Loading;