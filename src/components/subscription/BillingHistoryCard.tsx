
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBillingHistory, useRetryPayment, usePaymentNotifications } from '@/hooks/usePaymentIntegration';
import { 
  Receipt, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  CreditCard,
  Smartphone,
  Building2
} from 'lucide-react';

const BillingHistoryCard: React.FC = () => {
  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card' | 'bank_transfer'>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const { data: billingHistory, isLoading: billingLoading } = useBillingHistory();
  const { data: notifications } = usePaymentNotifications();
  const retryPayment = useRetryPayment();

  const handleRetryPayment = () => {
    if (!selectedBilling) return;

    retryPayment.mutate({
      billing_id: selectedBilling.id,
      payment_method: paymentMethod,
      phone_number: paymentMethod === 'mobile_money' ? phoneNumber : undefined,
      email: email || undefined,
    }, {
      onSuccess: () => {
        setRetryDialogOpen(false);
        setSelectedBilling(null);
      }
    });
  };

  const getStatusBadge = (status: string, retryCount: number = 0) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Paid
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Failed {retryCount > 0 && `(${retryCount} attempts)`}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mobile_money':
        return <Smartphone className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer':
        return <Building2 className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  if (billingLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading billing history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Billing History & Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Failed Payment Notifications */}
        {notifications && notifications.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Payment Failures</span>
            </div>
            <p className="text-sm text-red-700">
              You have {notifications.length} failed payment(s) that need attention.
            </p>
          </div>
        )}

        {/* Billing History Table */}
        <div className="space-y-4">
          {billingHistory && billingHistory.length > 0 ? (
            billingHistory.map((billing: any) => (
              <div key={billing.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {billing.coach_subscriptions?.tier || 'Subscription'} Plan
                      </span>
                      {getStatusBadge(billing.status, billing.retry_count)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {billing.currency} {billing.amount} • {billing.coach_subscriptions?.billing_cycle || 'monthly'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(billing.created_at).toLocaleDateString()} • 
                      Ref: {billing.paychangu_reference}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {billing.status === 'paid' && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>
                    )}
                    
                    {billing.status === 'failed' && billing.retry_count < 3 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBilling(billing);
                          setRetryDialogOpen(true);
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>

                {billing.status === 'failed' && (
                  <div className="text-sm text-red-600">
                    Payment failed after {billing.retry_count} attempt(s).
                    {billing.retry_count >= 3 
                      ? ' Maximum retries exceeded. Please contact support.'
                      : ' You can retry the payment above.'
                    }
                  </div>
                )}

                {billing.paid_at && (
                  <div className="text-sm text-green-600">
                    ✓ Paid on {new Date(billing.paid_at).toLocaleString()}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No billing history found
            </div>
          )}
        </div>

        {/* Retry Payment Dialog */}
        <Dialog open={retryDialogOpen} onOpenChange={setRetryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retry Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedBilling && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedBilling.coach_subscriptions?.tier} Plan</p>
                  <p className="text-sm text-gray-600">
                    {selectedBilling.currency} {selectedBilling.amount} • Attempt {(selectedBilling.retry_count || 0) + 1}/3
                  </p>
                </div>
              )}

              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile_money">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile Money
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Debit/Credit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === 'mobile_money' && (
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+265..."
                    type="tel"
                  />
                </div>
              )}

              <div>
                <Label>Email (Optional)</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleRetryPayment} 
                  disabled={retryPayment.isPending}
                  className="flex-1"
                >
                  {retryPayment.isPending ? 'Processing...' : 'Retry Payment'}
                </Button>
                <Button variant="outline" onClick={() => setRetryDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BillingHistoryCard;
