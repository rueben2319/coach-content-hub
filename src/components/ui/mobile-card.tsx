
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  touchOptimized?: boolean;
  swipeable?: boolean;
  pullToRefresh?: boolean;
}

export function MobileCard({
  children,
  className,
  touchOptimized = true,
  swipeable = false,
  pullToRefresh = false,
  ...props
}: MobileCardProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right' | null>(null);

  const handleTouchStart = () => {
    if (touchOptimized) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (touchOptimized) {
      setIsPressed(false);
    }
  };

  return (
    <Card
      {...props}
      className={cn(
        "transition-all duration-200 ease-out",
        touchOptimized && [
          "active:scale-[0.98] active:shadow-sm",
          "min-h-[44px]", // iOS touch target minimum
          "touch-manipulation", // Optimize for touch
        ],
        isPressed && "scale-[0.98] shadow-sm",
        swipeable && "cursor-grab active:cursor-grabbing",
        swipeDirection === 'left' && "translate-x-[-10px]",
        swipeDirection === 'right' && "translate-x-[10px]",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </Card>
  );
}
