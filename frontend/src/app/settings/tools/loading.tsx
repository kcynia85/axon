import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
           <div key={i} className="flex flex-col border rounded-xl p-6 bg-card h-[220px]">
              <div className="flex justify-between items-start mb-4">
                 <Skeleton className="h-10 w-10 rounded-lg" />
                 <Skeleton className="h-4 w-4" />
              </div>
              <div className="space-y-2 flex-1">
                 <Skeleton className="h-6 w-32" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-auto pt-4 flex justify-between items-center border-t">
                 <div className="flex gap-2 items-center">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                 </div>
                 <Skeleton className="h-8 w-20" />
              </div>
           </div>
        ))}
      </div>
    </div>
  )
}
