
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
  }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'hsl(var(--primary))',
    },
  };

  const formattedData = data.map(item => ({
    ...item,
    displayMonth: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend (Last 12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart data={formattedData}>
            <XAxis dataKey="displayMonth" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--color-revenue)" 
              fill="var(--color-revenue)" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
