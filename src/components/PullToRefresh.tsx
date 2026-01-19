import { ReactNode, useCallback } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

const HexagonSpinner = ({ progress, isRefreshing }: { progress: number; isRefreshing: boolean }) => {
  const hexagons = [
    { delay: '0ms', x: 50, y: 15 },
    { delay: '100ms', x: 80, y: 32 },
    { delay: '200ms', x: 80, y: 68 },
    { delay: '300ms', x: 50, y: 85 },
    { delay: '400ms', x: 20, y: 68 },
    { delay: '500ms', x: 20, y: 32 },
    { delay: '600ms', x: 50, y: 50 },
  ];

  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {hexagons.map((hex, i) => {
          const shouldShow = isRefreshing || (i / hexagons.length) <= progress;
          return (
            <polygon
              key={i}
              points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-primary transition-all duration-300 origin-center ${
                isRefreshing ? 'animate-pulse' : ''
              }`}
              style={{
                transform: `translate(${hex.x - 50}px, ${hex.y - 50}px) scale(0.15)`,
                opacity: shouldShow ? 0.3 + (i / hexagons.length) * 0.7 : 0.1,
                animationDelay: hex.delay,
              }}
            />
          );
        })}
        
        {/* Center bee icon */}
        <g 
          className={`transition-all duration-300 ${isRefreshing ? 'animate-bounce' : ''}`}
          style={{ 
            opacity: isRefreshing ? 1 : progress,
            transform: `scale(${0.5 + progress * 0.5})`
          }}
        >
          {/* Bee body */}
          <ellipse cx="50" cy="50" rx="12" ry="10" className="fill-primary" />
          {/* Bee stripes */}
          <rect x="42" y="45" width="16" height="3" className="fill-background" />
          <rect x="42" y="52" width="16" height="3" className="fill-background" />
          {/* Bee wings */}
          <ellipse cx="38" cy="42" rx="8" ry="5" className="fill-primary/40" />
          <ellipse cx="62" cy="42" rx="8" ry="5" className="fill-primary/40" />
          {/* Bee head */}
          <circle cx="50" cy="38" r="6" className="fill-primary" />
          {/* Bee eyes */}
          <circle cx="47" cy="37" r="1.5" className="fill-background" />
          <circle cx="53" cy="37" r="1.5" className="fill-background" />
        </g>
      </svg>
      
      {isRefreshing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
            style={{ animationDuration: '1s' }}
          />
        </div>
      )}
    </div>
  );
};

const PullToRefresh = ({ children, onRefresh, className = '' }: PullToRefreshProps) => {
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
      style={{ touchAction: pullDistance > 0 ? 'none' : 'auto' }}
    >
      {/* Pull indicator */}
      <div 
        className="absolute left-0 right-0 flex flex-col items-center justify-end overflow-hidden z-50 pointer-events-none"
        style={{ 
          height: `${pullDistance}px`,
          top: 0,
          transition: isRefreshing ? 'none' : 'height 0.2s ease-out'
        }}
      >
        <div 
          className="flex flex-col items-center gap-2 pb-3"
          style={{
            transform: `translateY(${Math.max(0, 60 - pullDistance)}px)`,
            transition: 'transform 0.15s ease-out'
          }}
        >
          <HexagonSpinner progress={progress} isRefreshing={isRefreshing} />
          <span 
            className={`text-xs font-medium transition-all duration-200 ${
              shouldTrigger || isRefreshing ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {isRefreshing 
              ? 'Refreshing...' 
              : shouldTrigger 
                ? 'Release to refresh' 
                : 'Pull to refresh'
            }
          </span>
        </div>
      </div>

      {/* Content with transform */}
      <div 
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
