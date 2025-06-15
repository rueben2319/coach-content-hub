
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, TrendingUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileLearningPathCardProps {
  path: {
    id: string;
    course_id: string;
    learning_pace: 'slow' | 'normal' | 'fast';
    started_at: string;
    estimated_completion_date?: string;
    actual_completion_date?: string;
    progress?: number;
    notes?: string;
  };
  onContinue: (pathId: string) => void;
  onEdit: (pathId: string) => void;
}

const MobileLearningPathCard: React.FC<MobileLearningPathCardProps> = ({
  path,
  onContinue,
  onEdit
}) => {
  const isCompleted = !!path.actual_completion_date;
  const progress = path.progress || Math.floor(Math.random() * 100); // Mock progress

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'slow': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'fast': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn(
      'transition-all duration-200 active:scale-[0.98]',
      isCompleted ? 'border-green-200 bg-green-50/30' : 'border-blue-200'
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">Course {path.course_id}</h3>
              {isCompleted && <TrendingUp className="h-4 w-4 text-green-600" />}
            </div>
            <Badge className={getPaceColor(path.learning_pace)}>
              {path.learning_pace}
            </Badge>
          </div>

          {/* Progress */}
          {!isCompleted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Started: {new Date(path.started_at).toLocaleDateString()}</span>
            </div>
            {path.estimated_completion_date && !isCompleted && (
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Target: {new Date(path.estimated_completion_date).toLocaleDateString()}</span>
              </div>
            )}
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>Completed: {new Date(path.actual_completion_date!).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          {path.notes && (
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{path.notes}</p>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            {!isCompleted && (
              <Button 
                onClick={() => onContinue(path.id)}
                className="flex-1 flex items-center justify-center space-x-2"
                size="sm"
              >
                <Play className="h-4 w-4" />
                <span>Continue</span>
              </Button>
            )}
            <Button 
              onClick={() => onEdit(path.id)}
              variant="outline"
              size="sm"
              className={!isCompleted ? 'flex-1' : 'w-full'}
            >
              {isCompleted ? 'View Details' : 'Edit'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileLearningPathCard;
