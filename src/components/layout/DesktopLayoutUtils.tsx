
import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const DesktopContainer: React.FC<DesktopContainerProps> = ({
  children,
  className,
  size = 'xl'
}) => {
  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  };

  return (
    <div className={cn('mx-auto px-8 py-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
};

interface DesktopGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const DesktopGrid: React.FC<DesktopGridProps> = ({
  children,
  className,
  cols = 3,
  gap = 'lg',
  responsive = true
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: responsive ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4' : 'grid-cols-4',
    5: responsive ? 'grid-cols-1 lg:grid-cols-3 xl:grid-cols-5' : 'grid-cols-5',
    6: responsive ? 'grid-cols-1 lg:grid-cols-3 xl:grid-cols-6' : 'grid-cols-6'
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10'
  };

  return (
    <div className={cn('grid', colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
};

interface DesktopCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  elevated?: boolean;
  gradient?: boolean;
}

export const DesktopCard: React.FC<DesktopCardProps> = ({
  children,
  className,
  interactive = false,
  elevated = false,
  gradient = false
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-gray-200/60 transition-all duration-300',
        interactive && 'hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 cursor-pointer',
        elevated && 'shadow-lg',
        gradient && 'bg-gradient-to-br from-white to-gray-50/50',
        'desktop-card',
        className
      )}
    >
      {children}
    </div>
  );
};

interface DesktopSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DesktopSection: React.FC<DesktopSectionProps> = ({
  children,
  title,
  subtitle,
  className,
  spacing = 'lg'
}) => {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || subtitle) && (
        <div className="desktop-section-header">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 mt-2 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
