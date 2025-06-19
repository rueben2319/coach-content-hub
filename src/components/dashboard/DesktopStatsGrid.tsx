
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  limit?: {
    current: number;
    max: number;
  };
}

interface DesktopStatsGridProps {
  stats: StatItem[];
  className?: string;
}

export const DesktopStatsGrid: React.FC<DesktopStatsGridProps> = ({ stats, className }) => {
  const getColorClasses = (color: StatItem['color']) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'bg-red-100' }
    };
    return colors[color];
  };

  const getTrendIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase': return TrendingUp;
      case 'decrease': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn('desktop-stats-grid', className)}>
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const TrendIcon = stat.change ? getTrendIcon(stat.change.type) : null;
        
        return (
          <Card key={index} className="desktop-stat-card group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('p-3 rounded-xl', colors.icon)}>
                    <stat.icon className={cn('w-6 h-6', colors.text)} />
                  </div>
                  {stat.limit && (
                    <Badge variant="outline" className="text-xs">
                      {stat.limit.current}/{stat.limit.max === -1 ? '∞' : stat.limit.max}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  
                  <div className="flex items-center justify-between">
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500">{stat.subtitle}</p>
                    )}
                    
                    {stat.change && TrendIcon && (
                      <div className={cn('flex items-center gap-1 text-xs font-medium', getTrendColor(stat.change.type))}>
                        <TrendIcon className="w-3 h-3" />
                        <span>{Math.abs(stat.change.value)}% {stat.change.period}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {stat.limit && stat.limit.max !== -1 && (
                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn('h-2 rounded-full transition-all duration-300', colors.bg)}
                      style={{ width: `${Math.min((stat.limit.current / stat.limit.max) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
