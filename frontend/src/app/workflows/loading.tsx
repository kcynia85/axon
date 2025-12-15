import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl bg-card">
             <div className="flex items-center gap-4 w-full">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-64" />
                </div>
             </div>
             <div className="mt-4 md:mt-0">
                <Skeleton className="h-9 w-20" />
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}