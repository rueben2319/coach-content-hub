
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Clock, BookOpen, Award, CheckCircle } from 'lucide-react';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
  currency: string;
}

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onEnrollmentComplete?: () => void;
}

export const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  open,
  onOpenChange,
  course,
  onEnrollmentComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const enrollmentMutation = useCourseEnrollment();

  const handleEnroll = async () => {
    setIsProcessing(true);
    
    try {
      await enrollmentMutation.mutateAsync({
        course_id: course.id,
        amount: course.price,
        currency: course.currency,
      });
      
      // In a real implementation, you would redirect to payment processor here
      // For now, we'll simulate successful payment
      setTimeout(() => {
        setIsProcessing(false);
        onOpenChange(false);
        onEnrollmentComplete?.();
      }, 2000);
      
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Enroll in Course
          </DialogTitle>
          <DialogDescription>
            Complete your enrollment to get full access to this course
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Course Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>by {course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <div className="space-y-3">
            <h4 className="font-medium">What's included:</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Full lifetime access to course content</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Progress tracking and certificates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Access on all devices</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Download materials for offline viewing</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Total</span>
              <div className="text-2xl font-bold">
                {course.currency} {course.price}
              </div>
            </div>
            <Badge variant="secondary">One-time payment</Badge>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEnroll}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Enroll Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
