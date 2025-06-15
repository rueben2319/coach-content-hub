
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TouchOptimizedCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

const TouchOptimizedCard: React.FC<TouchOptimizedCardProps> = ({
  title,
  description,
  children,
  className,
  onTap,
  variant = 'default'
}) => {
  const cardVariants = {
    default: 'transition-all duration-200 active:scale-[0.98]',
    elevated: 'shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]',
    outlined: 'border-2 transition-all duration-200 active:scale-[0.98] active:border-blue-300'
  };

  return (
    <Card 
      className={cn(
        cardVariants[variant],
        onTap && 'cursor-pointer touch-manipulation',
        'min-h-[44px]', // Minimum touch target size
        className
      )}
      onClick={onTap}
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm md:text-base">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default TouchOptimizedCard;
