import { ReactNode, useCallback, memo, useRef, useState } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

// Simplified bee spinner
const BeeSpinner = memo(({ progress, isRefreshing }: { progress: number; isRefreshing: boolean }) => (
  <div className="relative w-10 h-10">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Bee body */}
      <ellipse 
        cx="50" cy="50" rx="12" ry="10" 
        className="fill-primary"
        style={{ opacity: 0.3 + progress * 0.7 }}
      />
      {/* Bee stripes */}
      <rect x="42" y="45" width="16" height="3" className="fill-background" style={{ opacity: progress }} />
      <rect x="42" y="52" width="16" height="3" className="fill-background" style={{ opacity: progress }} />
      {/* Bee wings */}
      <ellipse 
        cx="38" cy="42" rx="8" ry="5" 
        className={`fill-primary/40 ${isRefreshing ? 'animate-pulse' : ''}`}
      />
      <ellipse 
        cx="62" cy="42" rx="8" ry="5" 
        className={`fill-primary/40 ${isRefreshing ? 'animate-pulse' : ''}`}
      />
      {/* Bee head */}
      <circle cx="50" cy="38" r="6" className="fill-primary" style={{ opacity: 0.5 + progress * 0.5 }} />
    </svg>
    
    {isRefreshing && (
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    )}
  </div>
));

BeeSpinner.displayName = 'BeeSpinner';

const PullToRefresh = memo(({ children, onRefresh, className = '' }: PullToRefreshProps) => {
  const {
    containerRef,
    pullDistance,
    isRefreshing,
    progress,
    shouldTrigger
  } = usePullToRefresh({ onRefresh });

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ touchAction: pullDistance > 0 ? 'none' : 'auto', contain: 'layout' }}
    >
      {/* Pull indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute left-0 right-0 flex flex-col items-center justify-end overflow-hidden z-50 pointer-events-none"
          style={{ 
            height: `${pullDistance}px`,
            top: 0,
            transition: isRefreshing ? 'none' : 'height 0.15s ease-out'
          }}
        >
          <div className="flex flex-col items-center gap-1 pb-2">
            <BeeSpinner progress={progress} isRefreshing={isRefreshing} />
            <span 
              className={`text-xs font-medium transition-colors duration-150 ${
                shouldTrigger || isRefreshing ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {isRefreshing ? 'Refreshing...' : shouldTrigger ? 'Release' : 'Pull'}
            </span>
          </div>
        </div>
      )}

      {/* Content with transform */}
      <div 
        style={{ 
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : 'none',
          transition: isRefreshing ? 'none' : 'transform 0.15s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
});

PullToRefresh.displayName = 'PullToRefresh';

export default PullToRefresh;
