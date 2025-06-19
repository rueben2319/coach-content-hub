
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  className?: string;
  gradient?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  action,
  badge,
  className,
  gradient = false
}) => {
  return (
    <Card className={cn(
      'desktop-action-card group hover:shadow-xl transition-all duration-300 cursor-pointer',
      gradient && 'bg-gradient-to-br from-white to-gray-50/50',
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {badge && (
                <Badge variant={badge.variant || 'secondary'} className="mt-1">
                  {badge.label}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-base leading-relaxed mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className="w-full desktop-button-primary"
        >
          {action.label}
        </Button>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color,
  className
}) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' }
  };

  const colors = colorClasses[color];

  return (
    <Card className={cn('desktop-metric-card group hover:shadow-lg transition-all duration-300', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-3 rounded-xl', colors.icon)}>
            <Icon className={cn('w-6 h-6', colors.text)} />
          </div>
          {trend && (
            <div className={cn(
              'flex items-center text-xs font-medium px-2 py-1 rounded-full',
              trend.direction === 'up' ? 'text-green-600 bg-green-50' :
              trend.direction === 'down' ? 'text-red-600 bg-red-50' :
              'text-gray-600 bg-gray-50'
            )}>
              {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {trend.value}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <p className="text-xs text-gray-500">{trend.period}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  highlighted?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  features,
  icon: Icon,
  action,
  className,
  highlighted = false
}) => {
  return (
    <Card className={cn(
      'desktop-feature-card h-full transition-all duration-300',
      highlighted ? 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'hover:shadow-lg',
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className={cn(
            'p-3 rounded-xl',
            highlighted ? 'bg-blue-100' : 'bg-gray-100'
          )}>
            <Icon className={cn(
              'w-6 h-6',
              highlighted ? 'text-blue-600' : 'text-gray-600'
            )} />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            {highlighted && (
              <Badge className="mt-1 bg-blue-600">Recommended</Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"></div>
              {feature}
            </li>
          ))}
        </ul>
        
        {action && (
          <Button 
            onClick={action.onClick}
            className={cn(
              'w-full mt-6',
              highlighted ? 'desktop-button-primary' : 'desktop-button-secondary'
            )}
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
