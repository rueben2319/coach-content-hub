
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useManageSubscription } from '@/hooks/useSubscriptionManagement';
import { CoachSubscription } from '@/types/subscription';
import { SUBSCRIPTION_TIERS, getTierById } from '@/config/subscriptionTiers';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SubscriptionManagementCardProps {
  subscription: CoachSubscription;
}

const SubscriptionManagementCard: React.FC<SubscriptionManagementCardProps> = ({
  subscription,
}) => {
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [cancellationReason, setCancellationReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState<'immediate' | 'end_of_period'>('end_of_period');

  const manageSubscription = useManageSubscription();
  const currentTier = getTierById(subscription.tier);

  const handleUpgrade = () => {
    if (!selectedTier) return;
    
    const action = SUBSCRIPTION_TIERS.findIndex(t => t.id === selectedTier) > 
                  SUBSCRIPTION_TIERS.findIndex(t => t.id === subscription.tier) ? 'upgrade' : 'downgrade';

    manageSubscription.mutate({
      action,
      newTier: selectedTier,
      newBillingCycle: selectedBillingCycle,
    }, {
      onSuccess: () => {
        setUpgradeDialogOpen(false);
        setSelectedTier('');
      }
    });
  };

  const handleCancel = () => {
    if (!cancellationReason.trim()) return;

    manageSubscription.mutate({
      action: 'cancel',
      cancellationReason,
      effectiveDate,
    }, {
      onSuccess: () => {
        setCancelDialogOpen(false);
        setCancellationReason('');
      }
    });
  };

  const handleReactivate = () => {
    manageSubscription.mutate({
      action: 'reactivate',
    });
  };

  const getStatusInfo = () => {
    switch (subscription.status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Active'
        };
      case 'trial':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Calendar className="w-4 h-4" />,
          label: 'Trial'
        };
      case 'expired':
      case 'inactive':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="w-4 h-4" />,
          label: subscription.status === 'expired' ? 'Expired' : 'Canceled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertTriangle className="w-4 h-4" />,
          label: subscription.status
        };
    }
  };

  const statusInfo = getStatusInfo();
  const isActive = subscription.status === 'active' || subscription.status === 'trial';
  const isCanceled = subscription.canceled_at && !subscription.auto_renew;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Management
          </span>
          <Badge className={`${statusInfo.color} flex items-center gap-1`}>
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">Current Plan</span>
            <span className="text-lg font-semibold">{currentTier?.name || subscription.tier}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price</span>
            <span>{subscription.currency} {subscription.price}/{subscription.billing_cycle}</span>
          </div>

          {subscription.next_billing_date && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Next Billing</span>
              <span>{new Date(subscription.next_billing_date).toLocaleDateString()}</span>
            </div>
          )}

          {subscription.is_trial && subscription.trial_ends_at && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trial Ends</span>
              <span className="text-blue-600 font-medium">
                {new Date(subscription.trial_ends_at).toLocaleDateString()}
              </span>
            </div>
          )}

          {isCanceled && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Subscription Canceled</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Your subscription will end on {new Date(subscription.expires_at!).toLocaleDateString()}
              </p>
              {subscription.cancellation_reason && (
                <p className="text-xs text-yellow-600 mt-1">
                  Reason: {subscription.cancellation_reason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isActive && !isCanceled && (
            <>
              <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Change Plan
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Your Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Select New Plan</Label>
                      <Select value={selectedTier} onValueChange={setSelectedTier}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBSCRIPTION_TIERS.filter(tier => tier.id !== subscription.tier).map((tier) => (
                            <SelectItem key={tier.id} value={tier.id}>
                              {tier.name} - {tier.price} MWK/month
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Billing Cycle</Label>
                      <RadioGroup value={selectedBillingCycle} onValueChange={(value: 'monthly' | 'yearly') => setSelectedBillingCycle(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yearly" id="yearly" />
                          <Label htmlFor="yearly">Yearly (20% discount)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleUpgrade} 
                        disabled={!selectedTier || manageSubscription.isPending}
                        className="flex-1"
                      >
                        {manageSubscription.isPending ? 'Processing...' : 'Change Plan'}
                      </Button>
                      <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>When should the cancellation take effect?</Label>
                      <RadioGroup value={effectiveDate} onValueChange={(value: 'immediate' | 'end_of_period') => setEffectiveDate(value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="end_of_period" id="end_period" />
                          <Label htmlFor="end_period">At the end of current billing period</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="immediate" id="immediate" />
                          <Label htmlFor="immediate">Immediately</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Please tell us why you're canceling (optional)</Label>
                      <Textarea
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder="Your feedback helps us improve..."
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        onClick={handleCancel} 
                        disabled={manageSubscription.isPending}
                        className="flex-1"
                      >
                        {manageSubscription.isPending ? 'Processing...' : 'Cancel Subscription'}
                      </Button>
                      <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                        Keep Subscription
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          {isCanceled && (
            <Button 
              onClick={handleReactivate} 
              disabled={manageSubscription.isPending}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {manageSubscription.isPending ? 'Processing...' : 'Reactivate Subscription'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagementCard;
