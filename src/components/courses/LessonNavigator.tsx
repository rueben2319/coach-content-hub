
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, Play, FileText, Volume2, Image, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseContent {
  id: string;
  title: string;
  content_type: 'video' | 'audio' | 'text' | 'pdf' | 'image' | 'interactive';
  duration?: number;
  sort_order: number;
  is_preview: boolean;
}

interface LessonNavigatorProps {
  content: CourseContent[];
  currentIndex: number;
  completedContent: Set<string>;
  onNavigate: (index: number) => void;
  canAccessContent: (index: number) => boolean;
}

const LessonNavigator: React.FC<LessonNavigatorProps> = ({
  content,
  currentIndex,
  completedContent,
  onNavigate,
  canAccessContent
}) => {
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'audio':
        return <Volume2 className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'interactive':
        return <Monitor className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const completed = content.filter(item => completedContent.has(item.id)).length;
    return (completed / content.length) * 100;
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Course Content</CardTitle>
        <div className="space-y-2">
          <Progress value={getProgressPercentage()} className="h-2" />
          <p className="text-sm text-gray-600">
            {completedContent.size} of {content.length} completed
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {content.map((item, index) => {
            const isCompleted = completedContent.has(item.id);
            const isCurrent = index === currentIndex;
            const canAccess = canAccessContent(index);
            const isLocked = !canAccess && !item.is_preview;

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  'w-full justify-start h-auto p-4 text-left',
                  isCurrent && 'bg-blue-50 border-l-4 border-l-blue-500',
                  isCompleted && 'bg-green-50',
                  isLocked && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => onNavigate(index)}
                disabled={isLocked}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className="flex-shrink-0 mt-1">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-500">
                          {index + 1}
                        </span>
                        {getContentIcon(item.content_type)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        'text-sm font-medium truncate',
                        isCurrent && 'text-blue-700',
                        isCompleted && 'text-green-700',
                        isLocked && 'text-gray-400'
                      )}>
                        {item.title}
                      </h4>
                      {item.is_preview && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 capitalize">
                        {item.content_type}
                      </span>
                      {item.duration && (
                        <span className="text-xs text-gray-500">
                          {formatDuration(item.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonNavigator;
