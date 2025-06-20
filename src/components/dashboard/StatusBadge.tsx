import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
  icon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  children,
  className = '',
  icon = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-50 text-red-700 hover:bg-red-100 transition-colors border-red-200/50';
      case 'outline':
        return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border-emerald-200/50';
      default:
        return '';
    }
  };

  return (
    <Badge
      variant={variant}
      className={`py-1.5 px-3 text-sm font-medium ${getVariantClasses()} ${className}`}
    >
      {icon && <AlertTriangle className="h-4 w-4 mr-2" />}
      {children}
    </Badge>
  );
};

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { label: 'Active', variant: 'default' as const },
    trial: { label: 'Trial', variant: 'secondary' as const },
    expired: { label: 'Expired', variant: 'destructive' as const },
    inactive: { label: 'Inactive', variant: 'destructive' as const },
  };
  
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
};
