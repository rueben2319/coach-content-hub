import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Layers, AlertTriangle, Clock } from 'lucide-react';
import { EnrollmentStatus } from '@/components/enrollment/EnrollmentStatus';
import { EnrollmentDialog } from '@/components/enrollment/EnrollmentDialog';
import { useCompleteEnrollment } from '@/hooks/useCourseEnrollment';
import { useInitiateCoursePayment } from '@/hooks/usePaymentIntegration';
import { useToast } from '@/hooks/use-toast';

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    coach_id: string;
    price: number;
    currency: string;
    description: string;
    estimated_duration: number;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  } | null;
  enrolled_at: string;
  amount: number;
  payment_status: string;
  expires_at: string | null;
}

const fetchEnrollments = async (userId: string): Promise<Enrollment[]> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      id,
      course:course_id (
        id,
        title,
        coach_id,
        price,
        currency,
        description,
        estimated_duration,
        profiles!coach_id (
          first_name,
          last_name
        )
      ),
      enrolled_at,
      amount,
      payment_status,
      expires_at
    `)
    .eq('client_id', userId)
    .order('enrolled_at', { ascending: false });

  if (error) {
    throw error;
  }
  // Filter out enrollments where course is null
  return (data || []).filter((enr: any) => enr.course) as Enrollment[];
};

// Helper for payment status badge
const getStatusBadge = (status: string) => {
  const statusConfig = {
    completed: { label: 'Active', variant: 'default' as const, icon: null },
    active: { label: 'Active', variant: 'default' as const, icon: null },
    pending: { label: 'Payment Pending', variant: 'secondary' as const, icon: <Clock className="w-3 h-3 mr-1" /> },
    expired: { label: 'Expired', variant: 'destructive' as const, icon: null },
    cancelled: { label: 'Cancelled', variant: 'outline' as const, icon: null },
    failed: { label: 'Payment Failed', variant: 'destructive' as const, icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
  };
  return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const, icon: null };
};

const ClientSubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const completeEnrollment = useCompleteEnrollment();
  const initiateCoursePayment = useInitiateCoursePayment();

  // Additional state for multi-select payments
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [paying, setPaying] = useState(false);

  const { data: enrollments, isLoading, error, refetch } = useQuery({
    queryKey: ['client-enrollments', user?.id],
    queryFn: () => {
      if (!user) throw new Error('No user found');
      return fetchEnrollments(user.id);
    },
    enabled: !!user,
  });

  const handleRetryPayment = async (enrollment: Enrollment) => {
    if (!enrollment.course) return;
    
    try {
      // Initiate payment using coach's PayChangu credentials
      await initiateCoursePayment.mutateAsync({
        enrollment_id: enrollment.id,
        course_id: enrollment.course.id,
        coach_id: enrollment.course.coach_id,
        amount: enrollment.amount,
        currency: enrollment.course.currency,
        payment_method: 'mobile_money', // Default method, could be configurable
        email: user?.email,
        return_url: `${window.location.origin}/client/subscription?payment_success=true`
      });
    } catch (error) {
      console.error('Payment retry failed:', error);
    }
  };

  const pendingEnrollments = enrollments?.filter(enr => enr.payment_status === 'pending') || [];
  const completedEnrollments = enrollments?.filter(enr => enr.payment_status === 'completed') || [];
  const failedEnrollments = enrollments?.filter(enr => enr.payment_status === 'failed') || [];

  // Handles select/unselect enrollments for bulk payment
  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Get selected pending enrollments
  const selectedEnrollments = pendingEnrollments.filter(enr =>
    selectedIds.includes(enr.id) && enr.course?.coach_id && enr.course?.price !== undefined
  );
  const totalToPay = selectedEnrollments.reduce((sum, enr) => sum + (enr.amount || 0), 0);

  // Assume all selected courses have a coach with paychangu enabled and same currency for simplicity
  // A full implementation would group by coach and currency

  const handleBulkPayment = async () => {
    setPaying(true);
    try {
      // Process each enrollment payment using coach's PayChangu credentials
      for (const enr of selectedEnrollments) {
        if (!enr.course) continue;
        
        await initiateCoursePayment.mutateAsync({
          enrollment_id: enr.id,
          course_id: enr.course.id,
          coach_id: enr.course.coach_id,
          amount: enr.amount,
          currency: enr.course.currency,
          payment_method: 'mobile_money', // Default method
          email: user?.email,
          return_url: `${window.location.origin}/client/subscription?payment_success=true`
        });
      }
      toast({ title: "Payment Initiated", description: "Payment windows opened for selected courses." });
      setSelectedIds([]);
    } catch (e: any) {
      toast({
        title: "Bulk payment failed",
        description: e.message || "",
        variant: "destructive"
      });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Layers className="w-7 h-7 text-blue-600" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            My Enrollments &amp; Subscriptions
          </h1>
        </div>

        {/* Pending Payments Alert */}
        {pendingEnrollments.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Pending Payments ({pendingEnrollments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-orange-700 text-sm mb-4">
                You have {pendingEnrollments.length} enrollment(s) waiting for payment completion. 
                Select multiple and pay at once if available.
              </p>
              <div className="space-y-4">
                {pendingEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="bg-white rounded-lg p-4 border border-orange-200 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(enrollment.id)}
                        onChange={() => handleSelect(enrollment.id)}
                        disabled={!!completeEnrollment.isPending}
                        className="accent-blue-600"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {enrollment.course?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          by {enrollment.course?.profiles ? 
                            `${enrollment.course.profiles.first_name || ''} ${enrollment.course.profiles.last_name || ''}`.trim() : 
                            'Unknown Instructor'
                          }
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {enrollment.course?.currency} {enrollment.amount}
                          </span>
                          <span>
                            Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Payment Pending
                      </Badge>
                      <Button 
                        onClick={() => handleRetryPayment(enrollment)}
                        disabled={initiateCoursePayment.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        {initiateCoursePayment.isPending ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 border-t pt-4">
                <div>
                  <strong>Selected Total: </strong>
                  {selectedEnrollments.length} course(s), {selectedEnrollments[0]?.course?.currency || 'MWK'} {totalToPay}
                </div>
                <Button
                  onClick={handleBulkPayment}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={selectedEnrollments.length < 2 || paying}
                >
                  {paying ? "Paying..." : `Pay for Selected Courses`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Failed Payments */}
        {failedEnrollments.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Failed Payments ({failedEnrollments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {failedEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {enrollment.course?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Payment failed - please try again
                      </p>
                      <div className="text-sm text-gray-500">
                        {enrollment.course?.currency} {enrollment.amount}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-2">
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Payment Failed
                      </Badge>
                      <Button 
                        onClick={() => handleRetryPayment(enrollment)}
                        disabled={initiateCoursePayment.isPending}
                        variant="outline"
                        size="sm"
                      >
                        {initiateCoursePayment.isPending ? 'Processing...' : 'Retry Payment'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Active Enrollments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Courses ({completedEnrollments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (completedEnrollments && completedEnrollments.length > 0) ? (
              <div className="divide-y space-y-0">
                {completedEnrollments.map((enr) => (
                  <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" key={enr.id}>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{enr.course?.title}</div>
                      <p className="text-sm text-gray-600 mb-1">
                        by {enr.course?.profiles ? 
                          `${enr.course.profiles.first_name || ''} ${enr.course.profiles.last_name || ''}`.trim() : 
                          'Unknown Instructor'
                        }
                      </p>
                      <div className="text-xs text-gray-500">
                        Enrolled: {new Date(enr.enrolled_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">
                          {enr.course?.currency} {enr.course?.price}
                        </span>
                        <Badge className="bg-green-500 hover:bg-green-600">
                          ✓ Active
                        </Badge>
                      </div>
                      {enr.expires_at && (
                        <div className="text-xs text-gray-400">
                          Expires: {new Date(enr.expires_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 p-6">
                You are not enrolled in any courses yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Contact our support team if you have questions about payments, subscriptions, or need help choosing the right course.
            </p>
            <Button variant="outline">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSubscriptionPage;
