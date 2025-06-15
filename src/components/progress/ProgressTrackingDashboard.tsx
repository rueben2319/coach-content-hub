
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Award, Target, BookOpen, Calendar } from 'lucide-react';
import { useLearningPaths } from '@/hooks/useLearningPaths';
import { useLearningStreaks } from '@/hooks/useLearningStreaks';
import { useLearningAnalytics } from '@/hooks/useLearningAnalytics';
import { useStudySessions } from '@/hooks/useStudySessions';

interface ProgressTrackingDashboardProps {
  userId?: string;
}

const ProgressTrackingDashboard: React.FC<ProgressTrackingDashboardProps> = ({ userId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  
  const { data: learningPaths, isLoading: pathsLoading } = useLearningPaths(userId);
  const { data: streaks, isLoading: streaksLoading } = useLearningStreaks(userId);
  const { data: analytics, isLoading: analyticsLoading } = useLearningAnalytics(userId);
  const { data: sessions, isLoading: sessionsLoading } = useStudySessions(userId);

  if (pathsLoading || streaksLoading || analyticsLoading || sessionsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading progress data...</div>
        </CardContent>
      </Card>
    );
  }

  const dailyStreak = streaks?.find(s => s.streak_type === 'daily');
  const recentAnalytics = analytics?.[0];
  const activePaths = learningPaths?.filter(path => !path.actual_completion_date);
  const completedPaths = learningPaths?.filter(path => path.actual_completion_date);

  // Prepare chart data
  const recentSessions = sessions?.slice(0, 7).reverse() || [];
  const sessionChartData = recentSessions.map((session, index) => ({
    day: `Day ${index + 1}`,
    duration: Math.round(session.duration / 60), // Convert to minutes
    focusScore: session.focus_score || 0
  }));

  const completionData = [
    { name: 'Completed', value: completedPaths?.length || 0, color: '#10b981' },
    { name: 'In Progress', value: activePaths?.length || 0, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Streak */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Current Streak</span>
            </div>
            <p className="text-2xl font-bold mt-2">{dailyStreak?.current_streak || 0} days</p>
            <p className="text-xs text-gray-500">Best: {dailyStreak?.longest_streak || 0} days</p>
          </CardContent>
        </Card>

        {/* Study Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Study Time</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {Math.round((recentAnalytics?.total_study_time || 0) / 60)}h
            </p>
            <p className="text-xs text-gray-500">This period</p>
          </CardContent>
        </Card>

        {/* Courses Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Courses</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {completedPaths?.length || 0}/{learningPaths?.length || 0}
            </p>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>

        {/* Engagement Score */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Engagement</span>
            </div>
            <p className="text-2xl font-bold mt-2">{recentAnalytics?.engagement_score || 0}%</p>
            <p className="text-xs text-gray-500">Score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
          <TabsTrigger value="progress">Course Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Activity</CardTitle>
                <CardDescription>Your study sessions over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sessionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="duration" fill="#3b82f6" name="Duration (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Completion</CardTitle>
                <CardDescription>Your overall progress</CardDescription>
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Study Sessions</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {new Date(session.started_at).toLocaleDateString()}
                        </span>
                        {session.session_quality && (
                          <Badge variant="outline">{session.session_quality}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Duration: {Math.round(session.duration / 60)} minutes
                        {session.focus_score && ` • Focus: ${session.focus_score}%`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{session.break_count} breaks</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Paths</CardTitle>
              <CardDescription>Your course journey and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPaths?.map((path) => (
                  <div key={path.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">Course {path.course_id}</span>
                        <Badge variant={path.actual_completion_date ? 'default' : 'secondary'}>
                          {path.actual_completion_date ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <Badge variant="outline">{path.learning_pace}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Started: {new Date(path.started_at).toLocaleDateString()}
                      {path.actual_completion_date && (
                        <> • Completed: {new Date(path.actual_completion_date).toLocaleDateString()}</>
                      )}
                    </p>
                    {path.notes && (
                      <p className="text-sm mt-2 p-2 bg-gray-50 rounded">{path.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Streaks & Achievements</CardTitle>
              <CardDescription>Your learning consistency and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {streaks?.map((streak) => (
                  <div key={streak.id} className="p-4 border rounded-lg text-center">
                    <div className="flex justify-center mb-2">
                      <Award className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="font-semibold capitalize">{streak.streak_type} Streak</h3>
                    <p className="text-2xl font-bold text-blue-600">{streak.current_streak}</p>
                    <p className="text-sm text-gray-500">
                      Best: {streak.longest_streak} • Total: {streak.total_activities}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTrackingDashboard;
