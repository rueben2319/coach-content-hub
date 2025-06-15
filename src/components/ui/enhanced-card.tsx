
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  highlight?: boolean;
  gradient?: boolean;
  elevated?: boolean;
  asChild?: boolean;
}

export function EnhancedCard({
  children,
  className,
  interactive = false,
  highlight = false,
  gradient = false,
  elevated = false,
  ...props
}: EnhancedCardProps) {
  return (
    <Card
      {...props}
      className={cn(
        "transition-all duration-300 ease-out",
        interactive && "cursor-pointer hover:shadow-medium hover:-translate-y-1 hover:border-primary-200",
        highlight && "ring-2 ring-primary-200 bg-primary-50",
        gradient && "bg-gradient-to-br from-white to-primary-50 border-primary-100",
        elevated && "shadow-medium",
        "group",
        className
      )}
    >
      {children}
    </Card>
  );
}
