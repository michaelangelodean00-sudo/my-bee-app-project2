import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:200%_100%] rounded-md transition-all duration-300", className)}
      {...props}
    />
  )
}

// Specialized skeleton components
function PostSkeleton() {
  return (
    <div className="bee-card p-4 mb-4 animate-fade-in">
      <div className="flex gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-3" />
      <Skeleton className="h-48 w-full rounded-lg mb-3" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

function TrendingItemSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg animate-fade-in">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

function BusinessCardSkeleton() {
  return (
    <div className="bee-card p-4 animate-fade-in">
      <Skeleton className="h-32 w-full rounded-lg mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-8 w-full rounded-md" />
    </div>
  )
}

export { Skeleton, PostSkeleton, TrendingItemSkeleton, BusinessCardSkeleton }
