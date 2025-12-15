import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col border rounded-xl p-6 bg-card h-[280px]">
             <div className="flex justify-between mb-4">
                <div className="flex gap-3">
                   <Skeleton className="h-10 w-10 rounded-lg" />
                   <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-20" />
                   </div>
                </div>
                <Skeleton className="h-4 w-4" />
             </div>
             <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 mt-4">
                   <Skeleton className="h-5 w-16 rounded-full" />
                   <Skeleton className="h-5 w-16 rounded-full" />
                   <Skeleton className="h-5 w-16 rounded-full" />
                </div>
             </div>
             <div className="mt-4 pt-4 border-t">
                <Skeleton className="h-9 w-full" />
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
