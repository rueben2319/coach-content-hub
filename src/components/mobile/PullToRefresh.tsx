
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  pullThreshold?: number;
  refreshing?: boolean;
}

export function PullToRefresh({
  children,
  onRefresh,
  pullThreshold = 80,
  refreshing = false
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isPulling, setIsPulling] = React.useState(false);
  const [startY, setStartY] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop !== 0 || refreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(diff, pullThreshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= pullThreshold && !refreshing) {
      await onRefresh();
    }
    
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  const pullPercentage = Math.min(pullDistance / pullThreshold, 1);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-300 z-10",
          "bg-gradient-to-b from-gray-50 to-transparent",
          isPulling || refreshing ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          height: Math.max(pullDistance, refreshing ? 60 : 0),
          transform: `translateY(${refreshing ? 0 : -20}px)`
        }}
      >
        <div className="flex items-center space-x-2 text-gray-600">
          <RefreshCw 
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              refreshing ? "animate-spin" : "",
              pullPercentage >= 1 ? "rotate-180" : `rotate-${Math.floor(pullPercentage * 180)}`
            )}
          />
          <span className="text-sm font-medium">
            {refreshing ? 'Refreshing...' : pullPercentage >= 1 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div 
        style={{ 
          transform: `translateY(${isPulling ? pullDistance : refreshing ? 60 : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}
