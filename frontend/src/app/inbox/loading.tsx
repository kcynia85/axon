import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-xl bg-card">
             <Skeleton className="h-12 w-12 rounded-full" />
             <div className="space-y-2 flex-1 w-full">
               <Skeleton className="h-5 w-48" />
               <Skeleton className="h-4 w-2/3" />
             </div>
             <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
               <Skeleton className="h-9 w-24" />
               <Skeleton className="h-9 w-24" />
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}