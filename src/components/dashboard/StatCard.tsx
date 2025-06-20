import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  maxValue?: number;
  trend: number;
  color: 'blue' | 'purple' | 'emerald' | 'rose';
}

const colorMap = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/20',
    badge: 'text-blue-600 bg-blue-50',
    hover: 'from-blue-500/5 to-blue-600/5',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/20',
    badge: 'text-purple-600 bg-purple-50',
    hover: 'from-purple-500/5 to-purple-600/5',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-500/20',
    badge: 'text-emerald-600 bg-emerald-50',
    hover: 'from-emerald-500/5 to-emerald-600/5',
  },
  rose: {
    gradient: 'from-rose-500 to-rose-600',
    shadow: 'shadow-rose-500/20',
    badge: 'text-rose-600 bg-rose-50',
    hover: 'from-rose-500/5 to-rose-600/5',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  maxValue,
  trend,
  color,
}) => {
  const colors = colorMap[color];

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.hover} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.shadow}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className={`flex items-center text-xs font-semibold ${colors.badge} rounded-full px-2.5 py-1`}>
            <svg
              className={`h-3.5 w-3.5 mr-1 ${trend >= 0 ? 'rotate-0' : 'rotate-180'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 6l-9.5 9.5-5-5L1 18" />
              <path d="M17 6h6v6" />
            </svg>
            <span>{trend >= 0 ? '+' : ''}{trend}%</span>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-600 mb-1.5">{title}</p>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            {maxValue !== undefined && maxValue !== -1 && (
              <span className="text-sm font-medium text-slate-500">/ {maxValue}</span>
            )}
          </div>
          <div className="text-xs text-slate-500 font-medium">vs last month</div>
        </div>
      </CardContent>
    </Card>
  );
};
