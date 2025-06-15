
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useStartTrial } from '@/hooks/useSubscriptionManagement';
import { CoachSubscription } from '@/types/subscription';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface TrialStatusCardProps {
  subscription?: CoachSubscription | null;
  onUpgrade: () => void;
}

const TrialStatusCard: React.FC<TrialStatusCardProps> = ({
  subscription,
  onUpgrade,
}) => {
  const startTrial = useStartTrial();

  const handleStartTrial = () => {
    startTrial.mutate();
  };

  // If no subscription, show trial offer
  if (!subscription) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Sparkles className="w-5 h-5" />
            Start Your Free Trial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Get full access to all features for 14 days, completely free. No credit card required.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Calendar className="w-4 h-4" />
              <span>14 days full access</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Clock className="w-4 h-4" />
              <span>No commitment</span>
            </div>
          </div>

          <Button 
            onClick={handleStartTrial} 
            disabled={startTrial.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {startTrial.isPending ? 'Starting Trial...' : 'Start Free Trial'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If trial subscription, show trial status
  if (subscription.is_trial && subscription.trial_ends_at) {
    const trialEndDate = new Date(subscription.trial_ends_at);
    const now = new Date();
    const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = 14;
    const daysUsed = totalDays - daysLeft;
    const progressPercentage = (daysUsed / totalDays) * 100;

    return (
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-orange-800">
              <Clock className="w-5 h-5" />
              Trial Progress
            </span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {daysLeft} days left
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-orange-700">Days used</span>
              <span className="text-orange-800 font-medium">{daysUsed} / {totalDays}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <p className="text-sm text-orange-700">
            Your trial ends on {trialEndDate.toLocaleDateString()}. 
            {daysLeft <= 3 && ' Upgrade now to continue enjoying all features!'}
          </p>

          {daysLeft <= 7 && (
            <Button 
              onClick={onUpgrade} 
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Upgrade to Pro
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default TrialStatusCard;
