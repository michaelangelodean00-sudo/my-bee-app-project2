import LoadingSpinner from "./LoadingSpinner";
import { PostSkeleton } from "@/components/ui/skeleton";

interface PageLoaderProps {
  type?: "full" | "content" | "posts";
  message?: string;
}

const PageLoader = ({ type = "content", message = "Loading..." }: PageLoaderProps) => {
  if (type === "full") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center space-y-4 animate-content-fade-in">
          <LoadingSpinner size="xl" variant="pulse" />
          <p className="text-lg font-medium text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  if (type === "posts") {
    return (
      <div className="space-y-4 animate-stagger-fade">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="animate-stagger-fade"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <PostSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 animate-content-fade-in">
      <LoadingSpinner size="lg" text={message} variant="dots" />
    </div>
  );
};

export default PageLoader;