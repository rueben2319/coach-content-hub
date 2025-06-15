
import React, { useState, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  resistance?: number;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 60,
  resistance = 2.5
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStart = useRef<number | null>(null);
  const scrollElement = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scrollElement.current?.scrollTop === 0) {
      touchStart.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null || isRefreshing) return;

    const touchY = e.touches[0].clientY;
    const distance = touchY - touchStart.current;

    if (distance > 0 && scrollElement.current?.scrollTop === 0) {
      e.preventDefault();
      const adjustedDistance = distance / resistance;
      setPullDistance(adjustedDistance);
      setIsPulling(adjustedDistance > threshold);
    }
  }, [threshold, resistance, isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
    touchStart.current = null;
  }, [isPulling, isRefreshing, onRefresh]);

  const pullIndicatorHeight = Math.min(pullDistance, threshold);
  const rotation = isRefreshing ? 'animate-spin' : pullDistance > threshold ? 'rotate-180' : 'rotate-0';

  return (
    <div className="relative h-full overflow-hidden">
      {/* Pull indicator */}
      <div 
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 bg-blue-50 border-b border-blue-100',
          pullIndicatorHeight > 0 ? 'visible' : 'invisible'
        )}
        style={{ height: `${pullIndicatorHeight}px` }}
      >
        <div className={cn(
          'flex items-center space-x-2 text-blue-600 transition-transform duration-200',
          rotation
        )}>
          <RotateCcw className="h-5 w-5" />
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : isPulling ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={scrollElement}
        className="h-full overflow-auto transition-transform duration-200"
        style={{ transform: `translateY(${pullIndicatorHeight}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
