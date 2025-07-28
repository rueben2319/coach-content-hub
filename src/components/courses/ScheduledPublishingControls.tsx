
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ScheduledPublishingControlsProps {
  courseId?: string;
  contentId?: string;
  currentSchedule?: {
    scheduled_publish_at?: string;
    auto_publish?: boolean;
    publish_status?: string;
  };
  onScheduleUpdate?: () => void;
}

const ScheduledPublishingControls: React.FC<ScheduledPublishingControlsProps> = ({
  courseId,
  contentId,
  currentSchedule,
  onScheduleUpdate
}) => {
  const { toast } = useToast();
  const [scheduledDate, setScheduledDate] = useState(
    currentSchedule?.scheduled_publish_at 
      ? new Date(currentSchedule.scheduled_publish_at).toISOString().slice(0, 16)
      : ''
  );
  const [autoPublish, setAutoPublish] = useState(currentSchedule?.auto_publish || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedulePublish = async () => {
    if (!scheduledDate) return;

    setIsLoading(true);
    try {
      const table = courseId ? 'courses' : 'modules';
      const id = courseId || contentId;
      
      const updateData: any = {
        scheduled_publish_at: scheduledDate,
        auto_publish: autoPublish,
      };

      if (courseId) {
        updateData.publish_status = 'scheduled';
      }

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Publishing scheduled',
        description: `Content will be published on ${new Date(scheduledDate).toLocaleString()}`,
      });

      onScheduleUpdate?.();
    } catch (error: any) {
      toast({
        title: 'Error scheduling publish',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSchedule = async () => {
    setIsLoading(true);
    try {
      const table = courseId ? 'courses' : 'modules';
      const id = courseId || contentId;
      
      const updateData: any = {
        scheduled_publish_at: null,
        auto_publish: false,
      };

      if (courseId) {
        updateData.publish_status = 'draft';
      }

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Scheduled publishing cancelled' });
      setScheduledDate('');
      setAutoPublish(false);
      onScheduleUpdate?.();
    } catch (error: any) {
      toast({
        title: 'Error cancelling schedule',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Scheduled Publishing
        </CardTitle>
        <CardDescription>
          Schedule when this content should be automatically published
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="schedule-date">Publish Date & Time</Label>
          <Input
            id="schedule-date"
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="auto-publish"
            checked={autoPublish}
            onCheckedChange={setAutoPublish}
          />
          <Label htmlFor="auto-publish">Enable automatic publishing</Label>
        </div>

        {currentSchedule?.scheduled_publish_at && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Currently scheduled for:</span>
            </div>
            <p className="text-blue-600 mt-1">
              {new Date(currentSchedule.scheduled_publish_at).toLocaleString()}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSchedulePublish}
            disabled={!scheduledDate || isLoading}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            {currentSchedule?.scheduled_publish_at ? 'Update Schedule' : 'Schedule Publish'}
          </Button>
          
          {currentSchedule?.scheduled_publish_at && (
            <Button
              variant="outline"
              onClick={handleCancelSchedule}
              disabled={isLoading}
            >
              Cancel Schedule
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledPublishingControls;
