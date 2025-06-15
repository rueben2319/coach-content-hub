
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, Bug, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackData {
  type: 'bug' | 'feature' | 'general';
  rating?: number;
  message: string;
  userAgent: string;
  url: string;
  timestamp: string;
}

export function UserFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      type: feedbackType,
      rating: feedbackType === 'general' ? rating : undefined,
      message,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    try {
      // In a real implementation, this would send to your feedback API
      console.log('Feedback submitted:', feedbackData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setMessage('');
        setRating(0);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { id: 'general', label: 'General', icon: MessageSquare, description: 'General feedback' },
    { id: 'bug', label: 'Bug Report', icon: Bug, description: 'Report a problem' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, description: 'Suggest an improvement' }
  ] as const;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg md:bottom-4"
        size="lg"
        aria-label="Give feedback"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        Feedback
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 z-50 w-80 shadow-xl md:bottom-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Send Feedback</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close feedback"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="text-green-600 mb-2">✓</div>
            <p className="text-sm text-green-600">Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback Type</label>
              <div className="grid grid-cols-1 gap-2">
                {feedbackTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id)}
                    className={cn(
                      "flex items-center p-3 rounded-lg border text-left transition-colors",
                      feedbackType === type.id
                        ? "border-primary bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <type.icon className="w-4 h-4 mr-3" />
                    <div>
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating for general feedback */}
            {feedbackType === 'general' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={cn(
                        "p-1 rounded",
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      )}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="feedback-message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more about your experience..."
                required
                className="min-h-[80px]"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
