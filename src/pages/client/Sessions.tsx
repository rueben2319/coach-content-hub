
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, User, Plus, MapPin } from 'lucide-react';

const Sessions = () => {
  // Mock sessions data
  const upcomingSessions = [
    {
      id: '1',
      title: 'JavaScript Fundamentals Review',
      coach: {
        first_name: 'Sarah',
        last_name: 'Johnson'
      },
      scheduled_at: '2024-01-20T14:00:00Z',
      duration: 60,
      type: 'video_call',
      status: 'confirmed',
      meeting_url: 'https://meet.example.com/session1'
    },
    {
      id: '2',
      title: 'Career Guidance Session',
      coach: {
        first_name: 'Michael',
        last_name: 'Chen'
      },
      scheduled_at: '2024-01-22T16:30:00Z',
      duration: 45,
      type: 'video_call',
      status: 'pending',
      meeting_url: null
    }
  ];

  const pastSessions = [
    {
      id: '3',
      title: 'React Components Deep Dive',
      coach: {
        first_name: 'Emily',
        last_name: 'Rodriguez'
      },
      scheduled_at: '2024-01-15T13:00:00Z',
      duration: 90,
      type: 'video_call',
      status: 'completed',
      rating: 5,
      notes: 'Great session covering advanced React patterns and best practices.'
    },
    {
      id: '4',
      title: 'Portfolio Review',
      coach: {
        first_name: 'Sarah',
        last_name: 'Johnson'
      },
      scheduled_at: '2024-01-10T15:00:00Z',
      duration: 60,
      type: 'video_call',
      status: 'completed',
      rating: 4,
      notes: 'Received valuable feedback on my portfolio projects.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-2">Manage your coaching sessions and meetings</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Book Session
        </Button>
      </div>

      {/* Upcoming Sessions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => {
                const { date, time } = formatDateTime(session.scheduled_at);
                return (
                  <div key={session.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{session.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {session.coach.first_name} {session.coach.last_name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {time} ({formatDuration(session.duration)})
                          </div>
                        </div>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                        {session.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Video className="w-4 h-4" />
                        <span>Video Call</span>
                      </div>
                      <div className="flex space-x-2">
                        {session.status === 'confirmed' && session.meeting_url && (
                          <Button size="sm">
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No upcoming sessions scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {pastSessions.length > 0 ? (
            <div className="space-y-4">
              {pastSessions.map((session) => {
                const { date, time } = formatDateTime(session.scheduled_at);
                return (
                  <div key={session.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{session.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {session.coach.first_name} {session.coach.last_name}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDuration(session.duration)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.rating && renderStars(session.rating)}
                        <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {session.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{session.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No past sessions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sessions;
