
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye, Clock, Users, TrendingUp } from 'lucide-react';
import { useContentAnalytics } from '@/hooks/useContentAnalytics';

interface ContentAnalyticsDashboardProps {
  contentId?: string;
  courseId?: string;
}

const ContentAnalyticsDashboard: React.FC<ContentAnalyticsDashboardProps> = ({
  contentId,
  courseId
}) => {
  const { data: analytics, isLoading } = useContentAnalytics(contentId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics || analytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Content Analytics
          </CardTitle>
          <CardDescription>Track how users interact with your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No analytics data available yet. Data will appear once users start viewing your content.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary metrics
  const totalViews = analytics.length;
  const averageViewDuration = Math.round(
    analytics.reduce((sum, item) => sum + item.view_duration, 0) / analytics.length
  );
  const averageCompletion = Math.round(
    analytics.reduce((sum, item) => sum + item.completion_percentage, 0) / analytics.length
  );
  const totalInteractions = analytics.reduce((sum, item) => sum + item.interactions_count, 0);

  // Prepare chart data
  const completionData = [
    { name: '0-25%', value: analytics.filter(a => a.completion_percentage <= 25).length },
    { name: '26-50%', value: analytics.filter(a => a.completion_percentage > 25 && a.completion_percentage <= 50).length },
    { name: '51-75%', value: analytics.filter(a => a.completion_percentage > 50 && a.completion_percentage <= 75).length },
    { name: '76-100%', value: analytics.filter(a => a.completion_percentage > 75).length },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Content Analytics
          </CardTitle>
          <CardDescription>Track how users interact with your content</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Views</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{totalViews}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Avg Duration</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{averageViewDuration}s</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Avg Completion</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{averageCompletion}%</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Interactions</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{totalInteractions}</p>
            </div>
          </div>

          {/* Completion rate chart */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completion Rate Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {analytics.slice(0, 10).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.completion_percentage}% complete
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.last_viewed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.view_duration}s</p>
                        <p className="text-xs text-gray-500">{item.interactions_count} interactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentAnalyticsDashboard;
