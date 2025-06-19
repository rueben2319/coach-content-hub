
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: 'green' | 'blue' | 'purple' | 'red' | 'orange';
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
}

interface ModernStatsGridProps {
  stats: StatItem[];
  className?: string;
}

const ModernStatsGrid: React.FC<ModernStatsGridProps> = ({ stats, className }) => {
  const getIconColor = (color?: string) => {
    switch (color) {
      case 'green': return 'text-green-500';
      case 'blue': return 'text-blue-500';
      case 'purple': return 'text-purple-500';
      case 'red': return 'text-red-500';
      case 'orange': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn('modern-stats-grid', className)}>
      {stats.map((stat, index) => (
        <Card key={index} className="modern-stat-card">
          <CardContent className="modern-stat-content">
            <div className="modern-stat-header">
              <span className="modern-stat-title">{stat.title}</span>
              {stat.icon && (
                <stat.icon className={cn('modern-stat-icon', getIconColor(stat.color))} />
              )}
            </div>
            <div className="modern-stat-value">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModernStatsGrid;
