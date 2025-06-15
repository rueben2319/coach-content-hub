
import React from 'react';
import { Loader2 } from 'lucide-react';

interface EnhancedLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'dots';
}

export function EnhancedLoading({ 
  message = "Loading...", 
  size = 'md',
  variant = 'spinner' 
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  if (variant === 'dots') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="flex space-x-2 justify-center mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-muted-foreground animate-pulse">{message}</p>
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className={`${sizeClasses[size]} bg-primary rounded-full mx-auto mb-4 animate-pulse`}></div>
          <p className="text-muted-foreground animate-pulse">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mx-auto mb-4`} />
        <p className="text-muted-foreground animate-fade-in">{message}</p>
      </div>
    </div>
  );
}
