
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SwipeableListItem {
  id: string;
  content: React.ReactNode;
  actions?: {
    left?: { icon: React.ReactNode; action: () => void; color?: string; };
    right?: { icon: React.ReactNode; action: () => void; color?: string; };
  };
}

interface SwipeableListProps {
  items: SwipeableListItem[];
  className?: string;
}

const SwipeableList: React.FC<SwipeableListProps> = ({ items, className }) => {
  const [swipedItem, setSwipedItem] = useState<string | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent, itemId: string) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  };

  const handleTouchEnd = (itemId: string) => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    if (!isVerticalSwipe) {
      if (isLeftSwipe || isRightSwipe) {
        setSwipedItem(swipedItem === itemId ? null : itemId);
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div 
          key={item.id}
          className="relative overflow-hidden bg-white rounded-lg border"
        >
          {/* Action buttons background */}
          {swipedItem === item.id && (
            <div className="absolute inset-y-0 right-0 flex">
              {item.actions?.right && (
                <button
                  onClick={item.actions.right.action}
                  className={cn(
                    'flex items-center justify-center w-16 text-white transition-colors',
                    item.actions.right.color || 'bg-red-500 hover:bg-red-600'
                  )}
                >
                  {item.actions.right.icon}
                </button>
              )}
            </div>
          )}

          {/* Main content */}
          <div
            className={cn(
              'bg-white transition-transform duration-200 touch-manipulation',
              swipedItem === item.id && 'transform -translate-x-16'
            )}
            onTouchStart={(e) => handleTouchStart(e, item.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(item.id)}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SwipeableList;
