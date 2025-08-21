import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  blurDataURL?: string;
  priority?: boolean;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEwMCIgcj0iMjQiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+',
  blurDataURL,
  priority = false,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  return (
    <div className={cn('relative overflow-hidden', className)} ref={imgRef}>
      {/* Blur placeholder */}
      {!isLoaded && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
        />
      )}
      
      {/* Loading placeholder */}
      {!isLoaded && !blurDataURL && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Main image */}
      {isInView && (
        <img
          src={isError ? fallback : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;