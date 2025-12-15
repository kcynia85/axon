import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b p-4 px-6 bg-muted/10">
        <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-hidden">
         <div className="flex justify-end"><Skeleton className="h-14 w-1/2 rounded-xl rounded-tr-none" /></div>
         <div className="flex justify-start"><Skeleton className="h-24 w-2/3 rounded-xl rounded-tl-none" /></div>
         <div className="flex justify-end"><Skeleton className="h-14 w-1/3 rounded-xl rounded-tr-none" /></div>
      </div>
      <div className="p-4 border-t bg-background">
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    </div>
  )
}
