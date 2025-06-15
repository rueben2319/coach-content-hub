
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Coffee, BookOpen, Clock } from 'lucide-react';
import { useStartStudySession, useEndStudySession } from '@/hooks/useStudySessions';
import { useAuth } from '@/contexts/AuthContext';

interface StudySessionTrackerProps {
  courseId?: string;
  contentId?: string;
}

const StudySessionTracker: React.FC<StudySessionTrackerProps> = ({
  courseId,
  contentId
}) => {
  const { user } = useAuth();
  const [isStudying, setIsStudying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [focusScore, setFocusScore] = useState(100);
  const [activities, setActivities] = useState<any[]>([]);

  const startSessionMutation = useStartStudySession();
  const endSessionMutation = useEndStudySession();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStudying && !isPaused && sessionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        // Decrease focus score gradually if session is too long
        if (elapsed > 3600) { // After 1 hour
          setFocusScore(prev => Math.max(60, prev - 1));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStudying, isPaused, sessionStartTime]);

  const handleStartSession = async () => {
    if (!user) return;

    try {
      const sessionData = {
        user_id: user.id,
        course_id: courseId,
        content_id: contentId,
        activities: [],
        focus_score: 100,
        break_count: 0,
        session_quality: 'good' as const
      };

      const result = await startSessionMutation.mutateAsync(sessionData);
      setCurrentSessionId(result.id);
      setSessionStartTime(new Date());
      setIsStudying(true);
      setIsPaused(false);
      setElapsedTime(0);
      setBreakCount(0);
      setFocusScore(100);
      setActivities([]);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      // Resuming
      setIsPaused(false);
      setActivities(prev => [...prev, { type: 'resume', timestamp: new Date() }]);
    } else {
      // Pausing
      setIsPaused(true);
      setBreakCount(prev => prev + 1);
      setFocusScore(prev => Math.max(50, prev - 5)); // Slight penalty for breaks
      setActivities(prev => [...prev, { type: 'break', timestamp: new Date() }]);
    }
  };

  const handleEndSession = async () => {
    if (!currentSessionId) return;

    try {
      const sessionQuality = focusScore >= 80 ? 'excellent' : 
                           focusScore >= 60 ? 'good' : 
                           focusScore >= 40 ? 'fair' : 'poor';

      await endSessionMutation.mutateAsync({
        id: currentSessionId,
        duration: elapsedTime,
        activities,
        focus_score: focusScore,
        break_count: breakCount,
        session_quality: sessionQuality
      });

      // Reset state
      setIsStudying(false);
      setIsPaused(false);
      setSessionStartTime(null);
      setCurrentSessionId(null);
      setElapsedTime(0);
      setBreakCount(0);
      setFocusScore(100);
      setActivities([]);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getFocusColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Study Session Tracker
        </CardTitle>
        <CardDescription>
          Track your learning sessions and maintain focus
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Status */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-mono font-bold">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex justify-center gap-2">
            <Badge variant={isStudying ? 'default' : 'secondary'}>
              {isStudying ? (isPaused ? 'Paused' : 'Active') : 'Not Started'}
            </Badge>
            {isStudying && (
              <Badge variant="outline" className={getFocusColor(focusScore)}>
                Focus: {focusScore}%
              </Badge>
            )}
          </div>
        </div>

        {/* Focus Score Progress */}
        {isStudying && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Focus Score</span>
              <span className={getFocusColor(focusScore)}>{focusScore}%</span>
            </div>
            <Progress value={focusScore} className="h-2" />
          </div>
        )}

        {/* Session Stats */}
        {isStudying && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                <Coffee className="h-4 w-4" />
                Breaks
              </div>
              <div className="text-xl font-bold">{breakCount}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Active Time
              </div>
              <div className="text-xl font-bold">
                {formatTime(elapsedTime - (breakCount * 300))} {/* Estimate 5min per break */}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {!isStudying ? (
            <Button 
              onClick={handleStartSession} 
              disabled={startSessionMutation.isPending}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Session
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handlePauseResume}
                className="flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    Break
                  </>
                )}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleEndSession}
                disabled={endSessionMutation.isPending}
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                End Session
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>💡 Take breaks every 25-50 minutes for optimal focus</p>
          <p>🎯 Minimize distractions to maintain high focus score</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySessionTracker;
