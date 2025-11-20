import { Skeleton } from "@/components/ui/skeleton";

export const CatCardSkeleton = () => {
  return (
    <div className="rounded-3xl overflow-hidden shadow-soft">
      <div className="relative">
        {/* Image skeleton */}
        <Skeleton className="w-full aspect-[3/4] rounded-t-3xl" />
        
        {/* Content skeleton */}
        <div className="p-6 space-y-5 py-[30px]">
          <div className="space-y-4">
            {/* Name skeleton */}
            <Skeleton className="h-9 w-3/4" />
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            
            {/* Age and gender badges skeleton */}
            <div className="flex gap-3">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>

          {/* Traits skeleton */}
          <div className="space-y-3 p-5 rounded-2xl bg-muted/50">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/6" />
          </div>

          {/* Price section skeleton */}
          <div className="pt-6 space-y-4">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-12 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex gap-2 mt-8">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
