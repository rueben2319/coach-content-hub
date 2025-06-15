
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InteractiveButtonProps extends ButtonProps {
  icon?: LucideIcon;
  loading?: boolean;
  success?: boolean;
  pulseOnHover?: boolean;
  scaleOnClick?: boolean;
}

export function InteractiveButton({
  children,
  icon: Icon,
  loading = false,
  success = false,
  pulseOnHover = false,
  scaleOnClick = true,
  className,
  disabled,
  ...props
}: InteractiveButtonProps) {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (scaleOnClick) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
    }
    if (props.onClick && !disabled && !loading) {
      props.onClick(e);
    }
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        pulseOnHover && "hover:animate-pulse",
        scaleOnClick && isClicked && "scale-95",
        success && "bg-success-500 hover:bg-success-600 text-white",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {Icon && !loading && <Icon className="w-4 h-4" />}
        <span className={cn(loading && "opacity-70")}>{children}</span>
      </div>
      
      {/* Ripple effect */}
      {scaleOnClick && (
        <div className="absolute inset-0 bg-white bg-opacity-20 scale-0 rounded-full transition-transform duration-300 pointer-events-none" />
      )}
    </Button>
  );
}
